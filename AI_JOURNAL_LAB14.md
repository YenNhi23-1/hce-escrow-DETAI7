# NHẬT KÝ LÀM VIỆC VỚI AI — LAB 14 (RÀ SOÁT CHÉO HỢP ĐỒNG)

> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Nhóm thực hiện:** Nhóm 07 (Hoàng Thu Trang & Phan Thị Yến Nhi)  
> **Mục tiêu:** Sử dụng công cụ AI theo đúng prompt chuẩn mục I.1 để rà soát mã nguồn `EventTicket.sol` của Nhóm 06, lọc bỏ ảo giác (hallucination) và đối chiếu với 10 tiêu chí bắt buộc.

---

## Lần 1 — Prompt thẩm định mã nguồn ban đầu
**Prompt đã dùng:**
```text
Bạn là chuyên viên thẩm định rủi ro tài sản số.
Dưới đây là mã nguồn một hợp đồng token bán vé sự kiện (EventTicket.sol).
Hãy liệt kê mọi quyền đặc biệt mà chủ sở hữu hợp đồng có thể thực hiện, và với mỗi quyền, nêu rõ:
- Tên hàm và số dòng
- Người nắm giữ token chịu rủi ro gì
Chỉ trả lời dựa trên mã nguồn tôi cung cấp. Nếu không tìm thấy, nói là không tìm thấy.
[Mã nguồn EventTicket.sol]
```

**AI trả về:**
- Báo cáo 4 điểm:
  1. Hàm `setAdmin` (dòng 42): Chủ sở hữu đổi được admin, có thể gán quyền soát vé cho người tùy ý.
  2. Báo cáo rằng hợp đồng có hàm `mintMore()` vô hạn làm lạm phát vé.
  3. Hàm `withdraw()` (dòng 88): Chủ sở hữu rút toàn bộ tiền bán vé.
  4. Hàm `checkIn()` (dòng 78): Chỉ admin/owner mới được gọi.

**Đánh giá:** ⚠️ Phải sửa  
**Chỗ sai của AI:**
- AI tự suy diễn ("bịa") ra hàm `mintMore()` gây lạm phát vé — thực tế trong mã nguồn của Nhóm 06 **hoàn toàn không có hàm nào tên là `mintMore()`**, số lượng vé bị khống chế cứng bởi biến `maxSupply` trong hàm `buy()`.
- AI hoàn toàn không nhận ra lỗi kỹ thuật chí mạng ở dòng 88: hàm `withdraw()` dùng lệnh `transfer()` có trần 2300 gas, có thể làm tê liệt toàn bộ doanh thu nếu ví nhận là Multi-sig!
- AI bỏ sót lỗi logic nghiệp vụ ở dòng 65: cho phép người dùng rao bán lại vé đã check-in vào cửa.

**Cách sửa:**
- Sinh viên loại bỏ hoàn toàn nhận định sai về `mintMore()`.
- Sinh viên Hoàng Thu Trang trực tiếp đọc dòng 88 và phát hiện phương thức `transfer()` cũ, ghi vào báo cáo chính thức là lỗ hổng Nghiêm trọng số 1.
- Sinh viên Phan Thị Yến Nhi đối chiếu với `ECONOMIC_RULES.md` của Nhóm 06 và chỉ ra lỗ hổng bỏ quên cờ `used[tokenId]` ở dòng 65.

**Ai phát hiện:** **Sinh viên phát hiện** (Thành viên nhóm ghi điểm theo quy chế).

---

## Lần 2 — Prompt phân tích an toàn theo danh mục 10 tiêu chí
**Prompt đã dùng:**
```text
Kiểm tra tệp EventTicket.sol theo danh mục 10 tiêu chí:
1. Phân quyền
2. Checks-Effects-Interactions
3. Dấu so sánh thời gian
4. Phép chia làm tròn
5. Cách chuyển ETH (call vs transfer)
6. Dữ liệu riêng tư
7. Vòng lặp
8. Sự kiện event
9. Giá trị số 0
10. Kiểm tra address(0)
Chỉ kết luận có lỗi nếu trích dẫn được số dòng cụ thể.
```

**AI trả về:**
- Mục 5: AI xác nhận dòng 88 dùng `transfer` và giải thích nguy cơ Out of gas với contract recipient.
- Mục 10: AI chỉ ra dòng 42 hàm `setAdmin(address newAdmin)` thiếu `require(newAdmin != address(0))`.

**Đánh giá:** ✅ Dùng được  
**Chỗ đúng:** AI đã xác nhận đúng hai lỗi tại dòng 42 và dòng 88.  
**Ai phát hiện:**
- Lỗi dòng 42 (address 0): **AI phát hiện**
- Lỗi dòng 88 (call vs transfer): **AI và Sinh viên cùng đồng thuận** (Sinh viên phát hiện trước ở Lần 1).

---

## 💡 BÀI HỌC KINH NGHIỆM TỪ LAB 14
1. **Không tin tưởng tuyệt đối vào AI:** AI dễ bị "ảo giác" suy diễn ra các hàm phổ biến trong các dự án mẫu khác (như `mintMore`, `pause`, `blacklist`) dù mã nguồn thực tế không hề có.
2. **Kỹ năng nghiệp vụ là then chốt:** Lỗi bán lại vé đã check-in (dòng 65) là lỗi logic nghiệp vụ thuần túy, công cụ quét mã tự động hay AI thường bỏ qua vì cú pháp Solidity hoàn toàn hợp lệ. Chỉ người hiểu mô hình kinh doanh và bài toán thực tế mới bắt được lỗi này.
