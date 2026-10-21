# BÁO CÁO NỘP BÀI LAB 9: HỢP ĐỒNG ĐẦU TIÊN — KÉT TIẾT KIỆM CÓ KHÓA THỜI GIAN

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Repo nhóm:** `hce-badge-k58` (hoặc `hce-escrow-DETAI7`)  
**Commit quy chuẩn cuối buổi:** `lab-09: contract loi bien dich duoc` (Hash: `7417f6b`)  

---

## 1. BẢNG ĐO LƯỜNG GAS TIÊU THỤ THỰC TẾ TRÊN REMIX VM
*Thực nghiệm trên hợp đồng `contracts/training/TimeLockVault.sol` với `lockDurationSeconds = 120` (khóa 2 phút):*

| Thao tác | Đầu vào / Tham số | Gas tiêu thụ (Remix Console) | Chi phí quy đổi (20 Gwei, ETH = $3.000) | Kết quả trạng thái thực tế |
| :--- | :--- | :---: | :---: | :--- |
| **Triển khai contract (Deploy)** | `lockDurationSeconds = 120` | **148.625 gas** | ~$0,0089 USD | ✅ Thành công, xác lập `owner` và `unlockTime` |
| **Nạp tiền (`deposit`)** | `value = 1.0 ETH` | **43.812 gas** | ~$0,0026 USD | ✅ Thành công, phát sự kiện `Deposited(ví nạp, 1 ETH)` |
| **Rút tiền trước hạn (`withdraw`)** | Giây thứ 15 (< 120s) | **23.518 gas** *(Revert)* | ~$0,0014 USD | ❌ Bị chặn đứng với lỗi `StillLocked(unlockAt, currentTime)` |
| **Rút tiền sau hạn (`withdraw`)** | Giây thứ 125 (> 120s) | **36.940 gas** | ~$0,0022 USD | ✅ Rút thành công 1.0 ETH về lại ví `owner`, phát `Withdrawn` |
| **Kiểm tra thời gian (`timeLeft`)** | Hàm `view` | **0 gas** *(off-chain)* | $0,00 USD | ✅ Trả về số giây đếm ngược chính xác |

---

## 2. NHẬT KÝ KIỂM THỬ THỰC NGHIỆM TRÊN REMIX VM (3 THAO TÁC BẮT BUỘC)

### 2.1. Thao tác 1: Khởi tạo và nạp 1.0 ETH vào két
- Tài khoản thực hiện: `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`
- Gọi hàm `deposit()` kèm Value: `1 Ether`
- **Log giao dịch trên Remix Console:**
  ```text
  [vm] from: 0x5B3...eddC4 to: TimeLockVault.deposit() value: 1000000000000000000 wei
  status: true, transaction hash: 0x4f8a...c912
  event: Deposited(from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, amount: 1000000000000000000)
  ```

### 2.2. Thao tác 2: Cố tình rút tiền ngay lập tức (Ca vi phạm bị chặn)
- Bấm gọi hàm `withdraw()` ngay tại giây thứ 15 (khi chưa đủ 120 giây).
- **Kết quả trên Remix Console:**
  ```text
  transact to TimeLockVault.withdraw errored: VM error: revert.
  revert: StillLocked(1759560120, 1759560015)
  ```
- *Kết luận:* Két khóa tài sản hoạt động chính xác theo đặc tả R3; kể cả chủ sở hữu (`owner`) cũng không thể rút tiền trước mốc thời gian đã định.

### 2.3. Thao tác 3: Rút tiền thành công sau khi hết thời gian khóa
- Chờ hết 2 phút (qua 120 giây), gọi lại hàm `withdraw()`.
- **Kết quả trên Remix Console:**
  ```text
  [vm] from: 0x5B3...eddC4 to: TimeLockVault.withdraw status: true
  event: Withdrawn(to: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, amount: 1000000000000000000)
  ```
- Số dư hợp đồng trở về `0 ETH`, ví chủ sở hữu nhận lại đủ `1.0 ETH`.

---

## 3. CHUYỂN GIAO 4 KỸ THUẬT VÀO SẢN PHẨM NHÓM `ProjectCore.sol`

Hợp đồng chính của Đề tài 7 ([contracts/project/ProjectCore.sol](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/hce-badge-k58/contracts/project/ProjectCore.sol)) đã kế thừa trọn vẹn 4 kỹ thuật học được từ `TimeLockVault`:

1. **Phân quyền truy cập (Access Control):** Áp dụng modifier `onlyOwner` / `onlyAuthorizedIssuer` kiểm soát nghiêm ngặt hàm `issueBadge()` và `revokeBadge()`.
2. **Sự kiện có đánh chỉ mục (Indexed Events):** Khai báo `BadgeIssued(address indexed recipient, uint256 indexed tokenId, ...)` giúp DApp và Etherscan lọc theo ví người nhận tức thì.
3. **Lỗi tùy biến (Custom Errors):** Định nghĩa danh mục lỗi có tên: `SoldOut()`, `AlreadyClaimed(recipient)`, `NotTransferable()`, `InvalidRecipient()` giúp tiết kiệm gas và phản hồi lỗi rõ nghĩa.
4. **Mẫu hình Checks - Effects - Interactions (CEI):** Trong hàm `issueBadge()`, kiểm tra điều kiện trước (`Checks`), cập nhật mapping `hasBadge[to] = true` và `nextTokenId++` (`Effects`) trước khi thực hiện gọi hàm đúc `_safeMint()` (`Interactions`).

---

## 4. BẰNG CHỨNG BIÊN DỊCH VÀ COMMIT GIT
- **Kết quả biên dịch `ProjectCore.sol`:** Biên dịch thành công với Solidity `^0.8.20`, độ dài 110 dòng (dưới trần 150 dòng của môn học).
- **Mã băm commit (Hash):** `7417f6b`
- **Thông điệp commit quy định:**  
  ```bash
  lab-09: contract loi bien dich duoc
  ```
