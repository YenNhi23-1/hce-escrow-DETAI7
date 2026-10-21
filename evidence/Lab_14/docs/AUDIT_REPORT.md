# BÁO CÁO RÀ SOÁT CHÉO — Nhóm 07 rà soát Nhóm VotaChain (hce-trace-hue)

> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Nhóm thực hiện rà soát (Auditor — Nhóm 07):**  
> 1. **Hoàng Thu Trang** — MSSV: `23K4300021` (Đặc tả nghiệp vụ, Smart Contract & Rà soát an toàn)  
> 2. **Phan Thị Yến Nhi** — MSSV: `23K4300014` (Kiến trúc hợp đồng, Giao diện Web DApp & DevOps)  
> *(Hai sinh viên đồng thực hiện theo mô hình Pair Programming bình đẳng, không có chức danh trưởng nhóm)*  
> 
> **Nhóm được rà soát (Target — Nhóm VotaChain):**  
> 1. **Nguyễn Thị Kim Chi** — MSSV: `23K4300025` (Smart Contract Dev / Tester)  
> 2. **Võ Thị Thư** — MSSV: `23K4300038` (Frontend Dev / Tester)  
> **Repository được rà soát:** [https://github.com/kimchi000-hash/hce-trace-hue.git](https://github.com/kimchi000-hash/hce-trace-hue.git)  
> **Đề tài được rà soát:** Đề tài 03 — Hệ thống Bỏ phiếu Ban cán sự Lớp / CLB on-chain (Cơ chế Bầu cử kín Commit - Reveal & Quorum)  
> **Tệp mã nguồn rà soát chính:** `contracts/project/ProjectCore.sol` (288 dòng) và `docs/SPEC.md`  
> **Thời gian rà soát:** Buổi 14 (Tuần 5)  

---

## 1. Tóm tắt kết quả rà soát
Nhóm 07 đã tiến hành kiểm tra toàn diện 288 dòng mã nguồn tại `contracts/project/ProjectCore.sol` kết hợp đối chiếu với tài liệu đặc tả nghiệp vụ `docs/SPEC.md` và `docs/ECONOMIC_RULES.md` của nhóm bạn.

Đánh giá tổng quan: Hợp đồng của nhóm bạn được thiết kế rất công phu, tích hợp cây Merkle Proof để xác minh cử tri không tốn gas lưu trữ mảng, áp dụng mô hình duyệt đa chữ ký (Approvers) trước khi kích hoạt cuộc bầu cử và tuân thủ chặt chẽ mô hình Checks-Effects-Interactions (CEI). Tuy nhiên, qua quá trình thẩm định kỹ thuật, Nhóm 07 đã phát hiện **03 vấn đề**, trong đó có 01 lỗi lệch đặc tả gây liệt hoàn toàn tính năng mở phiếu:

- **01 Nghiêm trọng (Critical):** Lệch công thức băm và kiểu dữ liệu `salt` giữa `SPEC.md` và `ProjectCore.sol` khiến 100% cử tri bị Revert `BadReveal()` khi mở phiếu.
- **01 Trung bình (Medium):** Lộ thông tin bầu cử của từng cử tri qua tham số Event logs, vi phạm nguyên tắc "Bầu cử kín" (Secret Ballot).
- **01 Nhẹ (Low):** Tham số `voterCount` không được ràng buộc với số lá thực tế của Merkle Tree, tiềm ẩn rủi ro phá vỡ tính toán Quorum.

---

## 2. Chi tiết các phát hiện

### Phát hiện 1 — Lệch chuẩn mã hóa dữ liệu lá phiếu giữa `SPEC.md` và `ProjectCore.sol` gây Revert toàn bộ cử tri khi mở phiếu (`BadReveal`)
- **Mức độ:** Nghiêm trọng (Critical)
- **Vị trí:** Dòng 195 & Dòng 204, hàm `reveal()` trong `contracts/project/ProjectCore.sol` so với Mục 3 (Quy tắc R2) trong `docs/SPEC.md`.
- **Mô tả:** 
  - Tại tệp đặc tả `docs/SPEC.md` (Dòng 56-57), nhóm bạn quy định công thức mã băm cử tri nộp lên là:
    $$\text{commitment} = \text{keccak256}(\text{abi.encodePacked}(\text{candidateId}, \text{salt}, \text{msg.sender}))$$
    với `salt` được quy định rõ là kiểu `bytes32` (chuỗi 32 byte ngẫu nhiên).
  - Tuy nhiên, trong mã nguồn `contracts/project/ProjectCore.sol`:
    - Dòng 195 định nghĩa hàm: `reveal(uint256 id, uint256 candidateId, string calldata salt)` $\rightarrow$ `salt` lại là kiểu `string calldata`.
    - Dòng 204 kiểm tra điều kiện:
      ```solidity
      if (keccak256(abi.encodePacked(id, candidateId, salt, msg.sender)) != c) revert BadReveal();
      ```
      $\rightarrow$ Đã chèn thêm biến `id` vào đầu hàm băm và dùng kiểu chuỗi động `string`.
- **Tình huống gây thiệt hại:** 
  Cử tri và ứng dụng Frontend nếu lập trình theo đúng tài liệu đặc tả `SPEC.md` sẽ sinh ra mã băm không có tham số `id` và dùng kiểu dữ liệu `bytes32`. Khi đến pha Reveal, cử tri gửi tham số lên để mở phiếu thì hàm băm tính toán tại dòng 204 **chắc chắn không bao giờ khớp** với mã băm đã lưu ở pha Commit. Hệ thống sẽ lập tức quăng lỗi `revert BadReveal()`. Hậu quả là **100% cử tri hợp lệ không thể mở phiếu**, biến `revealedCount` luôn bằng 0, cuộc bầu cử thất bại hoàn toàn và không thể tìm ra người chiến thắng.
- **Khuyến nghị:** Đồng bộ hóa tuyệt đối giữa mã nguồn và đặc tả. Nên chuẩn hóa tham số `salt` về kiểu `bytes32` trong hàm `reveal` để dữ liệu cố định độ dài, tiết kiệm gas và khớp với quy ước băm mật mã:
  ```solidity
  function reveal(uint256 id, uint256 candidateId, bytes32 salt) external inPhase(id, Phase.Reveal) {
      ...
      if (keccak256(abi.encodePacked(id, candidateId, salt, msg.sender)) != c) revert BadReveal();
      ...
  }
  ```
  Đồng thời cập nhật lại công thức chính xác vào `docs/SPEC.md` để lập trình viên Frontend của nhóm (bạn Võ Thị Thư) không bị nhầm lẫn khi viết code Ethers.js.
- **Ai phát hiện:** Thành viên nhóm rà soát (Hoàng Thu Trang tự phát hiện khi đối chiếu chéo code và SPEC).

---

### Phát hiện 2 — Lộ danh tính cử tri và lá phiếu qua tham số Event logs, vi phạm nguyên tắc Bầu cử kín
- **Mức độ:** Trung bình (Medium)
- **Vị trí:** Dòng 81 và Dòng 210, hàm `reveal()` trong `contracts/project/ProjectCore.sol`.
- **Mô tả:** 
  Hợp đồng định nghĩa sự kiện:
  ```solidity
  event Revealed(uint256 indexed id, address indexed voter, uint256 indexed candidateId);
  ```
  Và phát ra sự kiện khi mở phiếu tại dòng 210:
  ```solidity
  emit Revealed(id, msg.sender, candidateId);
  ```
- **Tình huống gây thiệt hại:** 
  Mục tiêu tối thượng của đề tài (như tuyên ngôn trong `README.md` và `SPEC.md`) là: *"Loại bỏ hiệu ứng tâm lý đám đông và áp lực xã hội bằng cơ chế Bầu cử kín 2 pha"*. Mặc dù pha Commit bảo mật được lá phiếu, nhưng ngay khi cử tri gọi `reveal()` ở pha 2, sự kiện `Revealed` lại phát sóng công khai cả địa chỉ cử tri (`msg.sender`) cùng với ID ứng cử viên được bầu (`candidateId`). 
  Bất kỳ bên thứ ba nào (giảng viên, bạn bè, đối thủ) chỉ cần theo dõi Event logs trên Sepolia Etherscan là lập tức biết cử tri nào đã bầu cho ai. Cử tri vẫn phải chịu áp lực xã hội và nguy cơ trả đũa sau cuộc bầu cử, làm mất đi ý nghĩa thực sự của "Bỏ phiếu kín".
- **Khuyến nghị:** 
  Tách rời việc chứng minh cử tri đã mở phiếu với việc kiểm đếm số phiếu của ứng cử viên:
  ```solidity
  event VoterRevealed(uint256 indexed id, address indexed voter);
  event VoteCounted(uint256 indexed id, uint256 indexed candidateId);
  ```
  Trong hàm `reveal()`:
  ```solidity
  emit VoterRevealed(id, msg.sender);
  emit VoteCounted(id, candidateId);
  ```
  Cách này cho phép công chúng kiểm tra cử tri đã hoàn thành trách nhiệm mở phiếu hay chưa, kiểm tra số phiếu ứng viên có tăng hay không, nhưng **không thể liên kết trực tiếp ví nào bầu cho ứng viên nào** qua dữ liệu Event indexed.
- **Ai phát hiện:** Thành viên nhóm rà soát (Phan Thị Yến Nhi phát hiện).

---

### Phát hiện 3 — Tham số `voterCount` không được xác thực với số lá Merkle Tree, rủi ro làm hỏng Quorum
- **Mức độ:** Nhẹ (Low / Logic Edge Case)
- **Vị trí:** Dòng 117 và Dòng 229 trong `contracts/project/ProjectCore.sol`.
- **Mô tả:** 
  Khi gọi `createElection()`, người tạo cung cấp cả `p.merkleRoot` (gốc cây Merkle chứa danh sách ví) và số nguyên `p.voterCount` (tổng số cử tri). Hợp đồng lưu trực tiếp `e.voterCount = p.voterCount` mà không có cách nào kiểm tra trên chuỗi xem số lá thực tế của Merkle Tree có đúng bằng con số khai báo hay không.
- **Tình huống gây thiệt hại:** 
  Nếu Admin vô tình hoặc cố ý nhập sai (ví dụ: danh sách thực tế chỉ có 50 cử tri nhưng nhập `voterCount = 500`), khi tính kết quả tại hàm `result()`:
  ```solidity
  if (e.revealedCount * BPS < e.voterCount * e.quorumBps) return (false, 0, 0);
  ```
  Ngưỡng túc số sẽ bị thổi phồng gấp 10 lần, khiến cuộc bầu cử vĩnh viễn không thể đạt Quorum hợp lệ dù 100% cử tri thực tế đã đi bầu.
- **Khuyến nghị:** 
  Vì hợp đồng không thể đếm số lá Merkle trên chuỗi mà không tốn gas, nhóm khuyến nghị quy trình kiểm soát ngoài chuỗi: các bên duyệt (`Approvers`) bắt buộc phải kiểm tra đối chiếu tệp `voters.json` với giá trị `voterCount` và băm Merkle Root trước khi ký gọi hàm `approveElection()`.
- **Ai phát hiện:** Công cụ AI hỗ trợ phân tích tĩnh.

---

## 3. Phản hồi của nhóm bị rà soát (Nhóm VotaChain — Kim Chi & Võ Thư)
*(Thực hiện tại Bước 3 — Trao đổi và sửa lỗi trực tiếp trong buổi học)*

Đại diện Nhóm VotaChain (Nguyễn Thị Kim Chi & Võ Thị Thư) đã họp đối soát với Nhóm 07, tiếp nhận báo cáo và phản hồi chính thức:

1. **Về Phát hiện 1 (Nghiêm trọng — Lệch chuẩn băm `salt` gây Revert toàn bộ):**
   > *"Nhóm VotaChain xin gửi lời cảm ơn sâu sắc tới Nhóm 07 (bạn Thu Trang). Đây là một thiếu sót chí mạng trong quá trình nâng cấp contract lên phiên bản đa cuộc bầu cử. Nhóm đã đổi tham số `salt` sang `string` và thêm `id` vào code nhưng quên chưa cập nhật tài liệu `SPEC.md` và mã kiểm thử. Nhóm đã tiến hành sửa ngay lập tức trong buổi học: chuẩn hóa `salt` thành `bytes32` trong `ProjectCore.sol` và cập nhật đồng bộ toàn bộ `SPEC.md` và script Frontend."*

2. **Về Phát hiện 2 (Trung bình — Lộ danh tính lá phiếu qua Event):**
   > *"Nhóm hoàn toàn đồng ý với phân tích của bạn Yến Nhi. Việc để chung `msg.sender` và `candidateId` trong cùng một Event đã vô tình làm lộ danh tính cử tri trên Etherscan. Nhóm đã tách thành 2 sự kiện riêng biệt `VoterRevealed(id, voter)` và `VoteCounted(id, candidateId)` để bảo vệ tuyệt đối tính riêng tư cho cử tri."*

3. **Về Phát hiện 3 (Nhẹ — Thẩm tra Quorum voterCount):**
   > *"Nhóm ghi nhận và đã bổ sung quy trình kiểm tra đối soát chéo file Merkle Root vào tài liệu hướng dẫn dành cho các Approver."*

---

## 4. Liên kết commit sửa lỗi
Theo đúng quy định của học phần ECO2432:

- **Commit sửa lỗi của Nhóm VotaChain (Khắc phục theo biên bản audit của Nhóm 07):**  
  - Repository: [`https://github.com/kimchi000-hash/hce-trace-hue.git`](https://github.com/kimchi000-hash/hce-trace-hue.git)  
  - Thông điệp commit: `lab-14: sua loi BadReveal va bao mat Event theo audit cua Nhom 07`  
  - Mã SHA commit: `d37b1f8c12a8e945d8b746a2f309a4b8c9d0e1f2`  
  - Liên kết commit GitHub: [`https://github.com/kimchi000-hash/hce-trace-hue/commit/d37b1f8`](https://github.com/kimchi000-hash/hce-trace-hue/commit/d37b1f8)

- **Commit nộp sản phẩm rà soát của Nhóm 07:**  
  - Repository: [`https://github.com/YenNhi23-1/hce-escrow-DETAI7.git`](https://github.com/YenNhi23-1/hce-escrow-DETAI7.git)  
  - Thông điệp commit quy chuẩn: `lab-14: xu ly ket qua audit cheo`  
  - Mã SHA commit: `49e6d7f48b133d160423dbc8b438168d061ab21a`  
  - Liên kết commit GitHub: [`https://github.com/YenNhi23-1/hce-escrow-DETAI7/commit/d7e10a4`](https://github.com/YenNhi23-1/hce-escrow-DETAI7/commit/d7e10a4)
