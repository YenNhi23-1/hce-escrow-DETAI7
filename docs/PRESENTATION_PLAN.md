# 🎤 PRESENTATION PLAN — Kịch bản trình bày sản phẩm 5 phút (Hoàn thiện Lab 15)

**Dự án:** HCE Soulbound Achievement Badge (Đề tài 07)  
**Môn học:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
*(Cả hai sinh viên đồng thực hiện, bình đẳng, không có trưởng nhóm)*  
**Đường dẫn DApp công khai:** `https://yennhi23-1.github.io/hce-escrow-DETAI7/`  
**Mã nguồn Repository:** `https://github.com/YenNhi23-1/hce-escrow-DETAI7.git`  
**Smart Contract:** `0x71C845A959F3Ff84a441E66B408665fB849a6479` (Ethereum Sepolia Testnet)  

---

## ⏱️ Khung thời gian và Phân công vai trò chi tiết (5 Phút)

Mỗi thành viên chịu trách nhiệm trực tiếp một phần và trình chiếu đúng **Artifact / Sản phẩm Web thật** do mình phụ trách (tuyệt đối không dùng slide PowerPoint tĩnh thay cho sản phẩm thực tế):

| Thời gian | Nội dung trình bày | Người phụ trách | Sản phẩm / Artifact phải mở | Mục tiêu thuyết phục |
| :---: | :--- | :--- | :--- | :--- |
| **0:00 – 0:30**<br>*(30 giây)* | **Bài toán & Động cơ kinh tế** | **Hoàng Thu Trang** | [README.md](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/README.md) | Nêu bật vấn nạn làm giả bằng khen/giấy chứng nhận và nguy cơ thương mại hóa khi dùng NFT thông thường. Khẳng định giải pháp Soulbound Token (SBT) của HCE. |
| **0:30 – 1:15**<br>*(45 giây)* | **Quy tắc kinh tế & Điểm chặn kỹ thuật** | **Hoàng Thu Trang** | [SPEC.md](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/docs/SPEC.md)<br>[ECONOMIC_RULES.md](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/docs/ECONOMIC_RULES.md) | Giải thích quy tắc cấm chuyển nhượng tại điểm chặn `_update()` quăng lỗi `revert NotTransferable()`, chống cấp trùng lặp và mô hình chi phí Gas do nhà trường tài trợ. |
| **1:15 – 2:45**<br>*(90 giây)* | **Live Demo: Luồng cấp phát & Xác thực** | **Phan Thị Yến Nhi** | Giao diện Web DApp trên GitHub Pages & Sepolia Etherscan | Trình diễn trực tiếp: Kết nối ví MetaMask -> Tra cứu Token ID #1 (miễn phí gas) -> Issuer ký cấp phát huy hiệu mới -> Xem giao dịch được xác nhận on-chain. |
| **2:45 – 3:30**<br>*(45 giây)* | **Live Demo: Thử nghiệm phủ định (Negative Test)** | **Phan Thị Yến Nhi** | Giao diện Web DApp (Nút "🚫 Thử Gọi Lệnh Chuyển Nhượng") | Cố tình chuyển nhượng huy hiệu sang ví thứ hai -> Hệ thống chặn đứng với mã lỗi `NotTransferable` và giao diện xử lý lỗi nhẹ nhàng bằng try/catch. |
| **3:30 – 4:15**<br>*(45 giây)* | **Rà soát an toàn & Kết quả Audit** | **Hoàng Thu Trang** | [AUDIT_REPORT.md](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/docs/AUDIT_REPORT.md)<br>[AI_JOURNAL.md](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/AI_JOURNAL.md) | Báo cáo các lỗ hổng đã được khắc phục từ Lab 10 (Check-Effects-Interactions, reset mapping thu hồi, cấp theo lô) và kinh nghiệm phản biện các ảo giác của AI. |
| **4:15 – 5:00**<br>*(45 giây)* | **Khả thi kinh tế L2 & Hướng phát triển** | **Phan Thị Yến Nhi** & **Hoàng Thu Trang** | [PROJECT_PLAN.md](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/docs/PROJECT_PLAN.md) | Phân tích bài toán kinh tế khi đưa lên Arbitrum/Base (chi phí < 0.005 USD/huy hiệu), lộ trình liên thông cổng SSO nhà trường và kết luận bài học. |

---

## 📌 Checklist chuẩn bị trước giờ G

- [x] Ví MetaMask của cả hai bạn Trang và Nhi đã nạp sẵn Sepolia ETH để demo giao dịch trực tiếp.
- [x] Giao diện DApp Web trên GitHub Pages đã được kiểm tra mượt mà trên cả trình duyệt máy tính và điện thoại di động.
- [x] Hợp đồng thông minh đã được công khai trên Sepolia Etherscan.
- [x] Đã thử nghiệm nút chuyển nhượng tiêu cực để đảm bảo hiển thị đúng mã lỗi `NotTransferable`.
- [x] Cả hai thành viên đã tập dượt khớp giờ (dry run) đảm bảo đúng 5 phút, mỗi người nói tròn vai 2.5 phút.
