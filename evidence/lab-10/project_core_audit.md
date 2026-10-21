# BÁO CÁO PHÁT HIỆN LỖ HỔNG & MINH CHỨNG VÁ LỖI TRÊN PROJECTCORE.SOL

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:** Hoàng Thu Trang (`23K4300021`) & Phan Thị Yến Nhi (`23K4300014`)  
**Tệp hợp đồng mục tiêu:** `contracts/project/ProjectCore.sol`  
**Phiên bản đã vá lỗi:** `ProjectCore.sol v0.2`  

---

## 1. Danh sách các phát hiện trên `ProjectCore.sol`

Nhóm đã đối chiếu mã nguồn `ProjectCore.sol` với `docs/SPEC.md` và `docs/ECONOMIC_RULES.md`, phát hiện 4 vấn đề quan trọng (trong đó có 3 vấn đề do nhóm sinh viên tự phát hiện):

### 📌 Phát hiện 1: Lỗ hổng quyền hạn thu hồi (Issuer Revocation Bypass)
- **Vị trí:** Hàm `revokeBadge(uint256 tokenId, string calldata reason)`
- **Mức độ:** Nghiêm trọng (High)
- **Người phát hiện:** **Sinh viên phát hiện**
- **Mô tả & Hậu quả:**  
  Trong mã nguồn do AI sinh ra ban đầu, hàm `revokeBadge` chỉ kiểm tra:
  ```solidity
  if (msg.sender != owner() && msg.sender != b.issuedBy) revert NotAuthorized();
  ```
  Nếu một đơn vị Issuer (ví dụ một CLB sinh viên) có sai phạm và đã bị Admin thu hồi tư cách (`isIssuer[clb] = false`), người đại diện CLB đó **vẫn có thể gọi `revokeBadge` để thu hồi bất kỳ huy hiệu nào mà họ từng phát hành trong quá khứ**. Điều này tạo ra lỗ hổng trả đũa / phá hoại dữ liệu thành tích sinh viên.
- **Cách sửa:** Bổ sung điều kiện kiểm tra người phát hành phải đang có trạng thái ủy quyền còn hiệu lực:
  ```solidity
  bool isCurrentOwner = (msg.sender == owner());
  bool isValidActiveIssuer = (msg.sender == b.issuedBy && isIssuer[msg.sender]);
  if (!isCurrentOwner && !isValidActiveIssuer) revert NotAuthorized();
  ```

---

### 📌 Phát hiện 2: Kẹt trạng thái cấp lại sau khi thu hồi (Permanent State Lockout)
- **Vị trí:** Hàm `revokeBadge`
- **Mức độ:** Trung bình (Medium - Lỗi logic nghiệp vụ)
- **Người phát hiện:** **Sinh viên phát hiện**
- **Mô tả & Hậu quả:**  
  Khi Admin hoặc Issuer phát hiện đã nhập nhầm địa chỉ ví của sinh viên hoặc sai mã giải thưởng, họ gọi `revokeBadge` để hủy bỏ. Tuy nhiên, mapping chống trùng lặp `hasBadgeType[student][badgeType]` không được đặt lại về `false`, và biến đếm `currentSupplyPerType` không giảm trừ.
  Hậu quả là sinh viên bị thu hồi nhầm sẽ **vĩnh viễn không bao giờ được cấp lại huy hiệu đó** vì luôn bị chặn bởi lỗi `revert BadgeAlreadyAwarded()`. Đồng thời chỉ tiêu số lượng giải thưởng của trường bị mất vĩnh viễn 1 suất.
- **Cách sửa:** Bổ sung việc reset trạng thái khi thu hồi:
  ```solidity
  address student = _ownerOf(tokenId);
  hasBadgeType[student][b.badgeType] = false;
  if (currentSupplyPerType[b.badgeType] > 0) {
      currentSupplyPerType[b.badgeType]--;
  }
  ```

---

### 📌 Phát hiện 3: Thiếu kiểm tra tham số chuỗi dữ liệu rỗng (Empty Metadata Input)
- **Vị trí:** Hàm `issueBadge`
- **Mức độ:** Thấp (Low)
- **Người phát hiện:** **Công cụ AI phát hiện**
- **Mô tả & Hậu quả:**  
  Hàm `issueBadge` không kiểm tra độ dài chuỗi `metadataURI`. Người gọi hàm có thể truyền vào chuỗi rỗng `""`, dẫn đến việc mint ra một huy hiệu hoàn toàn không có thông tin chứng thực on-chain.
- **Cách sửa:** Khai báo custom error `error EmptyMetadata();` và thêm điều kiện kiểm tra:
  ```solidity
  if (bytes(metadataURI).length == 0) revert EmptyMetadata();
  ```

---

### 📌 Phát hiện 4: Thiếu cơ chế cấp phát hàng loạt theo lô (Gas Bottleneck)
- **Vị trí:** Cấu trúc tổng thể của `ProjectCore.sol`
- **Mức độ:** Trung bình (Kiến trúc kinh tế)
- **Người phát hiện:** **Sinh viên phát hiện** *(Được cộng điểm)*
- **Mô tả & Hậu quả:**  
  Hợp đồng chỉ có hàm cấp đơn lẻ cho từng sinh viên. Trong đợt tổng kết năm học với 100 sinh viên đạt giải, cán bộ phải thực hiện 100 giao dịch riêng lẻ, vừa tốn thời gian vừa tốn chi phí gas gấp 3 lần so với xử lý theo lô.
- **Cách sửa:** Bổ sung hàm `issueBatch` có giới hạn an toàn tối đa 50 sinh viên/giao dịch:
  ```solidity
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
  ```

---

## 2. Đoạn mã hoàn chỉnh đã vá trong `contracts/project/ProjectCore.sol` (v0.2)

Dưới đây là phần code thực tế đã được cập nhật và biên dịch thành công:

```solidity
    // [VÁ LỖI 3]: Kiểm tra metadata không được rỗng
    if (bytes(metadataURI).length == 0) revert EmptyMetadata();

    // [VÁ LỖI 4]: Hàm cấp phát hàng loạt tối ưu chi phí gas
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

    // [VÁ LỖI 1 & 2]: Khắc phục triệt để lỗ hổng phân quyền và giải phóng trạng thái kẹt
    function revokeBadge(uint256 tokenId, string calldata reason) external {
        Badge storage b = badges[tokenId];
        if (b.dateAwarded == 0) revert BadgeNotFound();
        if (b.revoked) revert BadgeAlreadyRevoked();

        // [VÁ LỖI 1]: Issuer bị tước quyền sẽ KHÔNG ĐƯỢC phép thu hồi nữa
        bool isCurrentOwner = (msg.sender == owner());
        bool isValidActiveIssuer = (msg.sender == b.issuedBy && isIssuer[msg.sender]);
        if (!isCurrentOwner && !isValidActiveIssuer) {
            revert NotAuthorized();
        }

        // [VÁ LỖI 2]: Reset mapping và giảm số lượng cấp phát để cho phép cấp lại
        address student = _ownerOf(tokenId);
        hasBadgeType[student][b.badgeType] = false;
        if (currentSupplyPerType[b.badgeType] > 0) {
            currentSupplyPerType[b.badgeType]--;
        }

        b.revoked = true;
        emit BadgeRevoked(tokenId, student, msg.sender, reason);
    }
```
