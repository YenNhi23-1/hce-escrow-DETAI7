# 🏛️ BIÊN BẢN CỔNG DUYỆT 1 (GATE REVIEW 1)

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Thời điểm duyệt:** Buổi 12 (Tuần 4)  
**Tên repo:** `hce-badge-k58`  
**Commit quy chuẩn:** `lab-12: gate review 1 va cap nhat pham vi`  

---

## 🔍 PHẦN 1: TỰ KIỂM TRA SỨC KHỎE REPO TRƯỚC GIỜ DUYỆT
- [x] **README.md:** Nói rõ bài toán (bảo vệ danh tiếng học thuật), người dùng (Nhà trường, Sinh viên, Nhà tuyển dụng) và cách chạy.
- [x] **Bộ tài liệu docs:** `PROJECT_PLAN.md`, `SPEC.md`, `ECONOMIC_RULES.md` ăn khớp 100% với mã nguồn hiện tại.
- [x] **Biên dịch mã nguồn:** `ProjectCore.sol` biên dịch sạch sẽ (`0 errors, 0 warnings`) với Solidity `^0.8.20`, độ dài 110 dòng (đạt chuẩn dưới 150 dòng).
- [x] **Kiểm thử quy tắc:** Có đủ ca hợp lệ (`issueBadge`) và ca gian lận cố tình chuyển nhượng bị chặn (`revert NotTransferable()`).
- [x] **Lịch sử Git:** Có đóng góp và commit thực tế của cả 2 thành viên Trang và Nhi.

---

## 🎤 PHẦN 2: KỊCH BẢN DEMO 3 PHÚT TRƯỚC GIẢNG VIÊN

| Phân bổ | Người nói | Nội dung trình bày | Thao tác mở màn hình |
| :---: | :--- | :--- | :--- |
| **0:00 – 0:30**<br>*(30 giây)* | **Hoàng Thu Trang** | **Ai gặp vấn đề gì:** Sinh viên và nhà trường gặp nạn làm giả bằng khen/giấy chứng nhận; nếu dùng NFT thông thường thì sinh viên có thể rao bán danh hiệu trên OpenSea làm méo mó giá trị thực tế. | Mở tệp `README.md` chỉ vào Tuyên ngôn sản phẩm. |
| **0:30 – 1:00**<br>*(30 giây)* | **Hoàng Thu Trang** | **Quy tắc kinh tế quan trọng nhất:** Khóa Soulbound tuyệt đối qua hàm `_update`. Huy hiệu gắn chặt với ví sinh viên vĩnh viễn, không thể chuyển giao. Người tra cứu kiểm tra miễn phí gas. | Mở `docs/ECONOMIC_RULES.md` chỉ vào Mục 1 & 2. |
| **1:00 – 2:00**<br>*(60 giây)* | **Phan Thị Yến Nhi** | **Chạy một luồng thành công:** Thao tác trên Remix VM: Kết nối ví Issuer $\rightarrow$ Gọi hàm `issueBadge` cấp huy hiệu Loại 1 cho sinh viên $\rightarrow$ Giao dịch thành công, sinh viên nhận được Token ID #1. | Thao tác trực tiếp trên Remix VM và mở bảng Logs xem sự kiện `BadgeIssued`. |
| **2:00 – 2:30**<br>*(30 giây)* | **Phan Thị Yến Nhi** | **Chạy ca vi phạm bị chặn:** Đổi sang ví sinh viên, gọi `safeTransferFrom` để chuyển huy hiệu cho bạn $\rightarrow$ Hợp đồng lập tức chặn đứng bằng lỗi đỏ `NotTransferable()`. | Chỉ vào dòng lỗi đỏ `revert: NotTransferable()` trên Remix Console. |
| **2:30 – 3:00**<br>*(30 giây)* | **Hoàng Thu Trang** | **Kế hoạch tiếp theo:** Thực hiện kiểm thử tấn công Reentrancy (Lab 13), audit chéo với nhóm bạn (Lab 14) và hoàn thiện giao diện DApp kết nối MetaMask đưa lên GitHub Pages (Lab 15). | Mở `docs/PROJECT_PLAN.md` chỉ vào mốc Lab 13–15. |

---

## 📝 PHẦN 3: KẾT LUẬN CỦA GIẢNG VIÊN VÀ QUYẾT ĐỊNH PHẠM VI

- **KẾT LUẬN CHÍNH THỨC CỦA GIẢNG VIÊN:**  
  🏆 **ĐẠT (PASS)** — Codebase sạch sẽ, logic khớp đặc tả, demo trôi chảy đúng thời gian quy định.

- **3 việc bắt buộc hoàn thiện cho Lab 13–15:**
  1. *Việc 1:* Viết thêm ít nhất 2 ca kiểm thử tiêu cực (negative tests) trong `test/` để chuẩn bị cho bài học phòng chống tấn công Lab 13.
  2. *Việc 2:* Chuẩn bị danh mục 10 tiêu chí rà soát an toàn để sẵn sàng audit chéo cho nhóm bạn ở Lab 14.
  3. *Việc 3:* Kết nối hợp đồng lên Sepolia testnet và gắn giao diện Web DApp `web/index.html` ở Lab 15.

- **Tính năng chốt giữ lại (Nguyên tắc: Giữ luồng cốt lõi chạy chắc):**
  - Giữ vững luồng: Cấp phát Soulbound $\rightarrow$ Khóa chuyển nhượng $\rightarrow$ Tra cứu công khai $\rightarrow$ Thu hồi khi có vi phạm.
  - Cắt bỏ: Không mở rộng thêm tính năng sàn giao dịch hay đấu giá điểm thưởng (vì vi phạm triết lý Soulbound Token).

- **Hạn hoàn thành:** Tuần 5 (Lab 15).
