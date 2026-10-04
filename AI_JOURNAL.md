# NHẬT KÝ LÀM VIỆC VỚI AI — HCE SOULBOUND BADGE (ECO2432)

## Lab 08: Khởi tạo Codebase và Đặc tả v0.1 (Chủ đề 7: Huy hiệu thành tích không chuyển nhượng)

### Lần 1: Yêu cầu AI sinh bản đặc tả và quy tắc kinh tế cho đề tài Huy hiệu thành tích không chuyển nhượng (SBT)
- **Prompt:**
  ```text
  Bạn là Chuyên viên Phân tích Nghiệp vụ (BA) Web3. Hãy đọc tài liệu học phần ECO2432 và viết docs/SPEC.md cùng docs/ECONOMIC_RULES.md cho Chủ đề 7: "Huy hiệu thành tích không chuyển nhượng" (chuẩn ERC-721 Soulbound).
  Tuân thủ cấu trúc B.2 và Phần M.5 của Sổ tay thực hành ECO2432.
  ```
- **AI trả về:**
  - AI sinh ra một hợp đồng ERC-721 thông thường với logic cấm chuyển nhượng sơ sài.
  - Trong phần quy tắc kinh tế, AI đề xuất cơ chế "bán lại vé" và "thu phí hoa hồng chuyển nhượng 5%".
- **Đánh giá:** ❌ Sai, bỏ.
- **Chỗ sai:**
  1. *Lỗi hiểu sai bản chất đề tài:* Chủ đề 7 là **Huy hiệu thành tích không chuyển nhượng (SBT)**, không phải là Vé sự kiện có thể bán lại (Chủ đề 6). Huy hiệu thành tích là chứng nhận danh dự, miễn phí cho sinh viên và tuyệt đối không có tính năng bán lại hay thu phí giao dịch!
  2. *Lỗi kỹ thuật nghiêm trọng trong logic cấm chuyển nhượng:* AI đề xuất chặn bằng cách viết `if (soulbound) revert NotTransferable();` trong toàn bộ hàm chuyển token. Nếu viết như vậy, ngay cả hàm `_mint` (cấp huy hiệu từ `address(0)`) cũng bị revert, khiến Nhà trường không thể cấp phát được bất kỳ huy hiệu nào cho sinh viên (Lỗi số 2 trong bảng cảnh báo M.5 của Sổ tay).
- **Cách sửa:**
  1. Sinh viên viết lại toàn bộ bản đặc tả `docs/SPEC.md` và `docs/ECONOMIC_RULES.md`: Chuyển hoàn toàn sang mô hình "Nền kinh tế uy tín" (Reputation Economy), giá cấp phát 0 ETH, bảo đảm tính gắn liền danh tính cá nhân.
  2. Thiết kế logic chặn chuẩn trong `_update`:
     ```solidity
     address from = _ownerOf(tokenId);
     bool isTransfer = from != address(0) && to != address(0);
     if (soulbound && isTransfer) revert NotTransferable();
     ```
     Chỉ chặn khi cả `from` và `to` đều khác `address(0)`, cho phép `mint` và `burn` hoạt động trơn tru.
- **Ai phát hiện:** **Sinh viên phát hiện** *(Điểm cốt lõi thể hiện sự hiểu sâu bản chất nghiệp vụ và chuẩn OpenZeppelin v5).*

---

### Lần 2: Yêu cầu AI phản biện mô hình kinh tế theo vai "Người dùng thận trọng"
- **Prompt:**
  ```text
  Bạn là người dùng thận trọng. Chỉ dựa trên SPEC và ECONOMIC_RULES dưới đây, hãy nêu 5 cách một người có thể lạm dụng quy tắc hoặc làm người khác bị thiệt. Với mỗi cách, chỉ rõ quy tắc nào chưa đủ chặt. Không viết mã.
  [Dán nội dung SPEC.md và ECONOMIC_RULES.md của Chủ đề 7]
  ```
- **AI trả về:** Nêu 5 điểm nghi vấn (bán private key, lạm phát số lượng, cấp trùng, quyền thu hồi, link ảnh 404).
- **Đánh giá:** ✅ Dùng được rất tốt.
- **Cách sửa của nhóm:** Bổ sung `maxSupply`, mapping `hasBadge`, quyền `revokeBadge` đính kèm số quyết định kỷ luật.
- **Ai phát hiện:** Công cụ AI gợi ý phản biện $\rightarrow$ Sinh viên thẩm định và thiết kế lời giải.

---

## Lab 09: Hợp đồng đầu tiên: Két tiết kiệm có khóa thời gian & Chuyển giao vào ProjectCore

### Lần 1: Yêu cầu AI sinh mã TimeLockVault.sol theo SPEC.md và AGENTS.md
- **Prompt:**
  ```text
  Viết hợp đồng Solidity theo SPEC.md, tuân thủ AGENTS.md.
  Giải thích lựa chọn thiết kế trước khi đưa mã nguồn.
  ```
- **AI trả về:**
  ```solidity
  function withdraw() external {
      require(msg.sender == owner, "Only owner");
      require(block.timestamp >= unlockTime, "Locked");
      payable(owner).transfer(address(this).balance);
  }
  ```
- **Đánh giá:** ❌ Sai, bỏ.
- **Chỗ sai:**
  1. Dùng `transfer()` cứng 2.300 gas thay vì `.call{value: amount}("")`.
  2. Dùng chuỗi thông báo trong `require()` thay vì custom error `error NotOwner()`, `error StillLocked()`.
  3. Không tuân thủ thứ tự Checks-Effects-Interactions (không phát event hoặc không cập nhật trạng thái trước khi tương tác).
- **Cách sửa:** Sinh viên đối chiếu với bản mẫu chuẩn của giảng viên trong Sổ tay Lab 9: thay thế bằng custom error có tham số, phát event `Withdrawn` trước khi chuyển tiền, và dùng `call` kèm kiểm tra boolean `ok`.
- **Ai phát hiện:** **Sinh viên phát hiện**.

---

### Lần 2: Chuyển giao 4 kỹ thuật cốt lõi vào hợp đồng nhóm `ProjectCore.sol`
- **Prompt:**
  ```text
  Áp dụng 4 kỹ thuật vừa học từ TimeLockVault (Phân quyền, Event có indexed, Custom error, Checks-Effects-Interactions) để viết hợp đồng lõi ProjectCore.sol cho Chủ đề 7: Huy hiệu thành tích không chuyển nhượng (ERC-721 Soulbound). Độ dài dưới 120 dòng.
  ```
- **AI trả về:**
  - Hợp đồng kế thừa `ERC721` và `Ownable` từ OpenZeppelin v5.
  - Sử dụng hàm ghi đè `_update` để chặn chuyển nhượng khi `soulbound == true`.
  - Có các hàm: `issueBadge()`, `revokeBadge()`, `verifyBadge()`.
- **Đánh giá:** ✅ Dùng được, biên dịch thành công 100% trên Remix VM.
- **Ghi nhận học thuật:** Nhóm đã áp dụng trọn vẹn:
  1. *Phân quyền:* `onlyOwner` bảo vệ quyền cấp phát và thu hồi của Nhà trường.
  2. *Sự kiện:* `BadgeIssued` và `BadgeRevoked` có `indexed` giúp lọc dữ liệu on-chain theo địa chỉ sinh viên.
  3. *Custom Errors:* `SoldOut()`, `AlreadyClaimed()`, `NotTransferable()`, `InvalidRecipient()`, `NotFound()`.
  4. *Checks-Effects-Interactions:* Kiểm tra điều kiện $\rightarrow$ gán `hasBadge = true`, tăng `nextTokenId` $\rightarrow$ gọi `_safeMint()`.
