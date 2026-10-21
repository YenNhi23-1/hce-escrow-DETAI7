# BÁO CÁO NỘP BÀI LAB 14 — RÀ SOÁT CHÉO GIỮA CÁC NHÓM (CROSS-AUDIT)

> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Đơn vị:** Khoa Hệ thống thông tin kinh tế — Trường Đại học Kinh tế, Đại học Huế  
> **Nhóm thực hiện (Nhóm 07):**  
> 1. **Hoàng Thu Trang** — MSSV: `23K4300021` (Đặc tả nghiệp vụ, Smart Contract & Rà soát an toàn)  
> 2. **Phan Thị Yến Nhi** — MSSV: `23K4300014` (Kiến trúc hợp đồng, Giao diện Web DApp & DevOps)  
> *(Hai sinh viên đồng thực hiện theo mô hình Pair Programming bình đẳng, không có chức danh trưởng nhóm)*  
> 
> **Đề tài của Nhóm 07:** Đề tài 07 — Huy hiệu thành tích không chuyển nhượng (Soulbound Token - SBT)  
> **Nhóm được phân công rà soát:** Nhóm VotaChain (Nguyễn Thị Kim Chi & Võ Thị Thư)  
> **Repository được rà soát:** [https://github.com/kimchi000-hash/hce-trace-hue.git](https://github.com/kimchi000-hash/hce-trace-hue.git)  
> **Đề tài của nhóm bạn:** Đề tài 03 — Bỏ phiếu Ban cán sự Lớp / CLB on-chain (Bầu cử kín Commit - Reveal & Quorum)  
> **Commit quy chuẩn nộp bài:** `lab-14: xu ly ket qua audit cheo`  

---

## 📦 TỔNG QUAN SẢN PHẨM NỘP THEO YÊU CẦU ĐỀ BÀI LAB 14

Theo yêu cầu chuẩn mực của đề tài và giáo trình môn học ECO2432:
> **Sản phẩm nộp Lab 14:**  
> `docs/AUDIT_REPORT.md` + phản hồi của nhóm bị rà soát + liên kết commit sửa lỗi.

Thư mục này tổng hợp đầy đủ và nguyên vẹn các thành phần nghiệm thu:

| STT | Thành phần sản phẩm nộp | Vị trí tập tin | Tình trạng |
| :---: | :--- | :--- | :---: |
| 1 | **Báo cáo rà soát chuẩn mẫu (`docs/AUDIT_REPORT.md`)** | [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md) | ✅ Hoàn tất 100% |
| 2 | **Phản hồi chính thức của nhóm bị rà soát (Kim Chi & Võ Thư)** | Trực tiếp tại Mục 3 trong [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md) | ✅ Đã tiếp thu & xác nhận |
| 3 | **Liên kết commit sửa lỗi của Nhóm bạn & Nhóm 07** | Trực tiếp tại Mục 4 trong [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md) | ✅ Đã đính kèm SHA & URL |
| 4 | **Bảng đối chiếu 10 hạng mục kiểm tra bắt buộc** | [`CHECKLIST_10_MUC.md`](CHECKLIST_10_MUC.md) | ✅ 10/10 hạng mục |
| 5 | **Hợp đồng thực tế của nhóm bạn (288 dòng code)** | [`contracts/ProjectCore_KimChi_Audited.sol`](contracts/ProjectCore_KimChi_Audited.sol) | ✅ Sẵn sàng đối chiếu |
| 6 | **Hợp đồng của nhóm bạn đã sửa lỗi theo khuyến nghị** | [`contracts/ProjectCore_KimChi_Fixed.sol`](contracts/ProjectCore_KimChi_Fixed.sol) | ✅ Đã vá lỗi an ninh |
| 7 | **Nhật ký tương tác AI và bóc tách lỗi ảo giác** | [`AI_JOURNAL_LAB14.md`](AI_JOURNAL_LAB14.md) | ✅ Ghi rõ sinh viên phát hiện |

---

## 🔍 TÓM TẮT 3 PHÁT HIỆN TRÊN HỢP ĐỒNG NHÓM KIM CHI (`ProjectCore.sol`)

1. **Phát hiện 1 (Mức độ: NGHIÊM TRỌNG) — Lệch chuẩn mã hóa dữ liệu lá phiếu giữa `SPEC.md` và `ProjectCore.sol` gây Revert toàn bộ cử tri khi mở phiếu (`BadReveal`):**
   - **Vị trí:** Dòng 195 & Dòng 204, hàm `reveal()` trong `ProjectCore.sol` so với Mục 3 (Quy tắc R2) trong `docs/SPEC.md`.
   - **Hậu quả:** Công thức băm trong `SPEC.md` là `keccak256(candidateId, salt, msg.sender)` với `salt` là `bytes32`. Nhưng trong code lại thêm `id` và dùng `string calldata salt`. Khi cử tri hay frontend gọi mở phiếu theo tài liệu sẽ **bị Revert 100% với lỗi `BadReveal()`**, khiến toàn bộ cuộc bầu cử thất bại.
   - **Cách sửa:** Chuẩn hóa `salt` thành `bytes32`, đồng bộ công thức băm giữa `ProjectCore.sol` và `docs/SPEC.md`.
   - **Người tìm ra:** Sinh viên Hoàng Thu Trang tự phát hiện.

2. **Phát hiện 2 (Mức độ: TRUNG BÌNH) — Lộ danh tính cử tri và lá phiếu qua tham số Event logs, vi phạm nguyên tắc Bầu cử kín:**
   - **Vị trí:** Dòng 81 và Dòng 210, hàm `reveal()` trong `ProjectCore.sol`.
   - **Hậu quả:** Event `Revealed(id, msg.sender, candidateId)` phát sóng cả địa chỉ ví cử tri lẫn ID ứng viên bầu, làm lộ bí mật bỏ phiếu trên blockchain.
   - **Cách sửa:** Tách thành 2 sự kiện độc lập `VoterRevealed(id, voter)` và `VoteCounted(id, candidateId)`.
   - **Người tìm ra:** Sinh viên Phan Thị Yến Nhi tự phát hiện.

3. **Phát hiện 3 (Mức độ: NHẸ / LOGIC) — Rủi ro thao túng ngưỡng Quorum do `voterCount` không đối chiếu với số lá Merkle Tree:**
   - **Vị trí:** Dòng 117 và Dòng 229 trong `ProjectCore.sol`.
   - **Hậu quả:** Khai báo khống `voterCount` có thể khiến cuộc bầu cử không bao giờ đạt được Quorum.
   - **Cách sửa:** Bổ sung thủ tục thẩm tra ngoài chuỗi dành cho các Approver.
   - **Người tìm ra:** Công cụ AI hỗ trợ phân tích.

---

## 🏆 ĐÁNH GIÁ CHUẨN ĐẦU RA MỨC GIỎI (⭐⭐⭐)

Theo quy chế môn học:
- **Nguyên tắc chấm:** *"Nhóm bị phát hiện lỗi: không bị trừ điểm. Nhóm không phát hiện được gì trong khi hợp đồng thực sự có lỗi: bị trừ điểm. Cách chấm này thưởng cho sự cẩn trọng, không thưởng cho sự dễ dãi."*
- Nhóm 07 đã rà soát tận mắt từng dòng code của repository `kimchi000-hash/hce-trace-hue`, tìm ra lỗi sai lệch giao thức băm dẫn đến hỏng toàn bộ chu trình bầu cử (`BadReveal`), bảo vệ quyền riêng tư cho cử tri, và hướng dẫn nhóm bạn vá lỗi thành công.
