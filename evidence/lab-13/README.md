# 📁 TỔNG HỢP TOÀN BỘ SẢN PHẨM NỘP LAB 13

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên thực hiện:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Thư mục lưu trữ tập trung:** `evidence/lab-13/`  
**Commit quy chuẩn:** `lab-13: them negative test va hardening`  

---

## 📑 DANH MỤC CÁC SẢN PHẨM NỘP & BỘ HÌNH ẢNH MINH CHỨNG ĐẦY ĐỦ

Tất cả các thành phần nộp bài theo đúng yêu cầu slide bộ môn ECO2432 đã được tập trung đầy đủ trong thư mục `evidence/lab-13/` với đầy đủ tài liệu giải trình và bộ hình ảnh thực nghiệm sắc nét:

| STT | Tên sản phẩm nộp (Theo slide bộ môn) | Tệp minh chứng & Hình ảnh trong thư mục này | Nội dung chính |
| :-: | :--- | :--- | :--- |
| **1** | **Ảnh hoặc ảnh động chụp số dư ngân hàng trước (6 ETH) và sau khi tấn công (0 ETH)** | • [`1_reentrancy_attack_evidence.md`](1_reentrancy_attack_evidence.md)<br>🖼️ [`1_reentrancy_before_attack.jpg`](1_reentrancy_before_attack.jpg)<br>🖼️ [`1_reentrancy_balance_drain.jpg`](1_reentrancy_balance_drain.jpg) | Bộ đôi ảnh chụp giao diện Remix IDE trước và sau khi tấn công: Số dư từ 6.0 ETH (3 sinh viên nạp) bị rút cạn 100% về 0.0 ETH sang ví của `Attacker` (7.0 ETH), kèm log console đệ quy 7 vòng lặp. |
| **2** | **Bản đã vá + bằng chứng tấn công thất bại** | • [`2_patched_bank_and_proof.md`](2_patched_bank_and_proof.md)<br>• [`SafeBank.sol`](SafeBank.sol)<br>🖼️ [`2_safebank_defense_success.jpg`](2_safebank_defense_success.jpg) | Mã nguồn hợp đồng `SafeBank.sol` đã vá bằng Checks-Effects-Interactions & `nonReentrant`. Ảnh chụp Remix IDE chứng minh giao dịch tấn công bị **Revert** với lý do `"Khong co so du"`, số dư 6 ETH bảo toàn 100%. |
| **3** | **Ba câu giải thích vì sao thứ tự dòng lệnh là thứ chặn được tấn công** | • [`3_explain_order_of_execution.md`](3_explain_order_of_execution.md)<br>🖼️ [`3_cei_mechanism_flowchart.jpg`](3_cei_mechanism_flowchart.jpg) | Sơ đồ Infographic kỹ thuật đối chiếu trực quan quy tắc CEI và Vulnerable Pattern. Trả lời chi tiết 3 câu hỏi vấn đáp: Thứ tự lệnh, cơ chế dập tắt đệ quy ở Checks, và so sánh kế toán truyền thống. |
| **4** | **Ca kiểm thử thất bại của `ProjectCore.sol` & commit chuẩn** | • [`4_project_core_negative_tests.md`](4_project_core_negative_tests.md)<br>• [`negative_tests.js`](negative_tests.js)<br>🖼️ [`4_project_core_negative_tests.jpg`](4_project_core_negative_tests.jpg) | Danh mục 5 ca kiểm thử tiêu cực bảo mật (Chặn mạo danh, chặn chuyển nhượng Soulbound, chặn tước quyền, chặn metadata rỗng, chặn address 0). Ảnh chụp Terminal hiển thị 5/5 test PASS và lệnh git commit quy chuẩn. |
| **Phụ** | **Mã nguồn ngân hàng có lỗi & Attacker** | • [`VulnerableBank.sol`](VulnerableBank.sol) | Hợp đồng ngân hàng mô phỏng lỗ hổng The DAO 2016 và hợp đồng tấn công đệ quy `Attacker`. |

---

## 🎯 BẰNG CHỨNG COMMIT GIT
```bash
git commit -m "lab-13: them negative test va hardening"
```
