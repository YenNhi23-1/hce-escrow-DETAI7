# BÁO CÁO NỘP BÀI LAB 12: GATE REVIEW 1 — DUYỆT CODEBASE VÀ PHẠM VI

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Tệp quyết định chính:** `docs/GATE_REVIEW_1.md`  
**Commit quy chuẩn cuối buổi:** `lab-12: gate review 1 va cap nhat pham vi`  

---

## 1. KẾT QUẢ ĐÁNH GIÁ SỨC KHỎE REPO TRƯỚC HỘI ĐỒNG
- **Trạng thái Repo:** Đạt 100% tiêu chí sức khỏe (Codebase sạch, tài liệu đầy đủ, biên dịch không lỗi, commit có đủ cả hai bạn Trang và Nhi).
- **Kết luận Cổng duyệt 1:** 🏆 **QUA (PASS)**.
- **Kịch bản Demo 3 phút:** Đã thực hiện trôi chảy trước giảng viên:
  - 30s nêu rõ bài toán ngăn ngừa gian lận bằng khen số và nạn thương mại hóa danh hiệu.
  - 30s giải thích cơ chế khóa Soulbound Token qua `_update`.
  - 60s demo trực tiếp hàm `issueBadge` cấp phát thành công trên Remix VM.
  - 30s demo ca vi phạm: cố tình chuyển nhượng huy hiệu bị hợp đồng chặn đứng với lỗi `NotTransferable()`.
  - 30s chốt lộ trình hoàn thiện Lab 13–15.

---

## 2. QUYẾT ĐỊNH PHẠM VI VÀ CẬP NHẬT KẾ HOẠCH DỰ ÁN
- Nhóm tuân thủ nguyên tắc: **"Giữ một luồng cốt lõi chạy chắc, không cố giữ nhiều tính năng nửa vời"**.
- Kế hoạch triển khai cho giai đoạn Lab 13–15 đã được gán trách nhiệm cụ thể trong [docs/PROJECT_PLAN.md](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/docs/PROJECT_PLAN.md):
  - **Lab 13:** Viết ca thử tấn công gian lận và tối ưu hardening.
  - **Lab 14:** Thực hiện rà soát chéo (Audit chéo) với nhóm bạn.
  - **Lab 15:** Đưa DApp lên mạng công khai GitHub Pages và chuẩn bị thuyết trình cuối kỳ.

---

## 3. BẰNG CHỨNG COMMIT GIT
- **Lệnh commit quy chuẩn:**
  ```bash
  git commit -m "lab-12: gate review 1 va cap nhat pham vi"
  ```
