# AGENTS.md — Quy ước dự án ECO2432

Dự án: **HCE Soulbound Achievement Badge (Đề tài 7)**  
Môn học: Tiền điện tử & Hợp đồng thông minh (ECO2432)  
Trường: Trường Đại học Kinh tế - Đại học Huế (HCE)  

## Ngôn ngữ và phiên bản
- Solidity `^0.8.20`. Không dùng cú pháp của phiên bản 0.7 trở về trước.
- Dùng thư viện OpenZeppelin Contracts **phiên bản 5.x**.
  - *Lưu ý quan trọng:* OpenZeppelin v5 đã loại bỏ `_beforeTokenTransfer` và thay thế hoàn toàn bằng hàm `_update(address to, uint256 tokenId, address auth)`.
- Python `3.10+` (cho các công cụ phân tích dữ liệu, kiểm thử on-chain nếu có).
- Web frontend: Vanilla HTML5 / Modern CSS / Vanilla JavaScript với thư viện `ethers.js` (v6) để đảm bảo tính tinh gọn, không phụ thuộc framework cồng kềnh.

## Quy tắc bắt buộc khi viết hợp đồng thông minh
1. **Sự kiện (Event):** Mọi hàm làm thay đổi trạng thái lưu trữ (state) bắt buộc phải phát ra một `event` tương ứng để phục vụ index và tra cứu on-chain.
2. **Kiểm soát truy cập (Access Control):** Mọi hàm chỉ dành cho ban quản trị (Admin / Issuer / Authorized Minters) phải có kiểm tra quyền rõ ràng qua modifier hoặc custom error.
3. **Mẫu hình Checks - Effects - Interactions:**
   - Bước 1 (Checks): Kiểm tra tất cả điều kiện đầu vào và quyền hạn (`require` hoặc `if (...) revert ErrorName()`).
   - Bước 2 (Effects): Cập nhật tất cả biến trạng thái nội bộ trong kho lưu trữ hợp đồng.
   - Bước 3 (Interactions): Thực hiện tương tác bên ngoài (gọi hàm hợp đồng khác hoặc gửi token/ETH). Không được đảo lộn thứ tự này.
4. **Chuyển ETH an toàn:** Nếu có phát sinh nạp/rút ETH, luôn dùng `call{value: ...}("")` kèm kiểm tra kết quả trả về `(bool ok, )`. Tuyệt đối không dùng `transfer()` hoặc `send()`.
5. **Tiết kiệm Gas:** Sử dụng `custom error` (ví dụ `error NotAuthorized()`, `error NotTransferable()`) thay cho các chuỗi ký tự thông báo dài trong `require("...")`.
6. **Bảo mật danh tính:** Tuyệt đối không sử dụng `tx.origin` để xác thực quyền truy cập; luôn sử dụng `msg.sender`.
7. **Đơn vị tính toán:** Mọi tỷ lệ phần trăm hoặc phí (nếu có) phải dùng đơn vị điểm cơ bản (basis point, 1% = 100 bps, 100% = 10,000 bps).

## Quy tắc áp dụng riêng cho Đề tài 7 (Huy hiệu Soulbound - SBT)
1. **Cấm chuyển nhượng (Non-transferable):** 
   - Huy hiệu sau khi được cấp phát đến ví sinh viên phải bị khóa vĩnh viễn với địa chỉ ví đó.
   - Override hàm `_update` trong ERC-721: Nếu là giao dịch chuyển giao giữa 2 ví thông thường (`from != address(0)` và `to != address(0)`), bắt buộc phải chặn lại bằng `revert NotTransferable()`.
   - Phải xử lý ngoại lệ cho 2 trường hợp đặc biệt: `from == address(0)` (khi Mint / Cấp phát) và `to == address(0)` (khi Burn / Thu hồi).
2. **Quyền riêng tư dữ liệu (Privacy First):**
   - Tuyệt đối không ghi thông tin định danh cá nhân nhạy cảm (như CCCD, họ tên đầy đủ chưa mã hóa, điểm thi chi tiết) trực tiếp dưới dạng plain text lên chuỗi.
   - Sử dụng dấu vân tay số cryptographic hash (`bytes32` hoặc `keccak256`) và IPFS CID URI để lưu trữ metadata.

## Khi được yêu cầu sinh mã
- Luôn giải thích ngắn gọn lý do chọn giải pháp thiết kế trước khi đưa mã nguồn.
- Nếu yêu cầu trong đặc tả còn điểm mơ hồ, phải chủ động đặt câu hỏi làm rõ thay vì tự ý suy diễn.
- Chú thích trong mã viết bằng tiếng Việt không dấu hoặc tiếng Anh ngắn gọn, rõ nghĩa.
