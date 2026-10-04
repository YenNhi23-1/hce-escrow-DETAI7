# NHẬT KÝ LÀM VIỆC VỚI AI — LAB 10 (AI_JOURNAL.md)

**Môn học:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Sản phẩm:** Rà soát an toàn mã nguồn do AI sinh ra (Audit) & Khắc phục lỗi trên `ProjectCore.sol`  

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
