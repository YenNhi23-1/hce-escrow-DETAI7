# BẰNG CHỨNG THỬ NGHIỆM TIMELOCKVAULT & BẢNG ĐO GAS (LAB 09)

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:** Hoàng Thu Trang (`23K4300021`) & Phan Thị Yến Nhi (`23K4300014`)  
**Tệp hợp đồng mẫu:** `contracts/training/TimeLockVault.sol`  
**Môi trường thử nghiệm:** Remix VM (Cancun) / Trình biên dịch Solidity `0.8.26`  

---

## 1. Đặc tả kỹ thuật mô hình TimeLockVault

- **R1:** Bất kỳ ai cũng có thể nạp ETH vào két thông qua hàm `deposit()`.
- **R2:** Chỉ người tạo két (`owner`) mới có quyền rút tiền thông qua hàm `withdraw()`.
- **R3:** Chỉ được phép rút khi thời điểm hiện tại đã qua mốc mở khóa (`block.timestamp >= unlockTime`).
- **R4:** Số tiền nạp phải lớn hơn 0 (`msg.value > 0`), từ chối nếu nạp 0 wei với lỗi `ZeroAmount()`.
- **R5:** Mọi lần nạp và rút đều phải phát ra sự kiện có đánh chỉ mục (`Deposited`, `Withdrawn`) để tra cứu.

---

## 2. Bảng đo lường Gas tiêu thụ thực tế trên Remix VM

| Thao tác | Đầu vào / Tham số | Gas tiêu thụ (Remix Console) | Chi phí quy đổi (20 Gwei, ETH = $3.000) | Kết quả trạng thái thực tế |
| :--- | :--- | :---: | :---: | :--- |
| **Triển khai contract (Deploy)** | `lockDurationSeconds = 120` (2 phút) | **148.625 gas** | ~$0,0089 USD | ✅ Khởi tạo thành công, ghi nhận `owner` và `unlockTime` |
| **Nạp tiền (`deposit`)** | `value = 1.0 ETH` | **43.812 gas** | ~$0,0026 USD | ✅ Nhận 1.0 ETH, phát sự kiện `Deposited(0x5B38...eddC4, 1 ETH)` |
| **Rút tiền trước hạn (`withdraw`)** | Giây thứ 15 (< 120s) | **23.518 gas** *(Revert)* | ~$0,0014 USD | ❌ Bị chặn đứng với lỗi `StillLocked(unlockAt, currentTime)` |
| **Rút tiền sau hạn (`withdraw`)** | Giây thứ 125 (> 120s) | **36.940 gas** | ~$0,0022 USD | ✅ Rút thành công 1.0 ETH về lại ví `owner`, phát `Withdrawn` |
| **Kiểm tra thời gian (`timeLeft`)** | Hàm `view` | **0 gas** *(off-chain)* | $0,00 USD | ✅ Trả về số giây đếm ngược chính xác |

---

## 3. Nhật ký kiểm thử thực nghiệm trên Remix Console (3 thao tác)

1. **Khởi tạo hợp đồng (Deploy):**
   - Tài khoản ví: `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`
   - Tham số: `lockDurationSeconds = 120`
   - Log Remix Console:
     ```text
     [vm] from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 to: TimeLockVault.(constructor) status: true
     ```

2. **Nạp tiền (Deposit):**
   - Nạp `1 Ether` vào két qua hàm `deposit()`.
   - Log Remix Console:
     ```text
     [vm] from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 to: TimeLockVault.deposit() value: 1000000000000000000 wei
     event: Deposited(from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, amount: 1000000000000000000)
     ```

3. **Cố tình rút tiền ngay lập tức (Negative Test — Thao tác bị chặn):**
   - Bấm `withdraw` ngay sau khi nạp (chưa đủ 120 giây).
   - Log Remix Console báo đỏ:
     ```text
     transact to TimeLockVault.withdraw errored: VM error: revert.
     revert: StillLocked(1759560120, 1759560015)
     ```
   - *Kết luận:* Két khóa tiền đúng như đặc tả; kể cả người tạo két cũng không thể rút tiền trước hạn.

4. **Rút tiền thành công sau khi hết 2 phút:**
   - Chờ qua 120 giây, bấm lại `withdraw`.
   - Log Remix Console:
     ```text
     [vm] from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 to: TimeLockVault.withdraw status: true
     event: Withdrawn(to: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, amount: 1000000000000000000)
     ```
   - Số dư hợp đồng về `0 ETH`, ví chủ sở hữu nhận lại đủ `1.0 ETH`.
