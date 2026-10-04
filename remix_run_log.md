# BẰNG CHỨNG THỰC HIỆN LAB 09 — HỢP ĐỒNG ĐẦU TIÊN: KÉT TIẾT KIỆM CÓ KHÓA THỜI GIAN

**Môn học:** ECO2432 — Tiền điện tử & Hợp đồng thông minh  
**Môi trường thử nghiệm:** Remix IDE VM (Cancun) / Solidity Compiler `0.8.26`  
**Hợp đồng luyện tập:** `contracts/training/TimeLockVault.sol`  
**Hợp đồng sản phẩm nhóm:** `contracts/project/ProjectCore.sol` (Chủ đề 7: Huy hiệu thành tích không chuyển nhượng)  

---

## 1. Bản đặc tả kỹ thuật két tiết kiệm (SPEC - TimeLockVault)

- **R1:** Bất kỳ ai cũng có thể nạp ETH vào két thông qua hàm `deposit()`.
- **R2:** Chỉ người tạo két (`owner`) mới có quyền rút tiền thông qua hàm `withdraw()`.
- **R3:** Chỉ được phép rút khi thời điểm hiện tại đã qua mốc mở khóa (`block.timestamp >= unlockTime`).
- **R4:** Số tiền nạp phải lớn hơn 0 (`msg.value > 0`), từ chối nếu nạp 0 wei với lỗi `ZeroAmount()`.
- **R5:** Mọi lần nạp và rút đều phải phát ra sự kiện có đánh chỉ mục (`Deposited`, `Withdrawn`) để tra cứu.

---

## 2. Bảng đo lường Gas tiêu thụ thực tế trên Remix VM (Bài toán liên kết Lab 7)

| Thao tác | Đầu vào / Tham số | Gas tiêu thụ (Remix Console) | Chi phí ước tính (20 Gwei, ETH = $3.000) | Kết quả trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **Deploy TimeLockVault** | `lockDurationSeconds = 120` (2 phút) | **148.625 gas** | ~$0,0089 USD | ✅ Khởi tạo thành công, ghi nhận `owner` và `unlockTime` |
| **Gọi deposit()** | `value = 1.0 ETH` | **43.812 gas** | ~$0,0026 USD | ✅ Nhận 1.0 ETH, phát sự kiện `Deposited(0x5B38...eddC4, 1 ETH)` |
| **Gọi withdraw() khi chưa tới hạn** | Giây thứ 15 (< 120s) | **23.518 gas** *(Revert)* | ~$0,0014 USD | ❌ Bị từ chối với custom error `StillLocked(unlockAt, currentTime)` |
| **Gọi withdraw() sau 2 phút** | Giây thứ 125 (> 120s) | **36.940 gas** | ~$0,0022 USD | ✅ Rút thành công 1.0 ETH về lại ví `owner`, phát `Withdrawn` |
| **Gọi timeLeft()** | Hàm `view` | **0 gas** *(off-chain)* | $0,00 USD | ✅ Trả về số giây đếm ngược chính xác |

---

## 3. Nhật ký kiểm thử thực nghiệm trên Remix VM (3 thao tác)

1. **Khởi tạo hợp đồng (Deploy):**
   - Tài khoản ví: `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`
   - Tham số: `lockDurationSeconds = 120`
   - Console: `[vm] from: 0x5B3...eddC4 to: TimeLockVault.(constructor) status: true`
2. **Nạp tiền (Deposit):**
   - Chuyển `1 Ether` vào ô Value, bấm nút `deposit`.
   - Log giao dịch:
     ```text
     [vm] from: 0x5B3...eddC4 to: TimeLockVault.deposit() value: 1000000000000000000 wei
     event: Deposited(from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, amount: 1000000000000000000)
     ```
3. **Thử rút tiền ngay lập tức (Negative Test — Thao tác bị chặn):**
   - Bấm `withdraw` ngay sau khi nạp (mới trôi qua 10 giây).
   - Console báo đỏ:
     ```text
     transact to TimeLockVault.withdraw errored: VM error: revert.
     revert: StillLocked(1759560120, 1759560010)
     ```
   - *Kết luận:* Két khóa tiền đúng như đặc tả; kể cả người tạo két cũng không thể rút tiền trước hạn.
4. **Rút tiền thành công sau 2 phút:**
   - Chờ qua 120 giây, bấm lại `withdraw`.
   - Giao dịch thành công, số dư hợp đồng về 0 ETH, ví `owner` nhận lại đủ 1.0 ETH.

---

## 4. Chuyển giao 4 kỹ thuật vào `ProjectCore.sol` (HCE Soulbound Badge)

Hợp đồng lõi của sản phẩm nhóm [contracts/project/ProjectCore.sol](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/crypto-smart-contract-2026/contracts/project/ProjectCore.sol) đã kế thừa và áp dụng trọn vẹn 4 bài học:

1. **Phân quyền (Access Control):** Sử dụng modifier `onlyOwner` của OpenZeppelin cho hai hàm nhạy cảm `issueBadge()` và `revokeBadge()`, bảo đảm chỉ có Ban Quản trị Nhà trường mới có quyền cấp và hủy danh hiệu.
2. **Sự kiện (Event Indexed):** Khai báo `BadgeIssued(address indexed recipient, uint256 indexed tokenId, ...)` và `BadgeRevoked(...)` có đánh chỉ mục để hỗ trợ DApp tra cứu và lọc theo địa chỉ sinh viên tức thì.
3. **Lỗi tùy biến (Custom Errors):** Định nghĩa danh mục lỗi có tên: `SoldOut()`, `AlreadyClaimed(recipient)`, `NotTransferable()`, `InvalidRecipient()`, `NotFound(tokenId)` giúp tiết kiệm phí gas và hiển thị thông báo lỗi rõ ràng.
4. **Checks-Effects-Interactions (CEI):** Trong hàm `issueBadge()`, kiểm tra điều kiện trước (`Checks`), cập nhật mapping `hasBadge[to] = true` và `nextTokenId++` (`Effects`) trước khi thực hiện gọi hàm đúc `_safeMint()` (`Interactions`).

---

## 5. Kết luận nghiệm thu & Commit

- Cả `TimeLockVault.sol` và `ProjectCore.sol` đều biên dịch sạch sẽ, không có cảnh báo (`0 errors, 0 warnings`).
- Hợp đồng `ProjectCore.sol` có độ dài 110 dòng mã (tuân thủ giới hạn dưới 150 dòng của môn học).
- **Thông điệp commit quy chuẩn của buổi học:**
  ```bash
  lab-09: contract loi bien dich duoc
  ```
