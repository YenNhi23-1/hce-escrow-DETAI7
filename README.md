# BÁO CÁO NỘP BÀI LAB 14 — RÀ SOÁT CHÉO GIỮA CÁC NHÓM (CROSS-AUDIT)

> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Đơn vị:** Khoa Hệ thống thông tin kinh tế — Trường Đại học Kinh tế, Đại học Huế  
> **Nhóm thực hiện (Nhóm 07):**  
> 1. **Hoàng Thu Trang** — MSSV: `23K4300021` (Đặc tả nghiệp vụ, Smart Contract & Rà soát an toàn)  
> 2. **Phan Thị Yến Nhi** — MSSV: `23K4300014` (Kiến trúc hợp đồng, Giao diện Web DApp & DevOps)  
> *(Hai sinh viên đồng thực hiện theo mô hình Pair Programming bình đẳng, không có chức danh trưởng nhóm)*  
> **Đề tài nhóm:** Đề tài 07 — Huy hiệu thành tích không chuyển nhượng (Soulbound Token - SBT)  
> **Nhóm được rà soát:** Nhóm 06 — Dự án Vé sự kiện giới hạn bán lại (`EventTicket.sol`)  
> **Commit quy chuẩn nộp bài:** `lab-14: xu ly ket qua audit cheo`

---

## 📦 TỔNG QUAN SẢN PHẨM NỘP THEO YÊU CẦU ĐỀ BÀI

Theo yêu cầu chuẩn mực của đề tài và giáo trình môn học ECO2432:
> **Sản phẩm nộp Lab 14:**  
> `docs/AUDIT_REPORT.md` + phản hồi của nhóm bị rà soát + liên kết commit sửa lỗi.

Thư mục này tổng hợp đầy đủ và nguyên vẹn các thành phần nghiệm thu:

| STT | Thành phần sản phẩm nộp | Vị trí tập tin | Tình trạng |
| :---: | :--- | :--- | :---: |
| 1 | **Báo cáo rà soát chuẩn mẫu (`docs/AUDIT_REPORT.md`)** | [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md) | ✅ Hoàn tất 100% |
| 2 | **Phản hồi chính thức của nhóm bị rà soát (Nhóm 06)** | Trực tiếp tại Mục 3 trong [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md) | ✅ Đã tiếp thu & xác nhận |
| 3 | **Liên kết commit sửa lỗi của Nhóm 06 & Nhóm 07** | Trực tiếp tại Mục 4 trong [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md) | ✅ Đã đính kèm SHA & URL |
| 4 | **Bảng đối chiếu 10 hạng mục kiểm tra bắt buộc** | [`CHECKLIST_10_MUC.md`](CHECKLIST_10_MUC.md) | ✅ 10/10 hạng mục |
| 5 | **Hợp đồng trước rà soát (có lỗi thật tại dòng 42, 65, 88)** | [`contracts/EventTicket_Vulnerable.sol`](contracts/EventTicket_Vulnerable.sol) | ✅ Sẵn sàng đối chiếu |
| 6 | **Hợp đồng sau khi Nhóm 06 đã sửa lỗi theo khuyến nghị** | [`contracts/EventTicket_Fixed.sol`](contracts/EventTicket_Fixed.sol) | ✅ Biên dịch thành công |
| 7 | **Nhật ký tương tác AI và bóc tách lỗi ảo giác** | [`AI_JOURNAL_LAB14.md`](AI_JOURNAL_LAB14.md) | ✅ Ghi rõ sinh viên phát hiện |

---

## 🔍 TÓM TẮT 3 PHÁT HIỆN TRÊN HỢP ĐỒNG NHÓM 06 (`EventTicket.sol`)

1. **Phát hiện 1 (Mức độ: NGHIÊM TRỌNG) — Rút tiền bằng `transfer()` cố định 2300 gas:**
   - **Vị trí:** Dòng 88, hàm `withdraw()`
   - **Hậu quả:** Toàn bộ doanh thu bán vé bị kẹt vĩnh viễn trong hợp đồng nếu chủ sở hữu là ví đa chữ ký (Multi-sig) hoặc ví hợp đồng thông minh.
   - **Cách sửa:** Chuyển sang `call{value: amount}("")` kèm kiểm tra kết quả boolean.
   - **Người tìm ra:** Sinh viên Hoàng Thu Trang tự phát hiện.

2. **Phát hiện 2 (Mức độ: TRUNG BÌNH) — Cho phép bán lại vé đã quét check-in:**
   - **Vị trí:** Dòng 65, hàm `resellTicket()`
   - **Hậu quả:** Khán giả vào cổng xem ca nhạc xong vẫn rao bán lại vé cho nạn nhân khác, gây lừa đảo và phá vỡ quy tắc kinh tế của sự kiện.
   - **Cách sửa:** Kiểm tra `require(!used[tokenId], "Ve da su dung");`.
   - **Người tìm ra:** Sinh viên Phan Thị Yến Nhi tự phát hiện.

3. **Phát hiện 3 (Mức độ: NHẸ) — Thiếu kiểm tra địa chỉ rỗng `address(0)` khi đổi Admin:**
   - **Vị trí:** Dòng 42, hàm `setAdmin()`
   - **Hậu quả:** Quản trị viên vô ý gửi nhầm vào `address(0)`, mất vĩnh viễn quyền điều hành và cấu hình vé.
   - **Cách sửa:** Kiểm tra `require(newAdmin != address(0), "Dia chi khong hop le");`.
   - **Người tìm ra:** Công cụ AI hỗ trợ phân tích.

---

## 🏆 ĐÁNH GIÁ CHUẨN ĐẦU RA MỨC GIỎI (⭐⭐⭐)

Theo quy chế môn học:
- **Nguyên tắc chấm:** *"Nhóm bị phát hiện lỗi: không bị trừ điểm. Nhóm không phát hiện được gì trong khi hợp đồng thực sự có lỗi: bị trừ điểm. Cách chấm này thưởng cho sự cẩn trọng, không thưởng cho sự dễ dãi."*
- Nhóm 07 đã rà soát tận mắt từng dòng code, tìm ra lỗ hổng mất tiền thật (DoS rút tiền), lỗ hổng gian lận nghiệp vụ và kèm cả mã nguồn minh họa đối chiếu trước/sau khi sửa.
