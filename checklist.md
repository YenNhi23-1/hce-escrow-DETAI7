# 📋 BIÊN BẢN NGHIỆM THU LAB 11 — CÀI QUY TẮC KINH TẾ VÀO SẢN PHẨM

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:** Hoàng Thu Trang (`23K4300021`) & Phan Thị Yến Nhi (`23K4300014`)  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Tên repo:** `hce-badge-k58`  

---

## 🎯 Chuẩn đầu ra Lab 11
- [x] `ProjectCore.sol` có ít nhất một quy tắc kinh tế về quyền lợi/chống lạm dụng khớp với `docs/ECONOMIC_RULES.md` (Quy tắc Soulbound Token cấm chuyển nhượng tuyệt đối).
- [x] Có bằng chứng ca kiểm thử thành công (`issueBadge()` phát sự kiện `BadgeIssued`).
- [x] Có bằng chứng ca kiểm thử cố tình vi phạm quy tắc bị từ chối chính xác bằng custom error (`safeTransferFrom` bị chặn bởi `NotTransferable()`).
- [x] Có bằng chứng ca vi phạm cấp trùng bị chặn bởi `BadgeAlreadyAwarded()`.
- [x] Đo lường được lượng gas tiết kiệm trước và sau khi tối ưu bằng custom error.
- [x] Commit: `lab-11: cai quy tac kinh te va test`.
