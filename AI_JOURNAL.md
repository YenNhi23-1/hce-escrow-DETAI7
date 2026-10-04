# 📓 NHẬT KÝ LÀM VIỆC VỚI AI — LAB 8

**Dự án:** HCE Soulbound Achievement Badge (Đề tài 7)  
**Nhóm:** Nhóm 07 — Lớp ECO2432  
**Giai đoạn:** Lab 8 — Khởi tạo Codebase nhóm, Kế hoạch dự án, Đặc tả v0.1 và Quy tắc kinh tế  

---

## 📌 Lần 1 — Khởi tạo ý tưởng hợp đồng và chuẩn kỹ thuật
- **Prompt:**
  > "Tôi muốn làm một hệ thống cấp chứng nhận danh hiệu sinh viên cho nhà trường trên blockchain. Hãy viết cho tôi một hợp đồng token ERC-721 bằng Solidity để nhà trường mint cho sinh viên và sinh viên có thể chuyển nhượng hoặc giao dịch trên OpenSea."
- **AI trả về:**
  > AI cung cấp đoạn mã nguồn hợp đồng ERC-721 cơ bản thừa kế từ OpenZeppelin, cho phép hàm `mint(address to, uint256 tokenId)` và giữ nguyên các hàm `transferFrom`, `safeTransferFrom`, `approve` mặc định để người nhận có thể tự do giao dịch.
- **Đánh giá:** ❌ **Sai, bỏ** (Sai hoàn toàn bản chất nghiệp vụ đề tài)
- **Chỗ sai:**
  - AI đã nhầm lẫn giữa dự án NFT thương mại/sưu tầm với **Huy hiệu thành tích sinh viên**.
  - Nếu sinh viên có thể chuyển nhượng hay bán huy hiệu trên sàn OpenSea thì sẽ xảy ra hiện tượng "mua bán bằng cấp, gian lận thành tích", làm mất hoàn toàn giá trị của đề tài 7 (Huy hiệu không chuyển nhượng - Soulbound Token).
- **Cách sửa:**
  - Nhóm sinh viên đã yêu cầu AI hủy bỏ ý tưởng giao dịch tự do. Thay vào đó, áp dụng cơ chế **Soulbound Token (SBT / EIP-5114)**: ghi đè (override) hàm chuyển nhượng để chặn đứng mọi giao dịch mua bán giữa các ví sinh viên.
- **Ai phát hiện:** **Sinh viên phát hiện** *(Sinh viên đối chiếu với yêu cầu đề tài 7 trong Sổ tay ECO2432)*.

---

## 📌 Lần 2 — Kiểm tra phiên bản OpenZeppelin và cơ chế chặn chuyển nhượng
- **Prompt:**
  > "Viết cho tôi hàm chặn chuyển nhượng trong OpenZeppelin ERC-721 để biến token thành Soulbound Token."
- **AI trả về:**
  > AI sinh mã sử dụng hook `_beforeTokenTransfer`:
  > ```solidity
  > function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
  >     require(from == address(0) || to == address(0), "Token is soulbound");
  >     super._beforeTokenTransfer(from, to, tokenId, batchSize);
  > }
  > ```
- **Đánh giá:** ⚠️ **Phải sửa** (Lỗi phiên bản thư viện nghiêm trọng)
- **Chỗ sai:**
  - Dự án quy định trong `AGENTS.md` bắt buộc sử dụng **OpenZeppelin Contracts phiên bản 5.x**.
  - Trong OpenZeppelin phiên bản 5.x, hàm `_beforeTokenTransfer` đã bị **xóa bỏ hoàn toàn**, nếu sử dụng sẽ gây lỗi biên dịch (`TypeError: Function not found or not visible after argument-dependent lookup`).
- **Cách sửa:**
  - Sinh viên chỉ ra quy ước dự án và yêu cầu AI chuyển sang sử dụng hàm `_update(address to, uint256 tokenId, address auth)` của OpenZeppelin v5:
  > ```solidity
  > function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
  >     address from = _ownerOf(tokenId);
  >     bool isTransfer = from != address(0) && to != address(0);
  >     if (isTransfer) revert NotTransferable();
  >     return super._update(to, tokenId, auth);
  > }
  > ```
- **Ai phát hiện:** **Sinh viên phát hiện** *(Sinh viên kiểm tra tài liệu OpenZeppelin v5 và mục B.4 trong Sổ tay ECO2432)*.

---

## 📌 Lần 3 — Phản biện mô hình kinh tế và quyền riêng tư (Stress Testing)
- **Prompt:** (Sử dụng đúng prompt mẫu chuẩn I.6 trong Sổ tay)
  > "Bạn là nhà đầu tư thận trọng đang xem xét dự án này. Dưới đây là mô tả quy tắc kinh tế của dự án HCE Soulbound Achievement Badge. Hãy nêu 5 điểm yếu nghiêm trọng nhất, xếp theo mức rủi ro giảm dần. Với mỗi điểm, nêu một tình huống cụ thể mà người dùng bị thiệt hại. Không cần đề xuất giải pháp, tôi muốn nghe phần phê bình. [dán nội dung dự thảo ECONOMIC_RULES.md]"
- **AI trả về:**
  > AI chỉ ra 5 nguy cơ thực tế:
  > 1. Bán cả chiếc ví (Private Key Trading).
  > 2. Admin lạm quyền thu hồi danh hiệu bất chính.
  > 3. Tắc nghẽn mạng và chi phí gas cao khi trao giải hàng loạt.
  > 4. Cấp nhầm vào địa chỉ ví không tồn tại dẫn đến mất chỉ tiêu vĩnh viễn.
  > 5. Nguy cơ vi phạm bảo mật dữ liệu cá nhân nếu ghi tên, CCCD trực tiếp on-chain.
- **Đánh giá:** ✅ **Dùng được**
- **Cách áp dụng:**
  - Nhóm sinh viên đã tiếp thu toàn bộ 5 phản biện này và viết trực tiếp phần phản hồi, các giải pháp kỹ thuật cụ thể (hashing danh tính, cơ chế cấp theo lô `issueBatch`, cơ chế thu hồi minh bạch có lý do `revokeBadge`) vào mục 5 của tệp `docs/ECONOMIC_RULES.md`.
- **Ai phát hiện:** **AI đề xuất phản biện, Sinh viên phân tích và ra quyết định xử lý**.
