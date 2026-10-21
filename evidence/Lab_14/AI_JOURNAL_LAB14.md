# NHẬT KÝ LÀM VIỆC VỚI AI — LAB 14 (RÀ SOÁT CHÉO HỢP ĐỒNG hce-trace-hue)

> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Nhóm thực hiện:** Nhóm 07 (Hoàng Thu Trang — 23K4300021 & Phan Thị Yến Nhi — 23K4300014)  
> **Repository đối tượng:** [https://github.com/kimchi000-hash/hce-trace-hue.git](https://github.com/kimchi000-hash/hce-trace-hue.git) (Nhóm Kim Chi & Võ Thư)  
> **Mục tiêu:** Áp dụng prompt chuẩn mục I.1 để thẩm định hợp đồng `ProjectCore.sol` (288 dòng) và đặc tả `SPEC.md`, phân tách lỗi do AI phát hiện và lỗi do sinh viên tự thẩm định.

---

## Lần 1 — Prompt thẩm định rủi ro và phân quyền ban đầu
**Prompt đã dùng:**
```text
Bạn là chuyên viên thẩm định rủi ro tài sản số.
Dưới đây là mã nguồn hợp đồng ProjectCore.sol (288 dòng) và đặc tả SPEC.md của dự án Club Voting (kimchi000-hash/hce-trace-hue).
Hãy liệt kê mọi quyền đặc biệt mà admin/người tạo có thể thực hiện, và với mỗi quyền, nêu rõ:
- Tên hàm và số dòng
- Cử tri tham gia chịu rủi ro gì
Chỉ trả lời dựa trên mã nguồn tôi cung cấp. Nếu không tìm thấy quyền nào, hãy nói rõ là không tìm thấy, không suy đoán.
[Mã nguồn ProjectCore.sol và nội dung SPEC.md]
```

**AI trả về:**
- Báo cáo 3 điểm:
  1. Hàm `createElection()` (dòng 106): Admin được tự do thiết lập tham số cuộc bầu cử.
  2. Báo cáo rằng Admin có thể tự ý đổi kết quả bầu cử bằng một hàm `setWinner()`.
  3. Báo cáo hàm `approveElection()` (dòng 161): Yêu cầu người duyệt ký kích hoạt.

**Đánh giá:** ⚠️ Phải sửa  
**Chỗ sai của AI (Ảo giác):**
- AI tự bịa ra rằng hợp đồng có hàm `setWinner()` cho phép Admin chỉ định người thắng — trong khi đọc kỹ mã nguồn, **hoàn toàn không có hàm `setWinner()`**. Kết quả được tính toán hoàn toàn khách quan thông qua hàm `result()` ở dòng 222 dựa trên mảng `votes[]`.
- AI hoàn toàn bỏ sót lỗi nghiêm trọng nhất: sự bất đồng bộ giữa công thức băm trong `SPEC.md` (`candidateId, salt, msg.sender` với `bytes32 salt`) và dòng 204 trong `ProjectCore.sol` (`id, candidateId, salt, msg.sender` với `string calldata salt`).

**Cách sửa:**
- Sinh viên gạch bỏ điểm sai về `setWinner()`.
- Sinh viên Hoàng Thu Trang tự tay đối chiếu từng trường trong `SPEC.md` với hàm `reveal()` ở dòng 195–204 và phát hiện lỗi lệch chuẩn băm gây Revert `BadReveal()`.

**Ai phát hiện:** **Sinh viên Hoàng Thu Trang tự phát hiện**.

---

## Lần 2 — Prompt rà soát tính riêng tư và danh mục 10 tiêu chí an toàn
**Prompt đã dùng:**
```text
Hãy rà soát kỹ ProjectCore.sol theo 10 tiêu chí:
1. Phân quyền
2. Checks-Effects-Interactions
3. Dấu so sánh thời gian
4. Phép chia làm tròn
5. Cách chuyển ETH
6. Dữ liệu riêng tư & Event
7. Vòng lặp gas
8. Sự kiện event
9. Giá trị số 0
10. Kiểm tra address(0)
Đối chiếu với cam kết "Bầu cử kín tuyệt đối" trong SPEC.md. Nêu số dòng cụ thể.
```

**AI trả về:**
- Tiêu chí 6 & 8: AI chỉ ra rằng tại dòng 81 và dòng 210, sự kiện `Revealed(id, msg.sender, candidateId)` ghi rõ cả địa chỉ người gọi lẫn ứng viên, điều này có nghĩa là mọi người xem log đều biết ai bầu cho ai sau khi mở phiếu.
- Tiêu chí 10: Hàm `_setApprovers` dòng 153 đã kiểm tra `ap == address(0)` và `ap == msg.sender`.
- Tiêu chí 9: Đã kiểm tra số 0 tại `_validate` dòng 141-146.

**Đánh giá:** ✅ Dùng được  
**Chỗ đúng:** AI đã chỉ ra chính xác dòng 81 và 210 làm lộ bí mật lá phiếu qua Event log.  
**Ai phát hiện:**
- Lỗi lộ lá phiếu qua Event (dòng 81 & 210): **Sinh viên Phan Thị Yến Nhi và AI đồng thuận**.
- Lỗi Quorum `voterCount` không đối chiếu số lá Merkle (dòng 117): **AI phát hiện**.

---

## 💡 KẾT LUẬN VỀ VAI TRÒ CỦA CON NGƯỜI KHI RÀ SOÁT
Khi rà soát hợp đồng thông minh, AI rất hay mắc lỗi giả định (tự nghĩ ra các hàm quản trị quen thuộc như `pause`, `setWinner`, `mintMore`). Ngược lại, việc phát hiện lỗi lệch đặc tả nghiệp vụ (`SPEC.md` vs mã nguồn) đòi hỏi tư duy phân tích đối soát liên văn bản mà chỉ chuyên viên phân tích nghiệp vụ (BA) và kiểm toán viên con người mới phát hiện được chính xác.
