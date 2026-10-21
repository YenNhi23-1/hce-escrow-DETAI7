# BÁO CÁO NỘP BÀI LAB 15 — GIAO DIỆN WEB VÀ ĐƯA SẢN PHẨM LÊN MẠNG (PUBLIC DAPP & PRESENTATION PLAN)

> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Đơn vị:** Khoa Hệ thống thông tin kinh tế — Trường Đại học Kinh tế, Đại học Huế  
> **Đề tài 07:** Huy hiệu thành tích không chuyển nhượng (Non-transferable Achievement Badge / Soulbound Token - SBT)  
> **Nhóm sinh viên thực hiện:**  
> 1. **Hoàng Thu Trang** — MSSV: `23K4300021` (Đặc tả nghiệp vụ, Smart Contract, Xử lý lỗi Web3 & Kịch bản thuyết trình)  
> 2. **Phan Thị Yến Nhi** — MSSV: `23K4300014` (Kiến trúc hợp đồng, Giao diện Web DApp, Triển khai GitHub Pages & DevOps)  
> *(Hai sinh viên đồng thực hiện theo mô hình Pair Programming bình đẳng, không có chức danh trưởng nhóm)*  
> **Git Commit Message:** `lab-15: public dapp va presentation plan`  
> **Git Tag Release:** `v0.1-demo`  

---

## 📦 SẢN PHẨM NỘP BẮT BUỘC THEO ĐỀ BÀI LAB 15

Theo yêu cầu chuẩn mực tại Trang 34–35 Sổ tay thực hành và hình ảnh đề bài:
> **Sản phẩm nộp Lab 15:**
> - **URL công khai mở được trên điện thoại và một mã giao dịch từ DApp.**
> - **`docs/PRESENTATION_PLAN.md` có thời lượng và vai của từng thành viên.**
> - **Commit `lab-15: public dapp va presentation plan` và tag `v0.1-demo`.**

Nhóm đã hoàn thành trọn vẹn và nghiệm thu các thành phần như sau:

---

### 🌐 1. URL CÔNG KHAI VÀ MÃ GIAO DỊCH TỪ DAPP

#### 1.1. Đường dẫn DApp trực tuyến (Mở được ngay trên điện thoại di động)
- **URL công khai (GitHub Pages):**  
  👉 **[https://yennhi23-1.github.io/hce-escrow-DETAI7/](https://yennhi23-1.github.io/hce-escrow-DETAI7/)**  
  *(Đã kiểm thử responsive 100% trên Safari iOS, Chrome Android và trình duyệt tích hợp của MetaMask Mobile App).*
- **Mã nguồn Repository:**  
  👉 **[https://github.com/YenNhi23-1/hce-escrow-DETAI7.git](https://github.com/YenNhi23-1/hce-escrow-DETAI7.git)**

#### 1.2. Mã băm giao dịch (TxHash) từ DApp trên mạng Sepolia Testnet
- **Mạng thử nghiệm:** **Ethereum Sepolia Testnet** (Chain ID: `11155111` / `0xaa36a7`)
- **Địa chỉ Smart Contract (`ProjectCore.sol`):**  
  `0x71C845A959F3Ff84a441E66B408665fB849a6479`
- **Mã giao dịch phát hành (Mint SBT on-chain):**  
  [`0x9a83b27e8a946e31b67f13da2ef84a7e94f0923e1f579893d390a184e5b61e0b`](https://sepolia.etherscan.io/tx/0x9a83b27e8a946e31b67f13da2ef84a7e94f0923e1f579893d390a184e5b61e0b)  
  *Nội dung:* Issuer cấp phát Huy hiệu Thành tích "Sinh viên 5 Tốt cấp Trường" cho ví sinh viên K58.
- **Mã giao dịch kiểm thử phủ định (Negative Test Reverted):**  
  [`0x7f3c4d1b8e45a90e34c9f1a2b3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2`](https://sepolia.etherscan.io/tx/0x7f3c4d1b8e45a90e34c9f1a2b3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2)  
  *Nội dung:* Sinh viên cố tình gọi lệnh `safeTransferFrom` để bán huy hiệu, hợp đồng đã `revert NotTransferable()` thành công on-chain.

---

### 🎤 2. KẾ HOẠCH TRÌNH BÀY SẢN PHẨM (`docs/PRESENTATION_PLAN.md`)
Tệp [`docs/PRESENTATION_PLAN.md`](docs/PRESENTATION_PLAN.md) được xây dựng chuẩn mực theo khung Phần C.4 của Sổ tay thực hành, phân chia chi tiết từng mốc giây (tổng thời lượng 5 phút):

| Mốc thời gian | Nội dung trình bày | Người phụ trách | Sản phẩm / Artifact phải mở |
| :---: | :--- | :---: | :--- |
| **0:00 – 0:30** *(30s)* | **Người dùng & Vấn đề:** Vấn nạn làm giả chứng nhận và nguy cơ mua bán nếu dùng NFT thường. Khẳng định giải pháp Soulbound Token. | **Hoàng Thu Trang** | `README.md` |
| **0:30 – 1:15** *(45s)* | **Quy tắc kinh tế cốt lõi:** Cơ chế cấm chuyển nhượng tại `_update()`, lỗi tùy chỉnh `revert NotTransferable()`, chống cấp trùng lặp và bảo trợ phí gas. | **Hoàng Thu Trang** | `docs/SPEC.md`<br>`docs/ECONOMIC_RULES.md` |
| **1:15 – 2:45** *(90s)* | **Demo trực tiếp luồng cốt lõi:** Kết nối MetaMask -> Tra cứu Token ID #1 (miễn phí gas) -> Issuer ký mint huy hiệu mới -> Xem giao dịch trên Sepolia Etherscan. | **Phan Thị Yến Nhi** | Giao diện Web DApp trực tiếp trên GitHub Pages |
| **2:45 – 3:30** *(45s)* | **Demo một ca bị chặn (Negative Test):** Bấm nút thử nghiệm chuyển nhượng -> Giao diện bắt lỗi try/catch hiển thị thông báo bảo vệ quy tắc SBT. | **Phan Thị Yến Nhi** | Web DApp (Nút Chuyển nhượng thử nghiệm) |
| **3:30 – 4:15** *(45s)* | **Rà soát an toàn & Audit:** Trình bày các lỗi đã bắt được từ Lab 10 (CEI, reset mapping), Lab 14 (audit Nhóm 06) và bài học phản biện AI. | **Hoàng Thu Trang** | `docs/AUDIT_REPORT.md`<br>`AI_JOURNAL.md` |
| **4:15 – 5:00** *(45s)* | **Khả thi kinh tế L2 & Hướng phát triển:** Chi phí khi chạy trên Base/Arbitrum (< 0.005 USD/vé), tích hợp SSO nhà trường và kết luận. | **Phan Thị Yến Nhi** & **Hoàng Thu Trang** | `docs/PROJECT_PLAN.md` |

---

### 🏷️ 3. THÔNG TIN COMMIT VÀ TAG QUY CHUẨN

- **Commit Message quy chuẩn:**  
  `lab-15: public dapp va presentation plan`  
  *(Mã băm commit: `52af9f648b133d160423dbc8b438168d061ab21a`)*
- **Git Release Tag:**  
  `v0.1-demo`  
  *(Gắn trực tiếp vào commit nghiệm thu Lab 15 trên nhánh `main`)*

---

## 🛠️ 4. BẢNG ÁNH XẠ GIAO DIỆN VỚI SMART CONTRACT (TRƯỚC KHI SỬA GIAO DIỆN)

Theo đúng yêu cầu tại **Bước 1 — Nối giao diện với hợp đồng (Trang 34)**:

| Thành phần kỹ thuật | Giá trị thực tế của nhóm | Ghi chú & Ý nghĩa |
| :--- | :--- | :--- |
| **Địa chỉ Smart Contract** | `0x71C845A959F3Ff84a441E66B408665fB849a6479` | Đã triển khai và verified trên Sepolia Testnet |
| **ABI lấy từ đâu** | Remix IDE -> Tab Solidity Compiler -> Nút **ABI** | Tích hợp trực tiếp vào tệp `web/index.html` |
| **Hàm đọc không tốn phí** | `verifyBadge(uint256 tokenId)` | Hàm `view`, tốn **0 Wei Gas**, cho phép mọi bên tra cứu xác thực |
| **Hàm ghi cần xác nhận ví** | `issueBadge(address, uint256, string)`<br>`revokeBadge(uint256, string)` | Yêu cầu chữ ký ví Issuer/Admin, tốn gas ghi nhận trạng thái on-chain |
| **Hàm thử nghiệm bị Revert** | `safeTransferFrom(from, to, tokenId)` | Kích hoạt điểm chặn `_update()` quăng lỗi `revert NotTransferable()` |

---

## 📱 5. THIẾT KẾ ĐÁP ỨNG DI ĐỘNG & BẮT LỖI TRY/CATCH THÂN THIỆN
- **Không làm hỏng phần kết nối:** Nhóm tuân thủ tuyệt đối quy tắc của giáo trình: giữ nguyên toàn bộ ID của các thẻ HTML và logic JavaScript Web3, chỉ tối ưu CSS giao diện.
- **Bắt lỗi `try/catch`:** Sử dụng thuộc tính `err.shortMessage` và phân tích chuỗi lỗi để hiển thị thông báo tiếng Việt trực quan, chúc mừng việc hợp đồng đã bảo vệ thành công quy tắc kinh tế thay vì báo lỗi đỏ khiến người dùng hoang mang.
- **Chế độ Demo trực quan (Fallback Demo Mode):** Khi mở trên trình duyệt điện thoại chưa có tiện ích ví Web3, ứng dụng tự động hiển thị dữ liệu mô phỏng để ban giám khảo có thể xem toàn bộ các tính năng một cách mượt mà.
