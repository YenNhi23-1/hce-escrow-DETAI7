# BẢNG ĐỐI CHIẾU 10 HẠNG MỤC KIỂM TRA BẮT BUỘC (LAB 14)

> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Nhóm rà soát:** Nhóm 07 (Hoàng Thu Trang — 23K4300021 & Phan Thị Yến Nhi — 23K4300014)  
> **Repository được rà soát:** [https://github.com/kimchi000-hash/hce-trace-hue.git](https://github.com/kimchi000-hash/hce-trace-hue.git)  
> **Đối tượng rà soát:** Hợp đồng `contracts/project/ProjectCore.sol` (288 dòng) và `docs/SPEC.md` của Nhóm VotaChain (Kim Chi & Võ Thư)  

---

## 📋 BẢNG RÀ SOÁT 10 TIÊU CHÍ KỸ THUẬT THEO ĐỀ CƯƠNG TRANG 32

| # | Hạng mục kiểm tra | Câu hỏi kiểm tra chuẩn | Kết quả trên `ProjectCore.sol` | Đánh giá & Ghi chú chi tiết |
| :-: | :--- | :--- | :---: | :--- |
| **1** | **Phân quyền (Access Control)** | Mọi hàm nhạy cảm có kiểm tra người gọi không? Có hàm nào quên kiểm tra không? | **ĐẠT** | Hàm `approveElection()` kiểm tra chặt chẽ `isApprover[id][msg.sender]` và `!hasApproved`. Hàm `commit()` xác minh qua Merkle Proof. Không có backdoor. |
| **2** | **Thứ tự thao tác (Checks-Effects-Interactions)** | Có hàm nào chuyển tiền ra ngoài trước khi cập nhật biến trạng thái không? | **ĐẠT** | Hàm `commit()` và `reveal()` luôn gán `hasRevealed = true`, cập nhật `votes[candidateId] += 1` và `revealedCount += 1` trước mọi thao tác khác. Không có external calls. |
| **3** | **Điều kiện thời gian (Timestamp)** | Dấu so sánh có đúng chiều không? Thử nghĩ trường hợp đúng bằng mốc. | **ĐẠT** | Hàm `phase()` so sánh thời gian chính xác: `block.timestamp <= e.regEnd`, `<= e.commitEnd`, `<= e.revealEnd`. Đảm bảo chu kỳ 4 pha không bị giao thoa. |
| **4** | **Phép chia (Division rounding)** | Có phép chia nào làm tròn xuống thành 0 với số nhỏ không? | **ĐẠT** | Kiểm tra Quorum tại dòng 229 chuyển phép chia thành phép nhân chéo an toàn: `e.revealedCount * BPS < e.voterCount * e.quorumBps`, triệt tiêu hoàn toàn rủi ro làm tròn về 0. |
| **5** | **Cách chuyển ETH** | Dùng `call` hay `transfer`? Có kiểm tra kết quả trả về không? | **KHÔNG ÁP DỤNG** | Hợp đồng bầu cử thuần túy phi tài chính, không có hàm `payable` và không giữ tiền tệ ETH, hoàn toàn miễn nhiễm với rủi ro chuyển tiền. |
| **6** | **Dữ liệu riêng tư (Privacy)** | Có dữ liệu nào tưởng là bí mật nhưng thực ra đọc được không? | **CẢNH BÁO (PHÁT HIỆN 2 — Dòng 81 & 210)** | **Lộ danh tính cử tri trong Event Logs:** Sự kiện `Revealed(id, msg.sender, candidateId)` phát sóng địa chỉ cử tri kèm ứng viên, làm lộ bí mật lá phiếu trên chuỗi. Khuyến nghị tách thành 2 events. |
| **7** | **Vòng lặp (Gas Limit)** | Có vòng lặp nào chạy trên danh sách dài không giới hạn không? | **ĐẠT** | Các vòng lặp duyệt `votes` trong `result()` bị giới hạn bởi `MAX_CANDIDATES = 20`. Danh sách người duyệt bị giới hạn bởi `MAX_APPROVERS = 10`. Không vượt trần gas. |
| **8** | **Sự kiện (Events)** | Mọi thay đổi trạng thái có ghi lại sự kiện để tra cứu không? | **ĐẠT** | Phát ra đầy đủ `ElectionCreated`, `ElectionApproved`, `ElectionActivated`, `Committed`, `Revealed`. |
| **9** | **Trường hợp số 0 (Zero values)** | Nạp 0 đồng, rút khi số dư 0, danh sách rỗng — xử lý thế nào? | **ĐẠT** | Hàm `_validate()` kiểm tra kỹ: `regMinutes > 0`, `commitMinutes > 0`, `revealMinutes > 0`, `voterCount > 0`, `merkleRoot != bytes32(0)`, `names.length >= 2`. |
| **10** | **Địa chỉ rỗng (`address(0)`)** | Có kiểm tra tham số địa chỉ khác `address(0)` không? | **ĐẠT** | Hàm `_setApprovers()` kiểm tra `ap != address(0)` và `ap != msg.sender` (người tạo không được tự duyệt cho chính mình). |

---

## 🎯 KẾT LUẬN
Codebase của Nhóm VotaChain (`hce-trace-hue`) thể hiện trình độ kỹ thuật vững vàng với các kỹ thuật nâng cao (Merkle Proof, Commit-Reveal, Basis Points). Việc phát hiện lỗi lệch chuẩn băm giữa `SPEC.md` và `ProjectCore.sol` (Phát hiện 1) và cảnh báo lộ lá phiếu qua Event (Phát hiện 2) đã giúp nhóm bạn kịp thời hoàn thiện sản phẩm đạt chuẩn an toàn cao nhất trước khi bước vào Lab 15.
