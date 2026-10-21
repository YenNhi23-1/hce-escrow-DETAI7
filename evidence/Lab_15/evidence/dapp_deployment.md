# BÁO CÁO TRIỂN KHAI DAPP LÊN MẠNG CÔNG KHAI (DAPP_DEPLOYMENT.MD) — LAB 15

**Môn học:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
*(Cả hai sinh viên cùng đồng thực hiện, bình đẳng, không có trưởng nhóm)*  
**Đề tài 07:** Huy hiệu thành tích không chuyển nhượng (Non-transferable Achievement Badge / Soulbound Token - SBT)  
**Thời gian thực hiện:** Buổi 15 (Tuần 5)  

---

## 🌐 1. THÔNG TIN XUẤT BẢN CÔNG KHAI (PUBLIC DEPLOYMENT)

| Thông số | Giá trị triển khai | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Đường dẫn DApp (GitHub Pages)** | `https://yennhi23-1.github.io/hce-escrow-DETAI7/` | Web tĩnh, bảo mật HTTPS, tương thích di động |
| **Mã nguồn Repository** | `https://github.com/YenNhi23-1/hce-escrow-DETAI7.git` | Nhánh `main` công khai |
| **Mạng Blockchain** | **Ethereum Sepolia Testnet** | Proof of Stake Testnet chính thức của Ethereum |
| **Mã mạng (Chain ID)** | `11155111` (Hex: `0xaa36a7`) | Tiêu chuẩn EIP-155 |
| **Địa chỉ Smart Contract** | `0x71C845A959F3Ff84a441E66B408665fB849a6479` | Chuẩn ERC-721 Soulbound (OpenZeppelin v5.x) |
| **Thư viện Web3** | **Ethers.js v6.7.0** (CDN UMD) | Thư viện gọn nhẹ, không cần Webpack/Node server |
| **Trình duyệt khuyến nghị** | Chrome / Brave / Edge + Extension MetaMask | Tương thích ví di động qua MetaMask Browser |

---

## 🛠️ 2. BẢNG ÁNH XẠ GIAO DIỆN & HỢP ĐỒNG THÔNG MINH (CONTRACT MAPPING)

| Nút bấm / Chức năng Web | Hàm Solidity tương ứng | Kiểu tương tác | Phí Gas ước tính | Người chịu phí |
| :--- | :--- | :--- | :--- | :--- |
| **1. Nút "Tra Cứu Trên Sepolia"** | `verifyBadge(uint256 tokenId)` | `view` (Đọc dữ liệu) | **0 ETH (Miễn phí)** | Miễn phí hoàn toàn cho nhà tuyển dụng/xã hội |
| **2. Nút "Ký Cấp Phát (Mint SBT)"** | `issueBadge(address, uint256, string)` | `nonpayable` (Ghi dữ liệu) | ~124,000 gas (~0.0003 ETH) | Đơn vị cấp phát (Nhà trường / CLB) tài trợ |
| **3. Nút "Thử Chuyển Nhượng (Negative)"** | `safeTransferFrom(from, to, tokenId)` | `nonpayable` (Chuyển token) | **Bị REVERT ngay lập tức** | Giao dịch bị hủy bởi `NotTransferable()` |
| **4. Nút "Ký Lệnh Thu Hồi On-Chain"** | `revokeBadge(uint256 tokenId, string)` | `nonpayable` (Cập nhật trạng thái) | ~48,000 gas (~0.0001 ETH) | Issuer ban đầu ký thu hồi |
| **5. Nút "Kết Nối MetaMask"** | `window.ethereum.request({method: 'eth_requestAccounts'})` | Provider handshake | **0 ETH** | Xác thực địa chỉ ví đang hoạt động |

---

## 🧪 3. KỊCH BẢN KIỂM THỬ TRỌN VẸN TRÊN MÔI TRƯỜNG WEB (END-TO-END TEST LOG)

### 3.1. Ca 1: Tra cứu công khai miễn phí gas (Public Verifier)
- **Hành động:** Người dùng không cần đăng nhập ví, nhập Token ID = `1`, bấm **"Tra Cứu Trên Sepolia"**.
- **Kết quả:** Hệ thống đọc dữ liệu từ storage contract và hiển thị thẻ chứng nhận:
  - Tên danh hiệu: *Sinh Viên 5 Tốt Cấp Trường*.
  - Đơn vị cấp: *Trường Đại học Kinh tế, ĐH Huế*.
  - Trạng thái: *HỢP LỆ VÀ NGUYÊN VẸN (Chấm xanh)*.
  - Phí gas tiêu thụ: **0 Wei**.

### 3.2. Ca 2: Kiểm thử quy tắc kinh tế cốt lõi (Negative Test — Cố tình chuyển nhượng)
- **Hành động:** Sinh viên kết nối ví sở hữu Token ID #1, nhập địa chỉ ví thứ hai và bấm **"🚫 Thử Gọi Lệnh Chuyển Nhượng"**.
- **Phản hồi từ Contract:** Điểm chặn tại hàm `_update()` phát hiện `from != address(0) && to != address(0)` nên kích hoạt:
  ```solidity
  revert NotTransferable();
  ```
- **Xử lý trên giao diện Web:** Khối `try/catch` trong Ethers.js bắt được mã lỗi và hiển thị thông báo bảo vệ quy tắc kinh tế màu xanh lá:
  > *"🛡️ QUY TẮC KINH TẾ ĐƯỢC BẢO VỆ THÀNH CÔNG! Hợp đồng thông minh đã Revert giao dịch với mã lỗi revert NotTransferable(). Huy hiệu Soulbound không thể chuyển nhượng hoặc mua bán!"*
- **Ý nghĩa:** Tránh trường hợp ứng dụng bị crash hay báo lỗi khó hiểu cho người dùng không am hiểu kỹ thuật.

### 3.3. Ca 3: Cấp phát huy hiệu mới có kiểm tra chống trùng lặp
- **Hành động:** Tài khoản Issuer nhập địa chỉ sinh viên đã từng nhận danh hiệu loại 1, tiếp tục bấm "Ký Cấp Phát".
- **Kết quả:** Giao dịch bị từ chối với lỗi `BadgeAlreadyAwarded()`. Giao diện hiển thị Toast cảnh báo màu đỏ: *"Lỗi: Sinh viên này đã từng nhận loại huy hiệu này rồi!"*.

---

## 🚀 4. QUY TRÌNH DEPLOY LÊN GITHUB PAGES

Để đưa ứng dụng `web/index.html` lên mạng công khai, nhóm đã cấu hình tự động:
1. Đặt file giao diện chính tại `web/index.html` (hoặc cấu hình GitHub Pages trỏ vào thư mục `/web` hoặc copy ra root `index.html`).
2. Kích hoạt GitHub Pages trong mục **Settings > Pages > Source: Deploy from a branch (`main` / root)**.
3. Kiểm tra chứng chỉ SSL/HTTPS tự động được cấp phát từ GitHub.
4. Truy cập kiểm tra trên trình duyệt di động: Giao diện co giãn chuẩn responsive (CSS Grid + Flexbox), hỗ trợ hiển thị sắc nét trên cả màn hình PC và Smartphone.

---

## 👥 5. PHÂN CÔNG ĐỒNG THỰC HIỆN LAB 15

| Thành viên | Nhiệm vụ đảm trách | Sản phẩm hoàn thành |
| :--- | :--- | :--- |
| **Hoàng Thu Trang** | - Xây dựng kiến trúc giao diện Web3, bảng ánh xạ hàm hợp đồng và tích hợp thư viện Ethers.js v6.<br>- Xây dựng kịch bản kiểm thử các ca tiêu cực (try/catch revert NotTransferable). | `web/index.html`, Bảng ánh xạ hàm contract, xử lý lỗi `try/catch`. |
| **Phan Thị Yến Nhi** | - Cấu hình triển khai GitHub Pages, kết nối mạng Sepolia Testnet và kiểm thử tương thích di động.<br>- Cập nhật kịch bản thuyết trình và quay video demo luồng tương tác. | Cấu hình GitHub Pages, kiểm thử E2E trên Sepolia, tài liệu `dapp_deployment.md`. |
