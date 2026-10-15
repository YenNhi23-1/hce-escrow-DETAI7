# 🧪 SẢN PHẨM 4: CÁC CA KIỂM THỬ THẤT BẠI CỦA `ProjectCore.sol` VÀ TÔI LUYỆN BẢO MẬT (HARDENING)

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Achievement Badge)  
**Mã nguồn kiểm thử:** `ProjectCore.sol`  
**Commit quy chuẩn:** `lab-13: them negative test va hardening`  

---

## 🔒 1. ÁP DỤNG BÀI HỌC CHECKS - EFFECTS - INTERACTIONS VÀO `ProjectCore.sol` (STATE HARDENING)

Hợp đồng `ProjectCore.sol` không giữ ETH nhưng có thể bị đe dọa bởi tái nhập trạng thái thông qua hàm `_safeMint()` (khi người nhận là contract triển khai hàm callback `onERC721Received`). 

Nhóm đã áp dụng bài học Lab 13 để **làm cứng hợp đồng (Hardening)**:
```solidity
function issueBadge(
    address student, 
    uint256 badgeType, 
    string calldata metadataURI
) external returns (uint256) {
    // 1. CHECKS: Kiểm tra quyền và tính hợp lệ của tham số
    if (!isIssuer[msg.sender] && msg.sender != owner) revert NotAuthorized();
    if (student == address(0)) revert InvalidRecipient();
    if (bytes(metadataURI).length == 0) revert EmptyMetadata();
    if (hasBadgeType[student][badgeType]) revert AlreadyHasBadge();

    // 2. EFFECTS: Cập nhật toàn bộ sổ sách trạng thái TRƯỚC TIÊN!
    uint256 tokenId = _nextTokenId++;
    hasBadgeType[student][badgeType] = true;
    badgeRecords[tokenId] = BadgeData({
        badgeType: badgeType,
        issuer: msg.sender,
        issueDate: block.timestamp,
        metadataURI: metadataURI
    });
    emit BadgeIssued(tokenId, student, badgeType, msg.sender);

    // 3. INTERACTIONS: Gọi hàm đúc token ra ngoài SAU CÙNG!
    // Dù student có triển khai hàm onERC721Received() độc hại để gọi lại issueBadge(),
    // thì bước Checks (hasBadgeType) sẽ lập tức chặn đứng vì trạng thái đã được lưu trước!
    _safeMint(student, tokenId);

    return tokenId;
}
```

---

## 🛑 2. DANH SÁCH 5 CA KIỂM THỬ TIÊU CỰC BẮT BUỘC THẤT BẠI (NEGATIVE TESTS)

Toàn bộ các ca kiểm thử tiêu cực này được thiết kế để **cố tình vi phạm quy tắc hệ thống** và kiểm tra xem hợp đồng có **chủ động chặn đứng (Revert)** hay không.

### 🔴 Ca 1: Chặn kẻ mạo danh (Không phải Issuer/Admin) cố tình cấp phát huy hiệu
- **Thao tác vi phạm:** Địa chỉ ví lạ `0xAttacker...` gọi hàm `issueBadge(student1, 1, "uri")`.
- **Kết quả mong đợi:** Giao dịch bị Revert ngay lập tức với mã lỗi:
  ```text
  revert: NotAuthorized()
  ```
- **Ý nghĩa kinh tế:** Bảo vệ quyền lực cấp phát chứng chỉ số duy nhất thuộc về Nhà trường/CLB có thẩm quyền.

### 🔴 Ca 2: Chặn sinh viên cố tình chuyển nhượng huy hiệu Soulbound
- **Thao tác vi phạm:** Sinh viên `0xStudent1...` đã nhận huy hiệu #1, gọi `safeTransferFrom(0xStudent1, 0xStudent2, 1)`.
- **Kết quả mong đợi:** Giao dịch bị chặn đứng tuyệt đối tại hàm `_update`:
  ```text
  revert: NotTransferable()
  ```
- **Ý nghĩa kinh tế:** Triệt tiêu hoàn toàn nạn mua bán bằng cấp, chuyển nhượng danh hiệu học thuật trên các sàn NFT.

### 🔴 Ca 3: Chặn Issuer đã bị thu hồi quyền cố tình tiếp tục cấp hoặc thu hồi huy hiệu
- **Thao tác vi phạm:** Admin gọi `setIssuer(issuerA, false)`. Sau đó `issuerA` vẫn cố tình gọi `revokeBadge(tokenId)`.
- **Kết quả mong đợi:** Giao dịch bị chặn đứng:
  ```text
  revert: NotAuthorized()
  ```
- **Ý nghĩa kinh tế:** Đảm bảo tính toàn vẹn của hệ thống phân quyền khi có sự thay đổi nhân sự quản lý.

### 🔴 Ca 4: Chặn cấp phát với chuỗi đường dẫn Metadata rỗng
- **Thao tác vi phạm:** Issuer hợp lệ gọi `issueBadge(student1, 1, "")`.
- **Kết quả mong đợi:** Giao dịch bị chặn:
  ```text
  revert: EmptyMetadata()
  ```
- **Ý nghĩa kinh tế:** Tránh việc cấp phát huy hiệu "rác" không có nội dung chứng minh thành tích thực tế.

### 🔴 Ca 5: Chặn cấp phát huy hiệu vào địa chỉ ví rỗng `address(0)`
- **Thao tác vi phạm:** Issuer gọi `issueBadge(address(0), 1, "uri")`.
- **Kết quả mong đợi:** Giao dịch bị chặn:
  ```text
  revert: InvalidRecipient()
  ```
- **Ý nghĩa kinh tế:** Ngăn chặn việc làm mất mát token hoặc đốt vô tội vạ huy hiệu.

---

## 💻 3. MÃ NGUỒN KỊCH BẢN KIỂM THỬ TỰ ĐỘNG (`negative_tests.js`)

Mã nguồn kiểm thử tự động được lưu trữ trực tiếp trong thư mục này tại `evidence/lab-13/negative_tests.js`:

```javascript
const { expect } = require("chai");

describe("ProjectCore Negative & Security Hardening Tests", function () {
    let projectCore, owner, issuer, student1, student2, attacker;

    it("Ca 1: Chặn non-issuer gọi issueBadge -> Revert NotAuthorized", async function () {
        await expect(
            projectCore.connect(attacker).issueBadge(student1.address, 1, "uri://badge1")
        ).to.be.revertedWithCustomError(projectCore, "NotAuthorized");
    });

    it("Ca 2: Chặn sinh viên chuyển nhượng huy hiệu -> Revert NotTransferable", async function () {
        await projectCore.connect(issuer).issueBadge(student1.address, 1, "uri://badge1");
        await expect(
            projectCore.connect(student1)["safeTransferFrom(address,address,uint256)"](
                student1.address, student2.address, 0
            )
        ).to.be.revertedWithCustomError(projectCore, "NotTransferable");
    });

    it("Ca 3: Chặn Issuer đã bị gỡ quyền gọi revokeBadge -> Revert NotAuthorized", async function () {
        await projectCore.connect(owner).setIssuer(issuer.address, false);
        await expect(
            projectCore.connect(issuer).revokeBadge(0, "Gian lan")
        ).to.be.revertedWithCustomError(projectCore, "NotAuthorized");
    });

    it("Ca 4: Chặn metadata rỗng -> Revert EmptyMetadata", async function () {
        await expect(
            projectCore.connect(issuer).issueBadge(student1.address, 1, "")
        ).to.be.revertedWithCustomError(projectCore, "EmptyMetadata");
    });

    it("Ca 5: Chặn cấp vào address(0) -> Revert InvalidRecipient", async function () {
        await expect(
            projectCore.connect(issuer).issueBadge("0x0000000000000000000000000000000000000000", 1, "uri://badge1")
        ).to.be.revertedWithCustomError(projectCore, "InvalidRecipient");
    });
});
```
