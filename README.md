# 🏅 HCE Soulbound Achievement Badge — Đề tài 7
> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Khoa:** Hệ thống Thông tin Kinh tế — Trường Đại học Kinh tế, Đại học Huế  
> **Khóa:** K57 / Năm học 2025–2026  
> **Repository GitHub:** [https://github.com/YenNhi23-1/hce-escrow-DETAI7.git](https://github.com/YenNhi23-1/hce-escrow-DETAI7.git)  
> **Đường dẫn DApp Trực tuyến:** [https://yennhi23-1.github.io/hce-escrow-DETAI7/](https://yennhi23-1.github.io/hce-escrow-DETAI7/)  

---

## 📌 1. Tuyên ngôn sản phẩm (One-Sentence Pitch)
> **“Nhóm xây Hệ thống Huy hiệu thành tích số (Soulbound Badge) cho Câu lạc bộ & Nhà trường để cấp phát và chứng thực thành tích sinh viên không thể mua bán, làm giả hay chuyển nhượng.”**

---

## 👥 2. Thành viên nhóm & Mô hình làm việc
| STT | Họ và tên | Mã sinh viên | Lớp | Vai trò đảm trách xuyên suốt |
| :---: | :--- | :---: | :---: | :--- |
| 1 | **Hoàng Thu Trang** | **23K4300021** | K57 | Đặc tả nghiệp vụ (BA), Hợp đồng thông minh (Solidity) & Rà soát an toàn (Audit Lead) |
| 2 | **Phan Thị Yến Nhi** | **23K4300014** | K57 | Thiết kế kiến trúc Smart Contract, Giao diện Web DApp & Triển khai công khai (DevOps/QA) |

*(Ghi chú quan trọng: Nhóm hoạt động theo mô hình **Pair Programming / Co-working bình đẳng**, cả hai sinh viên cùng đồng thực hiện toàn diện mọi nội dung, **không có chức danh trưởng nhóm**).*

---

## 💡 3. Bài toán thực tế và Giải pháp cốt lõi
- **Thực trạng:** Giấy khen, chứng nhận sinh viên dạng giấy hoặc PDF dễ bị làm giả, dễ thất lạc, tốn kém chi phí in ấn và xác minh thủ công. Nếu dùng NFT ERC-721 thông thường, người nhận có thể bán hoặc chuyển nhượng cho người khác — làm sai lệch hoàn toàn ý nghĩa ghi nhận thành tích.
- **Giải pháp:** Xây dựng hợp đồng thông minh tuân thủ cơ chế **Soulbound Token (SBT / EIP-5114)** trên nền ERC-721 (OpenZeppelin v5.x).
  - Chỉ đơn vị có thẩm quyền (Admin / Issuer) mới có quyền cấp phát (mint) hoặc thu hồi (revoke) khi có sai phạm.
  - Sau khi sinh viên nhận huy hiệu, **mọi thao tác chuyển nhượng (transfer) đều bị chặn ở cấp độ hợp đồng** (`revert NotTransferable()`).
  - Nhà tuyển dụng, doanh nghiệp có thể tra cứu tính xác thực trực tiếp on-chain hoàn toàn miễn phí mà không tốn gas.

---

## 📂 4. Cấu trúc Codebase (Chuẩn mực ECO2432)
```text
hce-badge-k57/
├── README.md                 # Giới thiệu tổng thể dự án và mục lục bài lab
├── AGENTS.md                 # Bộ quy tắc hướng dẫn AI hỗ trợ lập trình
├── AI_JOURNAL.md             # Nhật ký prompt AI, phân tích ảo giác và sửa lỗi
├── lab09.md, lab10.md...     # Báo cáo tổng hợp riêng biệt từng Lab 9 đến 15 ở thư mục gốc
├── docs/
│   ├── SPEC.md               # Đặc tả kỹ thuật và yêu cầu nghiệp vụ v0.1 & v0.2
│   ├── ECONOMIC_RULES.md     # Cơ chế kinh tế, chống lạm dụng và quyền quản trị
│   ├── PROJECT_PLAN.md       # Kế hoạch chi tiết và tiến độ các mốc
│   ├── PRESENTATION_PLAN.md  # Kịch bản demo 5 phút và phân công thuyết trình (Lab 15)
│   ├── GATE_REVIEW_1.md      # Biên bản Gate Review 1 (Lab 12)
│   └── AUDIT_REPORT.md       # Báo cáo kết quả audit chéo (Lab 14)
├── contracts/
│   ├── training/             # TimeLockVault.sol, VaultBuggy.sol, SafeBank.sol...
│   └── project/
│       └── ProjectCore.sol   # Hợp đồng thông minh cốt lõi của sản phẩm nhóm
├── test/
│   └── negative_tests.js     # Kịch bản kiểm thử bảo mật và ca vi phạm
├── web/
│   └── index.html            # Giao diện Web DApp kết nối MetaMask (Ethers.js v6)
└── evidence/                 # Thư mục lưu bằng chứng và báo cáo độc lập từng Lab 8–15
```

---

## 🗺️ 5. Tiến độ hoàn thành các bài Lab (Đã hoàn thành 100%)

Toàn bộ các bài lab đã được thực hiện chỉn chu, lưu thành các file riêng biệt tương tự như Lab 10:

- [x] **[Lab 08](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/evidence/lab-08/checklist.md):** Khởi tạo codebase nhóm, chốt chủ đề 7, lập kế hoạch, viết `SPEC.md` và `ECONOMIC_RULES.md` v0.1. Commit: `lab-08: khoi tao codebase nhom va dac ta v0.1`.
- [x] **[Lab 09](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/lab09.md):** Hiện thực `TimeLockVault.sol` và hợp đồng `ProjectCore.sol` v0.1 biên dịch thành công. Commit: `lab-09: contract loi bien dich duoc`.
- [x] **[Lab 10](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/lab10.md):** Rà soát mã nguồn (Audit), phát hiện 4 lỗ hổng, nâng cấp `ProjectCore.sol` v0.2, lập `AI_JOURNAL.md`. Commit: `lab-10: audit va sua loi project core`.
- [x] **[Lab 11](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/lab11.md):** Cài đặt quy tắc kinh tế: cấm chuyển nhượng Soulbound qua hàm `_update` (`revert NotTransferable()`), kiểm thử gas. Commit: `lab-11: cai quy tac kinh te va test`.
- [x] **[Lab 12](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/lab12.md):** **Gate Review 1** — Bảo vệ codebase trước giảng viên, kịch bản thuyết trình 3 phút, chốt phạm vi dự án. Commit: `lab-12: gate review 1 va cap nhat pham vi`.
- [x] **[Lab 13](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/lab13.md):** Kiểm thử tấn công bảo mật: mô phỏng The DAO Reentrancy (`VulnerableBank.sol`), phòng thủ CEI (`SafeBank.sol`) và bộ test negative. Commit: `lab-13: them negative test va hardening`.
- [x] **[Lab 14](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/lab14.md):** Rà soát chéo (Audit chéo) hợp đồng `EventTicket.sol` của Nhóm 06 với 10 tiêu chí và khắc phục lỗ hổng. Commit: `lab-14: xu ly ket qua audit cheo`.
- [x] **[Lab 15](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/lab15.md):** Hoàn thiện Web DApp, kết nối Ethers.js v6, deploy GitHub Pages, lập kịch bản thuyết trình 5 phút. Commit: `lab-15: public dapp va presentation plan` (Tag: `v0.1-demo`).

---

## 🔗 6. Bảng ánh xạ hợp đồng & DApp
| Thành phần | Giá trị của nhóm | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Mạng triển khai** | **Ethereum Sepolia Testnet** | Chain ID: `11155111` |
| **Địa chỉ hợp đồng** | `0x71C845A959F3Ff84a441E66B408665fB849a6479` | Chuẩn ERC-721 Soulbound (OpenZeppelin v5) |
| **Hàm đọc (Free)** | `verifyBadge(uint256)` | View Call, 0 ETH gas |
| **Hàm ghi (Cần ký ví)** | `issueBadge(...)`, `revokeBadge(...)` | Chỉ Admin / Issuer thực hiện |
| **Hàm chặn chuyển nhượng** | `safeTransferFrom(...)` | Bị REVERT ngay lập tức với `NotTransferable()` |
| **Đường dẫn DApp** | `https://yennhi23-1.github.io/hce-escrow-DETAI7/` | Triển khai trên GitHub Pages |

---

## 🛠️ 7. Hướng dẫn chạy và kiểm thử nhanh
1. Mở thư mục dự án trong **Antigravity IDE** hoặc VS Code.
2. Mở file `web/index.html` trực tiếp trên trình duyệt (hoặc truy cập link GitHub Pages).
3. Kết nối ví MetaMask (chọn mạng Sepolia Testnet).
4. Thử tra cứu Token ID #1 (miễn phí gas) hoặc nhấn nút **"Thử Nghiệm Bán/Chuyển Nhượng Huy Hiệu"** để xem hợp đồng chặn giao dịch và bảo vệ quy tắc kinh tế.
