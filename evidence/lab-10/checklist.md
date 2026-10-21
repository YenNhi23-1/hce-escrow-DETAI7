# 📋 BIÊN BẢN NGHIỆM THU LAB 10 — RÀ SOÁT MÃ NGUỒN DO AI SINH RA

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm nghiên cứu:** Hoàng Thu Trang (`23K4300021`) & Phan Thị Yến Nhi (`23K4300014`)  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Tên repo:** `hce-badge-k58`  
**Ngày thực hiện:** 04/10/2026  

---

## 🎯 1. Chuẩn đầu ra Lab 10
- [x] Tìm ra đủ 4/4 lỗi trong hợp đồng mẫu `contracts/training/VaultBuggy.sol`.
- [x] Thực nghiệm thành công việc đọc ô nhớ Slot 2 (`eth_getStorageAt`) chứng minh biến `private` không hề bí mật trên blockchain.
- [x] Rà soát và phát hiện 4 lỗi trên hợp đồng chính `contracts/project/ProjectCore.sol` (trong đó có 3 lỗi do sinh viên tự tìm ra).
- [x] Đã nâng cấp và vá lỗi thành công vào `ProjectCore.sol` (phiên bản v0.2).
- [x] Cập nhật bảng kiểm toán bắt buộc vào [docs/AI_JOURNAL.md](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/docs/AI_JOURNAL.md).

---

## 🔬 2. Thực nghiệm đọc bộ nhớ Slot 2 (`eth_getStorageAt`)
- **Mã triển khai:** `VaultBuggy` với `_pin = 123456`.
- **Lệnh thực nghiệm:**
  ```javascript
  await window.ethereum.request({
    method: "eth_getStorageAt",
    params: ["0x71C2B0B8f59b6F27F2Ec3F2913A3C9100D154982", "0x2", "latest"]
  });
  ```
- **Kết quả đọc được:** `0x000000000000000000000000000000000000000000000000000000000001e240` (hệ thập lục phân của `123456`).
- **Ý nghĩa bài học:** Biến `private` trong Solidity chỉ có tác dụng hạn chế truy cập mức mã nguồn, hoàn toàn không mã hóa dữ liệu. Không bao giờ được lưu trữ dữ liệu nhạy cảm hay mã bí mật trên on-chain.

---

## 🛠️ 3. Danh sách 4 lỗi đã sửa trong ProjectCore.sol (v0.2)
1. **Lỗi 1 (Phân quyền thu hồi):** Issuer bị tước quyền không thể thu hồi các huy hiệu cũ nữa.
2. **Lỗi 2 (Kẹt trạng thái cấp lại):** Reset `hasBadgeType` và trừ `currentSupplyPerType` khi thu hồi để không làm kẹt quyền cấp lại của sinh viên.
3. **Lỗi 3 (Tham số rỗng):** Chặn đứng tham số `metadataURI` rỗng bằng custom error `EmptyMetadata()`.
4. **Lỗi 4 (Cấp phát theo lô):** Bổ sung hàm `issueBatch` tối ưu chi phí gas khi cấp hàng loạt cho sinh viên.

---

## 📦 4. Lệnh Commit chuẩn Lab 10
```bash
git add .
git commit -m "lab-10: audit va sua loi project core"
```
