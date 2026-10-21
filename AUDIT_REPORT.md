# BÁO CÁO RÀ SOÁT — Nhóm 07 rà soát nhóm 06

> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Nhóm rà soát (Nhóm 07):**  
> 1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
> 2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
> **Nhóm được rà soát (Nhóm 06):** Dự án Vé sự kiện giới hạn bán lại (`EventTicket.sol`)  
> **Tệp mã nguồn rà soát:** `contracts/EventTicket.sol`  
> **Quy chuẩn đối chiếu:** Danh mục 10 tiêu chí bắt buộc, `SPEC.md` và `ECONOMIC_RULES.md` của Nhóm 06  

---

## 1. Tóm tắt
Đã rà soát `contracts/EventTicket.sol`, 135 dòng mã nguồn. Phát hiện **03 vấn đề**:  
- **01 nghiêm trọng** (lỗ hổng rút tiền kẹt tài sản),  
- **01 trung bình** (lỗ hổng gian lận bán lại vé đã quét check-in),  
- **01 nhẹ** (thiếu kiểm tra địa chỉ quản trị rỗng).

---

## 2. Chi tiết các phát hiện

### Phát hiện 1 — Lỗ hổng chuyển tiền bằng `transfer()` cố định 2300 gas
- **Mức độ:** Nghiêm trọng
- **Vị trí:** dòng 88, hàm `withdraw`
- **Mô tả:** Hợp đồng sử dụng phương thức cũ `payable(owner()).transfer(amount);` để rút toàn bộ doanh thu bán vé về ví của chủ sở hữu.
- **Tình huống gây thiệt hại:** Nếu địa chỉ `owner()` là một ví đa chữ ký (Gnosis Safe / Contract Multi-sig) hoặc một hợp đồng có hàm `receive()` thực hiện ghi sổ logic tiêu tốn vượt quá 2.300 gas, giao dịch rút tiền sẽ luôn luôn bị từ chối (`revert Out of Gas`). Khi đó, toàn bộ số tiền bán vé của Ban Tổ Chức sẽ bị đóng băng vĩnh viễn trong hợp đồng và không ai có thể rút ra được.
- **Khuyến nghị:** Thay thế lệnh `transfer()` bằng cú pháp cấp toàn bộ gas khả dụng thông qua lệnh `call{value: ...}("")` và kiểm tra giá trị boolean trả về:
  ```solidity
  (bool success, ) = payable(owner()).call{value: amount}("");
  require(success, "Rut tien that bai");
  ```
- **Ai phát hiện:** Thành viên nhóm (Hoàng Thu Trang)

---

### Phát hiện 2 — Thiếu kiểm tra điều kiện vé đã check-in trước khi cho phép bán lại
- **Mức độ:** Trung bình
- **Vị trí:** dòng 65, hàm `resellTicket`
- **Mô tả:** Hàm bán lại vé `resellTicket(uint256 tokenId, address buyer)` chỉ kiểm tra người bán có quyền sở hữu vé hay không mà bỏ quên kiểm tra trạng thái vé đã quét vào cửa hay chưa (`used[tokenId] == false`).
- **Tình huống gây thiệt hại:** Một người mua vé đến tham gia concert và đã được bảo vệ quét mã check-in vào cửa lúc 19h00. Sau khi vào bên trong, người này lập tức đăng bán lại vé trên thị trường thứ cấp cho một nạn nhân khác với giá rẻ hơn. Nạn nhân thứ hai chuyển tiền mua vé on-chain thành công nhưng khi cầm vé tới cổng soát vé sẽ bị từ chối vào cửa vì vé đã dùng. Điều này gây thiệt hại tài chính cho người mua sau và vi phạm cam kết trong `ECONOMIC_RULES.md` của dự án.
- **Khuyến nghị:** Bổ sung điều kiện kiểm tra trạng thái vé ngay tại đầu hàm `resellTicket`:
  ```solidity
  require(!used[tokenId], "Ve da duoc check-in tai cua, khong the ban lai");
  ```
- **Ai phát hiện:** Thành viên nhóm (Phan Thị Yến Nhi)

---

### Phát hiện 3 — Thiếu kiểm tra địa chỉ rỗng (`address(0)`) khi cập nhật Ban Quản Trị
- **Mức độ:** Nhẹ
- **Vị trí:** dòng 42, hàm `setAdmin`
- **Mô tả:** Hàm thay đổi địa chỉ quản trị viên `setAdmin(address newAdmin)` chỉ có kiểm tra `onlyOwner` mà không kiểm tra địa chỉ `newAdmin != address(0)`.
- **Tình huống gây thiệt hại:** Nếu người quản trị thao tác nhầm trên giao diện web hoặc dán thiếu chuỗi ký tự dẫn đến truyền giá trị `address(0)` (`0x0000000000000000000000000000000000000000`), quyền quản trị sự kiện sẽ bị chuyển vĩnh viễn vào "hố đen". Hợp đồng sẽ mất vĩnh viễn người điều hành, không thể cấu hình giá vé hay điều chỉnh thời gian mở bán.
- **Khuyến nghị:** Thêm kiểm tra tham số đầu vào:
  ```solidity
  require(newAdmin != address(0), "Dia chi admin khong hop le");
  ```
- **Ai phát hiện:** Công cụ AI hỗ trợ phân tích tĩnh

---

## 3. Phản hồi của nhóm bị rà soát (Nhóm 06)
*(Thực hiện tại Bước 3 — Trao đổi và sửa lỗi trong buổi học)*

Đại diện Nhóm 06 (Dự án Vé sự kiện `EventTicket.sol`) đã họp trực tiếp với Nhóm 07, ghi nhận toàn bộ biên bản rà soát và gửi văn bản phản hồi chính thức như sau:

1. **Về Phát hiện 1 (Nghiêm trọng — Kẹt tiền bán vé):**
   > *"Nhóm 06 hoàn toàn đồng ý và đánh giá rất cao phát hiện của Nhóm 07. Đây là lỗi kỹ thuật cốt lõi do nhóm đã quen với cú pháp Solidity cũ mà quên mất hạn chế 2.300 gas của `transfer()`. Nhóm 06 đã tiến hành sửa ngay trong buổi học bằng cách áp dụng mẫu Checks-Effects-Interactions kết hợp `call{value: ...}("")`."*

2. **Về Phát hiện 2 (Trung bình — Bán lại vé đã check-in):**
   > *"Nhóm 06 xác nhận đây là lỗ hổng logic nghiệp vụ quan trọng. Đúng như `ECONOMIC_RULES.md` đã quy định, vé chỉ có giá trị vào cửa 1 lần. Nhóm đã bổ sung điều kiện `require(!used[tokenId])` trong hàm `resellTicket` và viết thêm ca kiểm thử trong `test/` để chặn hoàn toàn hành vi gian lận này."*

3. **Về Phát hiện 3 (Nhẹ — Thiếu kiểm tra address(0)):**
   > *"Nhóm 06 ghi nhận và đã bổ sung `require(newAdmin != address(0))` vào hàm `setAdmin` để phòng ngừa sai sót thao tác của người dùng."*

---

## 4. Liên kết commit sửa lỗi
Theo đúng quy định của học phần ECO2432, nhóm nhận báo cáo phản hồi từng phát hiện và tiến hành sửa ngay trong buổi học:

* **Commit sửa lỗi của Nhóm 06 (Khắc phục theo báo cáo của Nhóm 07):**  
  - Thông điệp commit: `lab-14: sua loi rut tien call va check-in theo audit cua Nhom 07`  
  - Mã SHA commit: `9f4a8b27c1a8e945d8b746a2f309a4b8c9d0e1f2`  
  - Liên kết GitHub: [`https://github.com/Nhom06-ECO2432/event-ticket/commit/9f4a8b2`](https://github.com/Nhom06-ECO2432/event-ticket/commit/9f4a8b2)

* **Commit nộp sản phẩm rà soát của Nhóm 07:**  
  - Thông điệp commit: `lab-14: xu ly ket qua audit cheo`  
  - Mã SHA commit: `49e6d7f48b133d160423dbc8b438168d061ab21a`  
  - Liên kết GitHub: [`https://github.com/YenNhi23-1/hce-escrow-DETAI7/commit/d7e10a4`](https://github.com/YenNhi23-1/hce-escrow-DETAI7/commit/d7e10a4)
