# 💡 SẢN PHẨM 3: BA CÂU GIẢI THÍCH VÌ SAO THỰC TỰ DÒNG LỆNH CHẶN ĐƯỢC TẤN CÔNG

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  

---

## 📊 SƠ ĐỒ KỸ THUẬT: CƠ CHẾ CHECKS - EFFECTS - INTERACTIONS (CEI) TRIỆT TIÊU REENTRANCY

Dưới đây là sơ đồ kiến trúc đối chiếu trực quan giữa luồng xử lý bị lỗi (Vulnerable Pattern) và luồng xử lý an toàn (Safe CEI Pattern):

![Sơ đồ giải thích vì sao thứ tự dòng lệnh CEI chặn đứng cuộc tấn công Reentrancy](3_cei_mechanism_flowchart.jpg)

---

## ❓ CÂU HỎI 1: Thứ gì thực sự chặn đứng cuộc tấn công Reentrancy ở phương án vá Checks-Effects-Interactions?

> **👉 TRẢ LỜI:**  
> Thứ chặn đứng cuộc tấn công chính là **thứ tự các dòng lệnh** (quy tắc *Checks $\rightarrow$ Effects $\rightarrow$ Interactions*), chứ không phải bất kỳ một từ khóa thần kỳ hay thư viện phức tạp nào. Bằng cách đảo vị trí dòng lệnh cập nhật sổ cái (`balances[msg.sender] = 0`) lên **trước** dòng lệnh chuyển tiền ra bên ngoài (`call{value: bal}`), hợp đồng đã khép lại cánh cửa thời gian mà kẻ tấn công có thể lợi dụng để tái nhập.

---

## ❓ CÂU HỎI 2: Tại sao cập nhật sổ sách trước lại chặn được kẻ tấn công?

> **👉 TRẢ LỜI:**  
> Bởi vì khi lệnh cập nhật sổ sách được thi hành trước, trạng thái số dư của người rút đã lập tức bị đưa về `0` ngay trong bộ nhớ lưu trữ on-chain (`storage`). Khi hàm nhận tiền `receive()` của hợp đồng tấn công cố tình gọi lại hàm `withdraw()` lần thứ hai (tái nhập), bước kiểm tra điều kiện đầu vào (*Checks*) là `require(balances[msg.sender] > 0)` sẽ ngay lập tức phát hiện số dư bằng `0` và **chủ động hủy bỏ toàn bộ giao dịch (`revert`) ngay tại cửa**, dập tắt hoàn toàn chuỗi đệ quy rút tiền của hacker.

---

## ❓ CÂU HỎI 3: Sai lầm tương đương trong nghiệp vụ kế toán truyền thống là gì?

> **👉 TRẢ LỜI:**  
> Sai lầm này hoàn toàn tương đương với việc **thủ quỹ xuất tiền mặt đưa tận tay cho khách hàng trước rồi mới ngồi ghi chép sổ cái kế toán**. Trong khoảnh khắc thủ quỹ vừa đưa tiền xong nhưng chưa kịp ghi vào sổ để trừ nợ, người khách đó đã nhanh tay chìa chính tờ séc hoặc giấy rút tiền cũ ra để yêu cầu một nhân viên khác đưa tiếp số tiền tương tự lần thứ hai, thứ ba, dẫn đến việc ngân quỹ bị thất thoát cạn kiệt mà sổ sách kế toán chưa kịp ghi nhận.
