# CHECKLIST NGHIỆM THU LAB 15 (EVIDENCE/CHECKLIST.MD)

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
- **Hoàng Thu Trang** — MSSV: `23K4300021`  
- **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
*(Cả hai sinh viên đồng thực hiện, không có trưởng nhóm)*  
**Đề tài 07:** Huy hiệu thành tích không chuyển nhượng (Non-transferable Achievement Badge / Soulbound Token - SBT)  
**Mục tiêu Lab 15:** Hoàn thiện giao diện Web DApp, kết nối hợp đồng trên mạng Sepolia Testnet, triển khai công khai GitHub Pages và lập kế hoạch thuyết trình.

---

## 📌 BẢNG CHECKLIST TIÊU CHÍ NGHIỆM THU

| STT | Tiêu chí đánh giá Lab 15 | Kết quả | Mô tả minh chứng kỹ thuật |
| :---: | :--- | :---: | :--- |
| **1** | **Giao diện Web DApp kết nối Web3** | **ĐẠT (PASS)** | Giao diện tại `web/index.html` tích hợp **Ethers.js v6**, hỗ trợ kết nối ví MetaMask, tự động phát hiện mạng Sepolia Testnet (Chain ID `11155111`). |
| **2** | **Bảng ánh xạ hàm Smart Contract** | **ĐẠT (PASS)** | Có bảng đối chiếu chi tiết giữa nút giao diện và các hàm Solidity (`verifyBadge`, `issueBadge`, `revokeBadge`, `safeTransferFrom`). |
| **3** | **Hàm đọc trạng thái miễn phí Gas** | **ĐẠT (PASS)** | Hàm view `verifyBadge(uint256)` cho phép bên thứ ba tra cứu chứng nhận on-chain tức thì, tiêu tốn **0 Wei**. |
| **4** | **Xử lý ngoại lệ thân thiện (Error Handling)** | **ĐẠT (PASS)** | Bắt lỗi `revert NotTransferable()` và `BadgeAlreadyAwarded()` bằng khối `try/catch`, hiển thị thông báo trực quan, không để crash ứng dụng. |
| **5** | **Nút Demo vi phạm quy tắc kinh tế (Negative Test)** | **ĐẠT (PASS)** | Cung cấp nút chuyên biệt *"Thử Nghiệm Bán/Chuyển Nhượng Huy Hiệu"* để chứng minh tính chất Soulbound bất biến trước hội đồng chấm thi. |
| **6** | **Xuất bản công khai lên GitHub Pages** | **ĐẠT (PASS)** | Địa chỉ truy cập trực tiếp: `https://yennhi23-1.github.io/hce-escrow-DETAI7/`, hỗ trợ giao diện co giãn trên di động. |
| **7** | **Kế hoạch thuyết trình 5 phút (Presentation Plan)** | **ĐẠT (PASS)** | Cập nhật hoàn thiện tại `docs/PRESENTATION_PLAN.md`, phân công chi tiết theo từng giây cho cả 2 bạn Trang và Nhi. |
| **8** | **Commit Git đúng chuẩn và gắn Tag** | **ĐẠT (PASS)** | Commit: `lab-15: public dapp va presentation plan` và gắn thẻ phát hành: `git tag v0.1-demo`. |

---

## ✍️ XÁC NHẬN CỦA HAI THÀNH VIÊN

- **Hoàng Thu Trang:** Đã kiểm tra và xác nhận code Web DApp và xử lý sự kiện Web3.  
- **Phan Thị Yến Nhi:** Đã kiểm tra và xác nhận triển khai GitHub Pages và kịch bản thuyết trình.  
*(Cả hai thống nhất 100% nội dung nộp bài)*
