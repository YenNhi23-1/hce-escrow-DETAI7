# BÁO CÁO NỘP BÀI LAB 11: CÀI QUY TẮC KINH TẾ VÀO SẢN PHẨM & KIỂM THỬ

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Repo nhóm:** `hce-badge-k58`  
**Commit quy chuẩn cuối buổi:** `lab-11: cai quy tac kinh te va test`  

---

## 1. QUY TẮC KINH TẾ CỐT LÕI ĐÃ CÀI ĐẶT TRONG `ProjectCore.sol`
*Đối chiếu trực tiếp với `docs/ECONOMIC_RULES.md`:*

1. **Khóa Soulbound tuyệt đối (Non-Transferability):**
   - Override hàm `_update(address to, uint256 tokenId, address auth)` của OpenZeppelin v5.
   - Nếu phát hiện chuyển giao giữa 2 ví người dùng (`from != address(0) && to != address(0)`), hợp đồng lập tức từ chối và hoàn tác bằng custom error:
     ```solidity
     if (isTransfer) revert NotTransferable();
     ```
2. **Quy tắc chống nhận trùng lặp danh hiệu (Anti-Duplication Rule):**
   - Bản đồ `hasBadgeType[studentAddress][badgeType]` đảm bảo mỗi sinh viên chỉ được nhận tối đa 1 huy hiệu trong cùng một danh mục giải thưởng.
3. **Quy tắc trần cấp phát (Max Supply Cap per Category):**
   - Kiểm tra `currentSupplyPerType[badgeType] >= limit` $\rightarrow$ `revert ExceedsMaxSupply()`.

---

## 2. KẾT QUẢ KIỂM THỬ THỰC NGHIỆM TRÊN REMIX VM

### 2.1. Ca kiểm thử 1: Thao tác hợp lệ (Positive Test)
- **Hành vi:** Issuer cấp phát huy hiệu Loại 1 ("Sinh viên 5 Tốt") cho ví sinh viên `0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2`.
- **Dữ liệu đầu vào:**
  - `student`: `0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2`
  - `badgeType`: `1`
  - `metadataURI`: `"ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"`
- **Kết quả giao dịch:**
  - `status: true`
  - Gas tiêu thụ: `82.410 gas`
  - Sự kiện phát ra: `BadgeIssued(tokenId: 1, student: 0xAb84..., badgeType: 1, ...)`
  - Số dư token của sinh viên: `balanceOf(0xAb84...) = 1`

### 2.2. Ca kiểm thử 2: Cố tình vi phạm quy tắc Soulbound (Negative Test 1 — Cấm chuyển nhượng)
- **Hành vi:** Sinh viên `0xAb84...` cố tình gọi hàm `safeTransferFrom` để chuyển nhượng huy hiệu `#1` sang ví thứ hai `0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db`.
- **Kết quả giao dịch:**
  - Giao dịch bị **Revert** hoàn toàn, số dư hai bên giữ nguyên.
  - Mã lỗi trả về đúng chuẩn:
    ```text
    transact to ProjectCore.safeTransferFrom errored: VM error: revert.
    revert: NotTransferable()
    ```
  - *Ý nghĩa kinh tế:* Triệt tiêu 100% thị trường mua bán danh hiệu sinh viên trên chuỗi.

### 2.3. Ca kiểm thử 3: Cố tình nhận trùng lặp danh hiệu (Negative Test 2 — Chống lạm dụng)
- **Hành vi:** Issuer vô tình hoặc cố ý gọi lại hàm `issueBadge` loại 1 cho cùng địa chỉ ví sinh viên `0xAb84...`.
- **Kết quả giao dịch:**
  - Giao dịch bị Revert ngay lập tức ở bước Checks.
  - Lỗi trả về:
    ```text
    revert: BadgeAlreadyAwarded()
    ```

---

## 3. ĐO LƯỜNG VÀ TỐI ƯU GAS CHO QUY TẮC KINH TẾ
| Hành động | Gas ban đầu (v0.1) | Gas sau tối ưu (Custom Error v0.2) | Tiết kiệm |
| :--- | :---: | :---: | :---: |
| `issueBadge()` thành công | 89.250 gas | **82.410 gas** | -6.840 gas (~7.6%) |
| `safeTransferFrom()` bị chặn | 28.110 gas | **23.140 gas** | -4.970 gas (~17.6%) |
| `revokeBadge()` thành công | 42.600 gas | **38.920 gas** | -3.680 gas (~8.6%) |

---

## 4. BẰNG CHỨNG COMMIT GIT
- **Lệnh commit quy chuẩn:**
  ```bash
  git commit -m "lab-11: cai quy tac kinh te va test"
  ```
