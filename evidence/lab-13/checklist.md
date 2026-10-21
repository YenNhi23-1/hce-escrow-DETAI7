# 📋 BIÊN BẢN NGHIỆM THU LAB 13 — THỰC NGHIỆM MỘT VỤ MẤT TIỀN VÀ CÁCH KHẮC PHỤC

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:** Hoàng Thu Trang (`23K4300021`) & Phan Thị Yến Nhi (`23K4300014`)  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Tên repo:** `hce-badge-k58`  

---

## 🎯 Chuẩn đầu ra Lab 13 (Kèm đầy đủ minh chứng hình ảnh)
- [x] **Ảnh chụp số dư trước (6 ETH) và sau khi bị tấn công (0 ETH):**
  - [x] Ảnh trước tấn công: `1_reentrancy_before_attack.jpg` (Số dư 6.0 ETH từ 3 sinh viên).
  - [x] Ảnh sau tấn công: `1_reentrancy_balance_drain.jpg` (Rút cạn 100% về 0.0 ETH, Attacker có 7.0 ETH).
- [x] **Bản đã vá + bằng chứng tấn công thất bại:**
  - [x] Hợp đồng vá: `SafeBank.sol` (Đổi thứ tự CEI và dùng `ReentrancyGuard`).
  - [x] Ảnh minh chứng: `2_safebank_defense_success.jpg` (Giao dịch Revert `"Khong co so du"`, số dư 6 ETH bảo toàn tuyệt đối).
- [x] **Ba câu giải thích vì sao thứ tự dòng lệnh là thứ chặn được tấn công:**
  - [x] Văn bản trả lời chi tiết: `3_explain_order_of_execution.md`.
  - [x] Sơ đồ Infographic: `3_cei_mechanism_flowchart.jpg` (Đối chiếu trực quan quy tắc CEI và Vulnerable Pattern).
- [x] **Ca kiểm thử thất bại của `ProjectCore.sol` & commit chuẩn:**
  - [x] Hardening trạng thái và 5 ca negative test trong `negative_tests.js`.
  - [x] Ảnh Terminal chạy test: `4_project_core_negative_tests.jpg` (5/5 Passing test xanh và lệnh commit).
  - [x] Commit: `lab-13: them negative test va hardening`.
