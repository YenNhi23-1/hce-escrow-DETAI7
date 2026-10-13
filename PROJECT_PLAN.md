# 📋 PROJECT PLAN — HCE Soulbound Achievement Badge

**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Non-transferable Achievement Badge / Soulbound Token)  
**Nhóm sinh viên thực hiện:** Nhóm 07 - Lớp ECO2432 (Khoa HTTT Kinh tế, Trường ĐH Kinh tế - ĐH Huế)  

---

## 👥 1. Thành viên và phương thức làm việc

Nhóm gồm **02 thành viên bình đẳng**, không phân chia trưởng nhóm. Cả hai áp dụng mô hình **cộng tác đồng hành (Pair Programming & Co-working)**: cùng thảo luận, cùng xây dựng đặc tả, cùng viết mã hợp đồng, cùng thiết kế giao diện và cùng kiểm thử bảo mật.

| Họ và tên | Mã sinh viên | Trách nhiệm chính trong dự án |
| :--- | :---: | :--- |
| **Hoàng Thu Trang** | 23K4300021 | Cùng phụ trách toàn diện: Khảo sát & viết đặc tả nghiệp vụ (`SPEC.md`, `ECONOMIC_RULES.md`), lập trình Smart Contract, dựng giao diện DApp và kiểm thử bảo mật. |
| **Phan Thị Yến Nhi** | 23K4300014 | Cùng phụ trách toàn diện: Lập trình Smart Contract (`ProjectCore.sol`), khảo sát nghiệp vụ, dựng giao diện DApp Web và kiểm thử rà soát an toàn. |

*(Nguyên tắc làm việc: Hai thành viên chủ yếu làm việc cùng nhau, thảo luận trực tiếp và cùng phản biện mọi quyết định kỹ thuật cũng như kinh tế, không phân tách công việc một cách hoàn toàn cứng nhắc).*

---

## 🎯 2. Người dùng và bài toán

### 👤 Người dùng chính
1. **Bên phát hành (Issuer / Authority):** Ban chủ nhiệm Câu lạc bộ sinh viên, Đoàn Thanh niên, Khoa Hệ thống Thông tin Kinh tế hoặc Phòng Đào tạo & Công tác Sinh viên Trường ĐH Kinh tế - ĐH Huế.
2. **Người thụ hưởng (Recipient / Student Holder):** Sinh viên đạt thành tích xuất sắc trong học tập, nghiên cứu khoa học, hoạt động phong trào, tình nguyện, hoặc các giải thưởng học thuật.
3. **Bên thẩm định & đối soát (Verifier / Third-party):** Doanh nghiệp tuyển dụng, hội đồng xét học bổng, nhà tài trợ cần xác thực hồ sơ năng lực của ứng viên một cách minh bạch, tức thì.

### ⚠️ Vấn đề cần giải quyết
- **Làm giả và phóng đại thành tích:** Giấy khen giấy hoặc ảnh chứng nhận số thông thường rất dễ bị Photoshop, làm giả chữ ký/con dấu.
- **Rủi ro thương mại hóa danh hiệu khi dùng NFT thông thường:** Nếu phát hành chứng nhận bằng chuẩn NFT ERC-721 thông thường, người nhận có thể rao bán, chuyển nhượng hoặc cho mượn token trên các sàn giao dịch (như OpenSea). Khi đó, người không có năng lực vẫn sở hữu được chứng chỉ ("mua bằng, bán danh hiệu").
- **Chi phí xác minh truyền thống tốn kém:** Các tổ chức tuyển dụng phải gửi công văn hoặc đối chiếu sổ sách thủ công qua nhiều phòng ban, tốn nhiều thời gian và nguồn lực.

### 📱 Sản phẩm cuối nhìn thấy được
1. **Smart Contract `ProjectCore.sol`:** Chuẩn ERC-721 Soulbound được triển khai trên mạng thử nghiệm Ethereum Sepolia, tích hợp tính năng cấm chuyển nhượng (`revert NotTransferable()`), quyền cấp phát theo vai trò (Role-based minting) và quyền thu hồi khi phát hiện gian lận.
2. **Giao diện Web DApp (`web/index.html`):** 
   - Đăng nhập kết nối ví MetaMask.
   - Giao diện cho Admin/Issuer: Nhập địa chỉ ví sinh viên, mã định danh thành tích, bấm "Cấp Huy Hiệu".
   - Giao diện cho Sinh viên: Xem phòng trưng bày danh hiệu số cá nhân đã đạt được, thông báo khóa vĩnh viễn không thể chuyển giao.
   - Giao diện cho Bên thứ ba: Nhập Token ID hoặc địa chỉ ví để kiểm tra tức thì: tình trạng hợp lệ, người cấp, ngày cấp, danh hiệu đạt được.

---

## 🚩 3. Các mốc triển khai bắt buộc (Milestones)

- **Lab 8 (Buổi 8):** Khởi tạo codebase nhóm, phân vai, xây dựng kế hoạch dự án, viết đặc tả nghiệp vụ `docs/SPEC.md` v0.1 và mô hình kinh tế `docs/ECONOMIC_RULES.md`.
- **Lab 9 (Buổi 9):** Thực hành mô hình giữ tiền có điều kiện `TimeLockVault.sol` (training), khởi tạo khung hợp đồng `ProjectCore.sol` và đảm bảo biên dịch thành công (`lab-09: contract loi bien dich duoc`).
- **Lab 10 (Buổi 10):** Rà soát mã nguồn do AI sinh ra (Audit), thực nghiệm đọc bộ nhớ riêng tư on-chain, sửa lỗi trong `ProjectCore.sol` (`lab-10: audit va sua loi project core`).
- **Lab 11 (Buổi 11):** Cài đặt trọn vẹn quy tắc Soulbound (chặn chuyển nhượng qua `_update`), kiểm thử ca thành công và ca cố tình chuyển nhượng bị chặn (`lab-11: cai quy tac kinh te va test`).
- **Lab 12 (Buổi 12 - Tuần 4):** **Gate Review 1** — Trình bày và chứng minh repo đạt yêu cầu trước giảng viên; bảo vệ tính khả thi và chốt phạm vi rút gọn nếu cần (`lab-12: gate review 1 va cap nhat pham vi`).
- **Lab 13 (Buổi 13):** Thực nghiệm tấn công Reentrancy và kiểm thử các ca gian lận/vượt quyền đối với hợp đồng của nhóm (`lab-13: them negative test va hardening`).
- **Lab 14 (Buổi 14):** Rà soát chéo (Audit chéo) với repo của nhóm khác, lập biên bản `AUDIT_REPORT.md` (`lab-14: xu ly ket qua audit cheo`).
- **Lab 15 (Buổi 15):** Hoàn thiện giao diện Web DApp, kết nối hợp đồng trên mạng Sepolia, deploy GitHub Pages và lập kế hoạch thuyết trình (`lab-15: public dapp va presentation plan`, tag `v0.1-demo`).

---

## 🚀 4. Cập nhật và quyết định phạm vi sau Cổng duyệt 1 (Gate Review 1 Scope Update)

Sau khi hoàn thành phiên bảo vệ **Cổng duyệt 1 (Gate Review 1)** tại Buổi 12 trước giảng viên bộ môn, nhóm đã tiếp thu đầy đủ nhận xét, đánh giá và chính thức cập nhật phạm vi triển khai dự án theo đúng nguyên tắc chỉ đạo: **"Giữ một luồng cốt lõi chạy chắc, không cố giữ nhiều tính năng nửa vời"**.

### 🏆 4.1. Kết luận chính thức từ Giảng viên tại Cổng duyệt 1
- **Kết quả nghiệm thu:** **ĐẠT (PASS)** — Đạt 100% tiêu chí sức khỏe repository.
- **Đánh giá mã nguồn & Demo:**
  - Logic hợp đồng `ProjectCore.sol` bám sát đặc tả kỹ thuật `SPEC.md` và quy tắc kinh tế `ECONOMIC_RULES.md`.
  - Kịch bản demo 3 phút thực hiện chuẩn xác: Cấp phát huy hiệu thành công trên Remix VM và chặn đứng hành vi chuyển nhượng trái phép với lỗi đỏ `revert NotTransferable()`.
  - Phân công phối hợp giữa hai bạn **Hoàng Thu Trang** và **Phan Thị Yến Nhi** nhịp nhàng, có commit đóng góp đồng đều từ cả hai thành viên.

### ⚖️ 4.2. Quyết định phạm vi sau duyệt (Scope Decisions)

| Phân loại | Tính năng / Hạng mục | Quyết định & Căn cứ kỹ thuật |
| :--- | :--- | :--- |
| **GIỮ LẠI (Core In-Scope)** | • Cấp phát Soulbound Token (`issueBadge`) theo vai trò Admin/Issuer<br>• Khóa chuyển nhượng bất biến qua `_update`<br>• Tra cứu hồ sơ năng lực công khai, không tốn gas<br>• Thu hồi huy hiệu (`revokeBadge`) khi vi phạm học thuật | **Trọng tâm cốt lõi:** Đây là các tính năng bắt buộc nhằm giải quyết triệt để vấn đề gian lận bằng khen và nạn thương mại hóa danh hiệu học thuật. |
| **CẮT BỎ (Descoping / Out-of-Scope)** | • Sàn giao dịch / Mua bán danh hiệu NFT<br>• Đấu giá / Cho thuê chứng chỉ<br>• Tokenomics điểm thưởng tài chính phức tạp | **Loại bỏ hoàn toàn:** Tránh nguy cơ biến tướng sang đầu cơ tài chính, vi phạm triết lý không chuyển nhượng của Soulbound Token và làm loãng nguồn lực dự án. |

### 📋 4.3. Phân công chi tiết và kế hoạch hành động chặng cuối (Lab 13 – Lab 15)

Hai thành viên tiếp tục duy trì mô hình đồng hành (Pair Programming & Co-working), phân bổ trọng tâm cụ thể như sau:

1. **Lab 13 (Buổi 13) — Kiểm thử an toàn & Tối ưu Hardening:**
   - **Nội dung:** Viết tối thiểu 2 ca kiểm thử tiêu cực (negative tests) trong thư mục `test/` nhằm kiểm tra khả năng chặn tấn công Reentrancy và truy cập trái phép non-owner; tối ưu hóa mã nguồn `ProjectCore.sol`.
   - **Thành viên thực hiện:** Hoàng Thu Trang & Phan Thị Yến Nhi đồng thực hiện.
   - **Commit chuẩn:** `lab-13: them negative test va hardening`.

2. **Lab 14 (Buổi 14) — Audit chéo (Rà soát bảo mật chéo):**
   - **Nội dung:** Xây dựng danh mục 10 tiêu chí rà soát an toàn; tiến hành audit chéo repository với nhóm bạn; lập biên bản `docs/AUDIT_REPORT.md` ghi nhận các lỗ hổng và phương án khắc phục.
   - **Thành viên thực hiện:** Hoàng Thu Trang & Phan Thị Yến Nhi đồng thực hiện.
   - **Commit chuẩn:** `lab-14: xu ly ket qua audit cheo`.

3. **Lab 15 (Buổi 15) — Triển khai công khai & Thuyết trình cuối kỳ:**
   - **Nội dung:** Kết nối hợp đồng thông minh lên mạng thử nghiệm Ethereum Sepolia testnet; hoàn thiện giao diện DApp Web3 (`web/index.html`); xuất bản trang web công khai qua GitHub Pages; lập kế hoạch thuyết trình `docs/PRESENTATION_PLAN.md` và gắn tag phát hành `v0.1-demo`.
   - **Thành viên thực hiện:** Hoàng Thu Trang & Phan Thị Yến Nhi đồng thực hiện.
   - **Commit chuẩn:** `lab-15: public dapp va presentation plan`.

