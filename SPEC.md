# SPEC — HCE Soulbound Achievement Badge (v0.1)

## 1. Mục đích
Hệ thống hợp đồng thông minh phát hành, quản lý và xác thực huy hiệu thành tích số không thể chuyển nhượng (Soulbound Token - SBT) trên blockchain cho Câu lạc bộ và Nhà trường (HCE), đảm bảo ghi nhận thành tích sinh viên một cách minh bạch, chống gian lận và không thể mua bán.

---

## 2. Đầu vào
- **Địa chỉ người nhận (Recipient Address):** Kiểu `address` (42 ký tự hex bắt đầu bằng `0x`), đại diện cho ví cá nhân của sinh viên đạt giải thưởng / thành tích. Do Admin hoặc Issuer cung cấp.
- **Loại huy hiệu (Badge Type):** Kiểu `uint256`, mã định danh cho danh mục giải thưởng (ví dụ: `1`: Sinh viên 5 Tốt cấp Trường; `2`: Giải Nhất Nghiên cứu Khoa học K58; `3`: Cán bộ Đoàn xuất sắc). Do Issuer cung cấp.
- **Dữ liệu bổ sung (Metadata URI / Hash):** Kiểu `string` (chuỗi URL IPFS hoặc mã băm keccak256 chứa tên giải thưởng, số quyết định khen thưởng, ngày ban hành).
- **Mã định danh huy hiệu (Token ID):** Kiểu `uint256`, số thứ tự tuần tự tăng dần tự động được sinh ra trong hợp đồng khi mint.
- **Địa chỉ người thực thi:** `msg.sender` (được đọc tự động từ ví khi người dùng/admin ký giao dịch).

---

## 3. Quy tắc nghiệp vụ (Business Rules)
- **R1 (Quyền cấp phát):** Chỉ có Chủ sở hữu hợp đồng (`owner`) hoặc các Đơn vị phát hành được ủy quyền hợp lệ (`isIssuer[msg.sender] == true`) mới có quyền phát hành (mint) huy hiệu cho sinh viên qua hàm `issueBadge`.
- **R2 (Tính bất biến Soulbound - Cấm chuyển nhượng):** Huy hiệu sau khi được cấp phát vào ví sinh viên sẽ bị khóa chặt với ví đó vĩnh viễn. Mọi nỗ lực chuyển nhượng thông thường giữa 2 ví cá nhân (`transferFrom`, `safeTransferFrom` với `from != address(0)` và `to != address(0)`) đều bắt buộc phải bị chặn và hoàn tác (`revert NotTransferable()`).
- **R3 (Ngoại lệ chuyển nhượng hợp lệ):** Thao tác chuyển token chỉ được phép diễn ra trong 2 tình huống duy nhất:
  - Khi phát hành huy hiệu mới (`from == address(0)` - Mint).
  - Khi thu hồi huy hiệu do vi phạm (`to == address(0)` - Burn).
- **R4 (Chống cấp trùng lặp):** Mỗi địa chỉ sinh viên chỉ được phép nhận duy nhất 01 huy hiệu cho cùng một loại danh mục giải thưởng (`hasBadgeType[student][badgeType] == false`). Nếu vi phạm, giao dịch bị từ chối bằng lỗi `BadgeAlreadyAwarded()`.
- **R5 (Giới hạn số lượng cấp phát trần):** Mỗi loại huy hiệu có thể thiết lập số lượng tối đa (`maxSupplyPerType`). Tổng số huy hiệu đã cấp phát của loại đó không được vượt quá số lượng trần.
- **R6 (Quyền thu hồi có thẩm quyền - Revocation):** Trong trường hợp phát hiện sinh viên gian lận học thuật hoặc có quyết định kỷ luật/hủy kết quả, chỉ Admin hoặc chính đơn vị đã cấp mới có quyền gọi hàm `revokeBadge(tokenId, reason)` để vô hiệu hóa huy hiệu.
- **R7 (Tra cứu mở không tốn phí):** Bất kỳ cá nhân hoặc tổ chức nào (nhà tuyển dụng, nhà tài trợ) đều có thể gọi hàm xem dữ liệu (`verifyBadge`, `hasBadge`) để xác thực tính hợp lệ của huy hiệu mà không mất bất kỳ chi phí gas nào.
- **R8 (Ghi nhận sự kiện minh bạch):** Mọi hành động làm thay đổi trạng thái (cấp phát, thu hồi, thêm đơn vị ủy quyền) đều phải phát ra sự kiện (`event`) tương ứng để phục vụ index và giám sát on-chain.

---

## 4. Đầu ra
- **Sự kiện On-chain (Events):**
  - `BadgeIssued(uint256 indexed tokenId, address indexed student, uint256 indexed badgeType, string metadataURI)`
  - `BadgeRevoked(uint256 indexed tokenId, address indexed revokedBy, string reason)`
  - `IssuerAuthorized(address indexed issuer)`
  - `IssuerRevoked(address indexed issuer)`
- **Dữ liệu trạng thái lưu trữ:**
  - `ownerOf(tokenId)`: Trả về địa chỉ ví sinh viên sở hữu huy hiệu.
  - `isBadgeValid(tokenId)`: Trả về trạng thái `true` (hợp lệ) hoặc `false` (đã bị thu hồi).
  - `tokenURI(tokenId)`: Trả về chuỗi metadata chứa thông tin thành tích.
- **Hiển thị trên giao diện DApp Web:**
  - Bảng hồ sơ thành tích cá nhân của sinh viên khi kết nối ví.
  - Huy hiệu đồ họa có nhãn rõ ràng: "SBT - Non-Transferable" (Chứng nhận bất biến).
  - Khung tra cứu cho nhà tuyển dụng: Hiển thị đầy đủ thông tin: Người cấp, Ngày cấp, Mã token, Tình trạng hiệu lực (Hợp lệ / Bị thu hồi).

---

## 5. Trường hợp ngoại lệ (Edge Cases & Errors)
- **E1 (Cố tình chuyển nhượng):** Nếu sinh viên gọi `safeTransferFrom` để bán hoặc tặng huy hiệu cho bạn học:
  - *Hành vi:* Giao dịch bị hủy bỏ, trạng thái không đổi, báo lỗi `NotTransferable()`.
- **E2 (Cấp trùng lặp):** Nếu Admin vô tình gửi cùng một loại huy hiệu 2 lần cho cùng một sinh viên:
  - *Hành vi:* Giao dịch bị từ chối ngay ở bước Checks, báo lỗi `BadgeAlreadyAwarded()`.
- **E3 (Kẻ gian mạo danh Issuer):** Nếu một tài khoản bất kỳ trên mạng cố tình gọi hàm `issueBadge`:
  - *Hành vi:* Giao dịch bị revert ngay lập tức với lỗi `NotAuthorized()`.
- **E4 (Cấp phát vào địa chỉ rỗng):** Nếu tham số địa chỉ sinh viên nhập vào là `address(0)`:
  - *Hành vi:* Giao dịch bị revert với lỗi `InvalidRecipient()`.
- **E5 (Tra cứu huy hiệu không tồn tại):** Nếu người dùng tra cứu mã `tokenId` chưa từng được cấp phát:
  - *Hành vi:* Hàm `verifyBadge` trả về `exists = false` mà không gây treo hoặc crash hệ thống.
- **E6 (Vượt quá số lượng trần):** Nếu số lượng giải thưởng đã đạt tối đa mà Issuer vẫn tiếp tục cấp:
  - *Hành vi:* Giao dịch bị revert với lỗi `ExceedsMaxSupply()`.

---

## 6. Ngoài phạm vi (Out of Scope)
- Không có cơ chế mua bán, định giá tiền tệ hoặc đấu giá huy hiệu (vi phạm triết lý Soulbound Token).
- Không chuyển đổi huy hiệu thành token ERC-20 để rút tiền mặt.
- Không lưu trữ tệp tin hình ảnh bằng khen dung lượng lớn trực tiếp lên bộ nhớ lưu trữ đắt đỏ của blockchain Ethereum (chỉ lưu hash hoặc IPFS link).
- Không tự động cập nhật điểm rèn luyện lên hệ thống ERP của trường (cần cổng trung gian backend xử lý riêng ở giai đoạn sau).
