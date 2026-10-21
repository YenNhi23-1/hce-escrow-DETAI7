# BÁO CÁO NỘP BÀI LAB 10: RÀ SOÁT MÃ NGUỒN DO AI SINH RA (AUDIT)

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Repo nhóm:** `hce-badge-k58`  
**Liên kết Commit cuối buổi:** `lab-10: audit va sua loi project core` (Hash: `0c9716f`)

---

## 1. BẢNG PHÂN TÍCH HỢP ĐỒNG MẪU `VaultBuggy.sol`
*Hợp đồng mẫu nằm tại: `contracts/training/VaultBuggy.sol`*

| STT | Tên lỗ hổng & Dòng mã | Mức độ | Cơ chế tấn công / Khai thác | Cách khắc phục |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Lộ mã bí mật `private`**<br>(Dòng 13: `uint256 private emergencyPin;`) | **Cao (High)** | Từ khóa `private` trong Solidity chỉ chặn hợp đồng khác gọi trực tiếp trong code, không hề mã hóa dữ liệu. Bất kỳ ai cũng đọc được qua hàm RPC `eth_getStorageAt`. | Không lưu trữ mã bí mật trực tiếp on-chain; dùng cơ chế kiểm soát chữ ký ngoài chuỗi hoặc Multi-sig. |
| **2** | **Vi phạm Checks-Effects-Interactions (Reentrancy)**<br>(Dòng 32–37: hàm `withdraw`) | **Nghiêm trọng (Critical)** | Hợp đồng gọi lệnh chuyển ETH (`call{value: ...}`) ra ngoài TRƯỚC KHI trừ số dư `balances[msg.sender]`. Kẻ tấn công tạo smart contract có hàm `receive()` gọi lại liên tục để rút cạn quỹ. | Đổi thứ tự: Cập nhật sổ sách (`balances[msg.sender] -= amount;`) TRƯỚC KHI chuyển ETH ra ngoài. |
| **3** | **Chiếm đoạt quỹ qua mã PIN lộ**<br>(Dòng 41–47: hàm `emergencyWithdraw`) | **Cao (High)** | Bất kỳ ai đọc được PIN từ Slot 2 đều có thể gọi hàm này để rút toàn bộ số dư hợp đồng về ví của mình. | Bỏ cơ chế rút tiền bằng mã PIN cố định; áp dụng `onlyOwner` và thời gian khóa (Timelock). |
| **4** | **Xác thực bằng `tx.origin`**<br>(Dòng 50–54: hàm `changeOwner`) | **Trung bình (Medium)** | `tx.origin` đại diện cho ví gốc khởi tạo giao dịch. Nếu owner tương tác với một DApp/hợp đồng lừa đảo, hợp đồng đó có thể mạo danh owner để cướp quyền sở hữu. | Thay thế hoàn toàn bằng `msg.sender == owner`. |

---

## 2. BẰNG CHỨNG THỰC NGHIỆM ĐỌC Ô NHỚ SLOT 2 (`eth_getStorageAt`)

### 2.1. Kịch bản thực nghiệm
- Triển khai hợp đồng `VaultBuggy` trên môi trường Web3 với tham số khởi tạo mã PIN: `_pin = 123456`.
- Địa chỉ hợp đồng thử nghiệm: `0x71C2B0B8f59b6F27F2Ec3F2913A3C9100D154982`.

### 2.2. Câu lệnh chạy trong Tab Console của trình duyệt (Dùng `ethers.js` / Web3 API)
```javascript
// Đọc trực tiếp ô nhớ thứ 2 (Slot 2) của hợp đồng trên blockchain
const resultHex = await window.ethereum.request({
  method: "eth_getStorageAt",
  params: ["0x71C2B0B8f59b6F27F2Ec3F2913A3C9100D154982", "0x2", "latest"]
});

console.log("Giá trị hex đọc được từ Slot 2:", resultHex);
// Trả về: "0x000000000000000000000000000000000000000000000000000000000001e240"

const pinNumber = parseInt(resultHex, 16);
console.log("Mã PIN giải mã sang số thập phân:", pinNumber);
// Trả về chính xác: 123456
```

### 2.3. Kết luận rút ra (Trọng tâm bài học Lab 10)
Từ khóa `private` trong Solidity chỉ giới hạn quyền truy cập mức hàm giữa các hợp đồng thông minh. Nó **hoàn toàn không làm cho dữ liệu trở nên bí mật**. Mọi trạng thái lưu trữ trên blockchain đều công khai 100%. Đây là lỗi bảo mật phổ biến nhất của người mới học và là nguyên nhân gây ra nhiều sự cố lộ dữ liệu nhạy cảm trên thực tế.

---

## 3. BẢNG PHÁT HIỆN LỖ HỔNG TRÊN `ProjectCore.sol` (BẢNG BẮT BUỘC TRONG `AI_JOURNAL.md`)

Nhóm đã đối chiếu `contracts/project/ProjectCore.sol` với bản đặc tả `docs/SPEC.md` và `docs/ECONOMIC_RULES.md`, phát hiện 4 vấn đề:

| Lỗi | Mô tả chi tiết lỗ hổng | Ai phát hiện | Cách khắc phục đã áp dụng trong `ProjectCore.sol` v0.2 |
| :---: | :--- | :---: | :--- |
| **1** | **Issuer bị tước quyền vẫn có thể thu hồi huy hiệu cũ:**<br>Hàm `revokeBadge` chỉ kiểm tra `msg.sender == b.issuedBy`. Nếu một Issuer đã bị Admin bãi nhiệm (`isIssuer[issuer] = false`), người này vẫn có thể thu hồi các huy hiệu cũ họ từng cấp. | **Sinh viên phát hiện** | Bổ sung kiểm tra Issuer đang còn hiệu lực:<br>`bool isValidActiveIssuer = (msg.sender == b.issuedBy && isIssuer[msg.sender]);` |
| **2** | **Kẹt trạng thái cấp lại sau khi thu hồi (Permanent Lockout):**<br>Khi thu hồi do sai sót thông tin, mapping `hasBadgeType[student][badgeType]` không được đặt lại về `false` và `currentSupplyPerType` không giảm. Sinh viên đó sẽ vĩnh viễn không thể được cấp lại do bị chặn bởi `BadgeAlreadyAwarded()`. | **Sinh viên phát hiện** | Thêm lệnh reset trạng thái trong `revokeBadge`:<br>`hasBadgeType[student][b.badgeType] = false;`<br>`if (currentSupplyPerType[b.badgeType] > 0) currentSupplyPerType[b.badgeType]--;` |
| **3** | **Thiếu kiểm tra tham số chuỗi dữ liệu rỗng (Empty Metadata):**<br>Hàm `issueBadge` do AI sinh ra không kiểm tra độ dài chuỗi `metadataURI`. Người phát hành có thể vô ý truyền vào chuỗi rỗng `""`, tạo ra huy hiệu vô nghĩa không có liên kết minh chứng. | **Công cụ AI phát hiện** | Thêm custom error `error EmptyMetadata();` và lệnh kiểm tra ngay tại bước Checks:<br>`if (bytes(metadataURI).length == 0) revert EmptyMetadata();` |
| **4** | **Thiếu hàm cấp phát hàng loạt theo lô (Gas Bottleneck):**<br>Mã nguồn ban đầu chỉ hỗ trợ cấp từng người. Khi trao giải cho 50–100 sinh viên, việc gọi 100 giao dịch riêng lẻ gây tốn kém ngân sách gas và nghẽn mạng, vi phạm cam kết kinh tế trong `ECONOMIC_RULES.md`. | **Sinh viên phát hiện**<br>*(Được cộng điểm)* | Thiết kế và bổ sung hàm `issueBatch(address[] calldata students, uint256 badgeType, string calldata metadataURI)` với giới hạn tối đa 50 sinh viên/lô (`BatchTooLarge`). |

---

## 4. MINH CHỨNG ĐOẠN MÃ ĐÃ ĐƯỢC VÁ LỖI TRONG `ProjectCore.sol`

```solidity
    // [VÁ LỖI 3]: Kiểm tra metadata không được để rỗng
    if (bytes(metadataURI).length == 0) revert EmptyMetadata();

    // [VÁ LỖI 4]: Hàm cấp phát hàng loạt theo lô (Tối ưu gas)
    function issueBatch(
        address[] calldata students,
        uint256 badgeType,
        string calldata metadataURI
    ) external onlyAuthorizedIssuer {
        uint256 total = students.length;
        if (total > 50) revert BatchTooLarge(total, 50);

        for (uint256 i = 0; i < total; i++) {
            issueBadge(students[i], badgeType, metadataURI);
        }
    }

    // [VÁ LỖI 1 & 2]: Vá phân quyền thu hồi và giải phóng trạng thái kẹt
    function revokeBadge(uint256 tokenId, string calldata reason) external {
        Badge storage b = badges[tokenId];
        if (b.dateAwarded == 0) revert BadgeNotFound();
        if (b.revoked) revert BadgeAlreadyRevoked();

        // [VÁ LỖI 1]: Issuer cũ nếu đã bị tước quyền thì KHÔNG được thu hồi nữa
        bool isCurrentOwner = (msg.sender == owner());
        bool isValidActiveIssuer = (msg.sender == b.issuedBy && isIssuer[msg.sender]);
        if (!isCurrentOwner && !isValidActiveIssuer) {
            revert NotAuthorized();
        }

        // [VÁ LỖI 2]: Reset trạng thái để cho phép cấp lại khi giải quyết xong nhầm lẫn
        address student = _ownerOf(tokenId);
        hasBadgeType[student][b.badgeType] = false;
        if (currentSupplyPerType[b.badgeType] > 0) {
            currentSupplyPerType[b.badgeType]--;
        }

        b.revoked = true;
        emit BadgeRevoked(tokenId, student, msg.sender, reason);
    }
```

---

## 5. THÔNG TIN COMMIT GIT NỘP BÀI
- **Lệnh commit đã thực thi:**
  ```bash
  git commit -m "lab-10: audit va sua loi project core"
  ```
- **Mã băm commit (Hash):** `0c9716f`
- **Tình trạng:** Sẵn sàng nộp và bảo vệ trước Hội đồng chấm điểm.
