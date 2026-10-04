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
# NHẬT KÝ LÀM VIỆC VỚI AI — LAB 10 (AI_JOURNAL.md)

---

## 📌 1. BƯỚC 1 & BƯỚC 2: RÀ SOÁT HỢP ĐỒNG MẪU VAULTBUGGY.SOL

### 1.1. Sinh viên đọc thủ công (15 phút đầu, không dùng AI)
- Hai bạn Trang & Nhi tự đọc mã nguồn và nghi ngờ 3 điểm:
  1. Dòng 13: Biến `emergencyPin` để `private` nhưng lưu trên blockchain liệu có bị đọc trộm không?
  2. Dòng 35: Lệnh chuyển tiền `call{value: ...}` nằm TRƯỚC dòng trừ số dư `balances[msg.sender] -= amount`. Đây chính là lỗi Reentrancy nổi tiếng của vụ The DAO năm 2016.
  3. Dòng 51: Dùng `tx.origin == owner` để kiểm tra quyền đổi chủ sở hữu, vi phạm quy ước trong `AGENTS.md`.

### 1.2. Prompt gửi cho AI (Bước 2)
```text
Bạn là kiểm toán viên hợp đồng thông minh.
Rà soát hợp đồng dưới đây và liệt kê mọi lỗ hổng, xếp theo mức nghiêm trọng.
Với mỗi lỗ hổng, nêu: dòng số mấy, khai thác thế nào, sửa ra sao.
Chỉ trả lời dựa trên mã nguồn tôi cung cấp. Nếu không tìm thấy, nói là không tìm thấy, không suy đoán.

[Dán toàn bộ mã nguồn VaultBuggy.sol]
```

### 1.3. Phản hồi của AI & Đánh giá của Sinh viên
- **AI trả về:**
  - AI chỉ ra đúng: Lỗi Reentrancy ở hàm `withdraw` (Critical) và lỗi `tx.origin` ở hàm `changeOwner` (Medium).
  - **Chỗ AI làm sai nghiêm trọng (Ảo giác / Thiếu sót):** AI ban đầu cho rằng biến `private uint256 emergencyPin` là **an toàn** vì "từ khóa private không cho phép người ngoài truy cập từ hợp đồng khác".
- **Sinh viên phát hiện và phản bác AI:**
  - Sinh viên chỉ ra: Từ khóa `private` trong Solidity chỉ chặn truy cập ở mức code giữa các smart contract với nhau. Trên blockchain, toàn bộ storage slot đều công khai! Sinh viên đã chạy thực nghiệm lệnh `eth_getStorageAt` để đọc trộm thành công mã PIN `123456` từ Slot 2 và ép AI phải thừa nhận đây là lỗ hổng nghiêm trọng (High Severity).

---

## 📌 2. BƯỚC 4: AUDIT HỢP ĐỒNG CHÍNH PROJECTCORE.SOL

### 2.1. Prompt gửi cho AI (Audit kết hợp đối chiếu SPEC.md)
```text
Bạn là kiểm toán viên hợp đồng thông minh.
Dưới đây là bản đặc tả nghiệp vụ SPEC.md và mã nguồn hợp đồng ProjectCore.sol của chúng tôi.
Hãy rà soát hợp đồng và đối chiếu từng điều khoản trong đặc tả để tìm mọi lỗi logic nghiệp vụ và lỗ hổng bảo mật.
Xếp theo mức nghiêm trọng. Với mỗi lỗi, nêu: dòng số mấy, hậu quả, cách tái hiện và cách sửa.
Đặc biệt kiểm tra: phân quyền, khả năng cấp lại, chi phí gas và trường hợp dữ liệu rỗng.

[Dán docs/SPEC.md và contracts/project/ProjectCore.sol v0.1]
```

### 2.2. Kết quả đối chiếu giữa Sinh viên và AI
- **Công cụ AI tìm được:**
  - Lỗi thiếu kiểm tra chuỗi rỗng: `metadataURI` có thể bị truyền chuỗi `""`, dẫn đến việc mint ra huy hiệu không có dữ liệu chứng thực.
- **Những lỗi nghiêm trọng mà AI BỎ SÓT (Sinh viên tự tìm ra):**
  1. *Lỗi phân quyền Issuer bị bãi nhiệm:* AI không nhận ra khi Admin set `isIssuer[clb] = false`, hàm `revokeBadge` vẫn cho phép tài khoản đó thu hồi huy hiệu cũ vì điều kiện chỉ kiểm tra `msg.sender == b.issuedBy`.
  2. *Lỗi logic kẹt trạng thái cấp lại:* AI không nhận ra rằng khi thu hồi một huy hiệu, mapping `hasBadgeType` không được reset, dẫn đến sinh viên bị thu hồi nhầm sẽ vĩnh viễn không bao giờ được cấp lại huy hiệu đó.
  3. *Lỗi kiến trúc chi phí gas:* AI không chủ động đề xuất cơ chế cấp hàng loạt (`issueBatch`), khiến nhà trường phải chịu chi phí gas rất lớn khi trao giải cho nhiều sinh viên.

---

## 🎯 3. BẢNG TỔNG KẾT ĐÁNH GIÁ "AI PHÁT HIỆN" VS "SINH VIÊN PHÁT HIỆN" (BẮT BUỘC CHẤM ĐIỂM)

| STT | Mô tả lỗi phát hiện | Ai phát hiện | Đánh giá & Cách sinh viên xử lý |
| :---: | :--- | :---: | :--- |
| **1** | **Issuer bị tước quyền vẫn thu hồi được huy hiệu:**<br>Hàm `revokeBadge` không kiểm tra Issuer còn hiệu lực hay không. | **Sinh viên phát hiện** | Sinh viên tự phát hiện khi kiểm tra quy tắc quản trị. Đã bổ sung `isIssuer[msg.sender]` vào điều kiện cho phép. |
| **2** | **Kẹt vĩnh viễn quyền nhận lại huy hiệu khi bị thu hồi nhầm:**<br>Mapping `hasBadgeType` không được reset khi gọi `revokeBadge`. | **Sinh viên phát hiện** | Sinh viên tự phát hiện khi mô phỏng kịch bản đính chính sai sót. Đã thêm lệnh reset mapping và giảm `currentSupplyPerType`. |
| **3** | **Tham số `metadataURI` rỗng:**<br>Hàm `issueBadge` cho phép mint huy hiệu không có dữ liệu. | **Công cụ AI phát hiện** | AI phát hiện đúng. Sinh viên tiếp thu và bổ sung `revert EmptyMetadata()` nếu chuỗi rỗng. |
| **4** | **Thiếu hàm cấp phát theo lô (`issueBatch`):**<br>Gây nghẽn mạng và tốn kém chi phí gas khi cấp số lượng lớn. | **Sinh viên phát hiện**<br>*(Được cộng điểm)* | Sinh viên chủ động thiết kế thêm hàm `issueBatch` với trần an toàn 50 sinh viên/giao dịch. |

---

## 💡 4. BÀI HỌC KINH NGHIỆM KHI LÀM VIỆC VỚI AI

1. **AI chỉ bắt được lỗi kỹ thuật thông thường, không hiểu được nghiệp vụ sâu:** AI phát hiện rất nhanh lỗi cú pháp và tham số rỗng, nhưng **hoàn toàn thất bại** trong việc nhận diện lỗi logic kinh tế và phân quyền quản trị của đề tài.
2. **Không tin tưởng tuyệt đối vào AI:** Nếu sinh viên tin lời AI rằng biến `private` là an toàn, dự án sẽ mắc phải lỗ hổng chết người làm lộ dữ liệu. Thực nghiệm bằng công cụ Web3 mới là thước đo chính xác nhất.
