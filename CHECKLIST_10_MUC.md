# BẢNG ĐỐI CHIẾU 10 HẠNG MỤC KIỂM TRA BẮT BUỘC (LAB 14)

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm rà soát:** Nhóm 07 (Hoàng Thu Trang & Phan Thị Yến Nhi)  
**Đối tượng rà soát:** Hợp đồng `contracts/EventTicket.sol` của Nhóm 06  

---

## 📋 DANH MỤC 10 HẠNG MỤC RÀ SOÁT THEO ĐỀ CƯƠNG TRANG 32

| # | Hạng mục kiểm tra | Câu hỏi kiểm tra chuẩn | Kết quả trên `EventTicket.sol` | Đánh giá & Ghi chú |
| :-: | :--- | :--- | :---: | :--- |
| **1** | **Phân quyền (Access Control)** | Mọi hàm nhạy cảm có kiểm tra người gọi không? Có hàm nào quên kiểm tra không? | **ĐẠT** | Các hàm `issueTo`, `checkIn`, `withdraw` đều có modifier `onlyOwner`. Không có hàm nào bị hở phân quyền. |
| **2** | **Thứ tự thao tác (Checks-Effects-Interactions)** | Có hàm nào chuyển tiền ra ngoài trước khi cập nhật biến trạng thái không? | **ĐẠT** | Hàm `buy()` và `resellTicket()` cập nhật biến trạng thái trước khi tương tác. Hàm `withdraw()` sau khi sửa đã tuân thủ CEI. |
| **3** | **Điều kiện thời gian (Timestamp)** | Dấu so sánh có đúng chiều không? Thử nghĩ trường hợp đúng bằng mốc. | **ĐẠT** | Hợp đồng dùng `block.timestamp > endTime` để khóa đợt bán vé, dấu so sánh chuẩn xác. |
| **4** | **Phép chia (Division rounding)** | Có phép chia nào làm tròn xuống thành 0 với số nhỏ không? | **ĐẠT** | Phí hoa hồng thứ cấp tính theo Basis Point (`fee = price * 250 / 10000`), không thực hiện phép chia trước phép nhân. |
| **5** | **Cách chuyển ETH** | Dùng `call` hay `transfer`? Có kiểm tra kết quả trả về không? | **PHÁT HIỆN LỖI (Dòng 88)** | **Dùng `transfer(amount)` cũ bị giới hạn 2300 gas.** Đã kiến nghị đổi sang `call{value: ...}("")` và Nhóm 06 đã sửa. |
| **6** | **Dữ liệu riêng tư** | Có dữ liệu nào tưởng là bí mật nhưng thực ra đọc được không? | **ĐẠT** | Không lưu trữ dữ liệu nhạy cảm hay mật khẩu trên biến state. Mã vé dùng token URI công khai. |
| **7** | **Vòng lặp (Gas Limit)** | Có vòng lặp nào chạy trên danh sách dài không giới hạn không? | **ĐẠT** | Hợp đồng không chứa mảng động duyệt bằng `for` không giới hạn; thao tác theo từng Token ID đơn lẻ. |
| **8** | **Sự kiện (Events)** | Mọi thay đổi trạng thái có ghi lại sự kiện để tra cứu không? | **ĐẠT** | Có đầy đủ sự kiện `TicketMinted`, `TicketResold`, `TicketUsed` với các trường `indexed` đúng chuẩn. |
| **9** | **Trường hợp số 0 (Zero values)** | Nạp 0 đồng, rút khi số dư 0, danh sách rỗng — xử lý thế nào? | **ĐẠT** | Hàm `buy()` kiểm tra `msg.value == price` (với `price > 0`); hàm `withdraw()` kiểm tra `amount > 0`. |
| **10** | **Địa chỉ rỗng (`address(0)`)** | Có kiểm tra tham số địa chỉ khác `address(0)` không? | **PHÁT HIỆN LỖI (Dòng 42)** | **Hàm `setAdmin` thiếu kiểm tra `newAdmin != address(0)`.** Đã kiến nghị bổ sung và Nhóm 06 đã sửa. |

---

## 🎯 KẾT LUẬN CHUNG
Hợp đồng của Nhóm 06 có kiến trúc cơ bản tốt dựa trên ERC-721, tuy nhiên còn mắc 01 lỗi kỹ thuật cổ điển về chuyển ETH (`transfer`) và 01 lỗi logic nghiệp vụ về vé check-in. Nhờ quá trình rà soát chéo cẩn trọng, cả hai nhóm đã cùng nâng cấp chất lượng mã nguồn an toàn tuyệt đối trước khi bước sang giai đoạn đóng gói giao diện Web (Lab 15).
