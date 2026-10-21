# NHẬT KÝ LÀM VIỆC VỚI TRỢ LÝ AI (AI_JOURNAL.MD) — TOÀN BỘ DỰ ÁN TỪ LAB 8 ĐẾN LAB 15

**Môn học:** Tiền điện tử & Hợp đồng thông minh (ECO2432) — Học kỳ II, Năm học 2025–2026  
**Khoa:** Hệ thống thông tin kinh tế — Trường Đại học Kinh tế, Đại học Huế  
**Nhóm sinh viên đồng thực hiện:**  
1. **Hoàng Thu Trang** — MSSV: `23K4300021`  
2. **Phan Thị Yến Nhi** — MSSV: `23K4300014`  
*(Cả hai sinh viên làm việc cùng nhau theo mô hình Pair Programming / Co-working, bình đẳng, không có trưởng nhóm)*  
**Đề tài 07:** Huy hiệu thành tích không chuyển nhượng (Non-transferable Achievement Badge / Soulbound Token - SBT)  

---

## 📌 MỤC TIÊU CỦA NHẬT KÝ AI
Ghi chép trung thực toàn bộ quá trình sử dụng Trợ lý AI (Antigravity / Gemini / ChatGPT) trong quá trình phát triển dự án. Thể hiện năng lực:
1. Soạn thảo **Prompt** kỹ thuật chính xác, có ngữ cảnh và ràng buộc.
2. Phân tích, đánh giá phản hồi của AI và chỉ ra các **Ảo giác (AI Hallucination)** hoặc sai sót.
3. Năng lực phản biện và làm chủ mã nguồn của hai sinh viên, bảo vệ an toàn và tính toàn vẹn kinh tế của hệ thống Web3.

---

## 📅 PHẦN 1: LAB 10 — RÀ SOÁT MÃ NGUỒN VÀ KHẮC PHỤC LỖ HỔNG (AUDIT)

### 1.1. Rà soát hợp đồng mẫu VaultBuggy.sol
- **Prompt gửi cho AI:**
  ```text
  Bạn là kiểm toán viên bảo mật smart contract.
  Rà soát hợp đồng VaultBuggy.sol và liệt kê các lỗ hổng theo mức độ nghiêm trọng (Critical, High, Medium, Low).
  Nêu rõ số dòng, cách khai thác và cách khắc phục. Chỉ dựa trên mã nguồn được cung cấp.
  ```
- **Kết quả AI & Sinh viên phản biện:**
  - *AI phát hiện đúng:* Lỗi Reentrancy ở hàm `withdraw` và lỗi `tx.origin` ở hàm `changeOwner`.
  - *Ảo giác / Sai sót nghiêm trọng của AI:* AI khẳng định biến `private uint256 emergencyPin` là an toàn vì "từ khóa private chặn hợp đồng ngoài truy cập".
  - *Sinh viên phản biện:* Hai bạn Trang và Nhi đã chỉ ra rằng trên blockchain mọi storage slot đều đọc được công khai qua RPC `eth_getStorageAt(address, slot)`. Biến private chỉ có ý nghĩa ở mức biên dịch ngôn ngữ, không bảo vệ bí mật dữ liệu!

### 1.2. Rà soát và vá lỗi trên ProjectCore.sol v0.1
- **Prompt gửi cho AI:**
  ```text
  Đối chiếu SPEC.md và mã nguồn ProjectCore.sol v0.1. Tìm kiếm các lỗi logic nghiệp vụ và phân quyền quản trị.
  Kiểm tra: phân quyền thu hồi, cấp lại khi thu hồi nhầm, kiểm tra chuỗi rỗng và chi phí gas.
  ```
- **Bảng tổng kết AI vs Sinh viên phát hiện:**
  - *AI phát hiện:* Tham số `metadataURI` bị rỗng không được kiểm tra -> Sinh viên bổ sung `revert EmptyMetadata()`.
  - *Sinh viên tự phát hiện (AI bỏ sót):*
    1. Khi Issuer bị Admin tước quyền (`isIssuer = false`), hàm `revokeBadge` vẫn cho phép thu hồi do chỉ kiểm tra `msg.sender == b.issuedBy`. Sinh viên đã bổ sung điều kiện `isIssuer[msg.sender]`.
    2. Khi thu hồi, mapping `hasBadgeType` không được reset, khiến sinh viên bị kẹt vĩnh viễn quyền nhận lại huy hiệu sau khi đính chính. Sinh viên đã sửa lệnh reset mapping và giảm `currentSupplyPerType`.
    3. AI không đề xuất hàm cấp phát theo lô -> Sinh viên tự bổ sung `issueBatch` giới hạn 50 sinh viên/giao dịch để tối ưu gas.

---

## 📅 PHẦN 2: LAB 11 — QUY TẮC KINH TẾ VÀ ĐIỂM CHẶN KỸ THUẬT

- **Prompt gửi cho AI:**
  ```text
  Tôi muốn biến một hợp đồng ERC-721 chuẩn OpenZeppelin v5.x thành Soulbound Token (không thể chuyển nhượng giữa các ví).
  Hãy chỉ định hàm nào cần override và cách chặn giao dịch hiệu quả, tiết kiệm gas nhất.
  ```
- **Phản hồi của AI & Hiệu chỉnh của Sinh viên:**
  - *AI đề xuất:* Ban đầu AI hướng dẫn override hàm `_beforeTokenTransfer(address from, address to, uint256 tokenId)` theo chuẩn OpenZeppelin **v4.x**.
  - *Sinh viên phát hiện:* Trong OpenZeppelin **v5.x**, hàm hook `_beforeTokenTransfer` đã bị xóa bỏ hoàn toàn và thay thế bằng `_update(address to, uint256 tokenId, address auth)`. Sinh viên đã tự viết lại hàm `_update` để bắt đúng điều kiện:
    ```solidity
    if (from != address(0) && to != address(0)) {
        revert NotTransferable();
    }
    ```
  - Thay vì dùng `require(..., "Not transferable")` tốn gas, sinh viên sử dụng Custom Error `error NotTransferable()` giúp tiết kiệm ~300 gas mỗi lần kiểm tra.

---

## 📅 PHẦN 3: LAB 12 — GATE REVIEW 1 VÀ PHẠM VI DỰ ÁN

- **Prompt gửi cho AI:**
  ```text
  Hãy lập kịch bản thuyết trình Gate Review 1 trong 3 phút cho 2 người (Hoàng Thu Trang và Phan Thị Yến Nhi).
  Phân bổ thời gian chính xác theo giây, không ai nói quá nhiều, có chỉ rõ tài liệu mở trên máy tính.
  ```
- **Đánh giá của sinh viên:**
  - AI phân chia thời gian khá tốt nhưng ban đầu đưa quá nhiều thuật ngữ lý thuyết chung chung.
  - Hai sinh viên đã tinh chỉnh kịch bản: Gắn chặt vào các file thực tế trong repo (`SPEC.md`, `ECONOMIC_RULES.md`, `contracts/project/ProjectCore.sol`) và quy định cụ thể từng người mở file nào trên màn hình máy chiếu.

---

## 📅 PHẦN 4: LAB 13 — KIỂM THỬ TẤN CÔNG BẢO MẬT VÀ PHÒNG THỦ (NEGATIVE TEST)

- **Prompt gửi cho AI:**
  ```text
  Viết hợp đồng VulnerableBank mô phỏng tấn công The DAO và hợp đồng tấn công Attacker.sol bằng hàm fallback/receive.
  Sau đó viết SafeBank sử dụng Checks-Effects-Interactions và ReentrancyGuard để phòng thủ.
  ```
- **Sinh viên kiểm tra và bổ sung:**
  - Sinh viên phát hiện AI ban đầu dùng `msg.sender.transfer(amount)` trong `VulnerableBank`, điều này vô tình kích hoạt giới hạn 2300 gas khiến cuộc tấn công Reentrancy không thành công như kịch bản The DAO thực tế.
  - Sinh viên đã sửa lại thành `(bool sent, ) = msg.sender.call{value: amount}("")` để mô phỏng chính xác lỗ hổng cạn kiệt số dư quỹ, đồng thời viết bộ test negative kiểm tra 5 điều kiện an toàn khắt khe.

---

## 📅 PHẦN 5: LAB 14 — KẾT QUẢ VÀ XỬ LÝ AUDIT CHÉO

- **Prompt gửi cho AI:**
  ```text
  Đóng vai trò nhóm kiểm toán bảo mật độc lập, rà soát hợp đồng bán vé sự kiện EventTicket.sol của Nhóm 06.
  Kiểm tra: điều kiện hoàn tiền, chống mua chợ đen, Reentrancy và giới hạn số vé mỗi ví.
  ```
- **Sinh viên rà soát báo cáo:**
  - AI chỉ ra 3 lỗi: Reentrancy ở hàm hoàn tiền vé `refundTicket`, thiếu kiểm tra số dư hợp đồng, và thiếu giới hạn vé mua tối đa mỗi người.
  - Sinh viên tự kiểm tra thêm: Phát hiện lỗi thời hạn sự kiện (`block.timestamp > eventDate`) không được kiểm tra ở hàm hủy vé, có thể dẫn đến việc sự kiện đã diễn ra xong người mua vẫn đòi hoàn tiền.

---

## 📅 PHẦN 6: LAB 15 — PHÁT TRIỂN GIAO DIỆN WEB DAPP VÀ KẾT NỐI ETHERS.JS V6

- **Prompt gửi cho AI:**
  ```text
  Viết code frontend HTML + CSS + Vanilla JS kết nối hợp đồng ProjectCore.sol qua thư viện Ethers.js v6.
  Yêu cầu: Giao diện hiện đại (glassmorphism, dark mode), có tab tra cứu miễn phí gas, cấp phát, thu hồi và nút thử nghiệm phủ định (Negative Test).
  Khi giao dịch bị revert do quy tắc NotTransferable(), giao diện phải bắt lỗi và hiển thị thông báo thân thiện.
  ```
- **Kinh nghiệm và Xử lý của Sinh viên:**
  - *Khác biệt cú pháp Ethers v6:* AI thỉnh thoảng nhầm lẫn giữa Ethers v5 (`ethers.providers.Web3Provider`) và Ethers v6 (`ethers.BrowserProvider`). Hai bạn Trang và Nhi đã đồng nhất toàn bộ mã nguồn theo chuẩn Ethers **v6.7.0**.
  - *Xử lý Custom Errors:* Trong Ethers v6, khi Smart Contract ném custom error `NotTransferable()`, chuỗi lỗi trả về trong `err.data` hoặc `err.message`. Sinh viên đã xây dựng bộ lọc Regex và bắt sự kiện để hiển thị hộp thoại thông báo màu xanh lá khẳng định quy tắc kinh tế của hệ thống được bảo vệ vững chắc.

---

## 💡 BÀI HỌC KINH NGHIỆM CỐT LÕI (AI TAKEAWAYS)

1. **AI là trợ thủ tăng tốc độ, không phải là người ra quyết định kỹ thuật:** AI có thể tạo nhanh boilerplate và gợi ý giải thuật, nhưng hoàn toàn mù tịt về logic kinh tế thực tế của môn học nếu sinh viên không nắm vững nghiệp vụ.
2. **Luôn thực nghiệm trên máy thật (Test on-chain):** Không tin vào bất kỳ khẳng định nào của AI nếu chưa chạy qua compiler Solidity, hardhat test và kiểm thử giao dịch trên Sepolia Testnet.
3. **Phối hợp nhóm bình đẳng giúp nhân đôi độ an toàn:** Việc cả hai bạn Trang và Nhi cùng đọc code, phản biện chéo và cùng xem xét câu trả lời của AI đã giúp loại bỏ 100% các ảo giác nguy hiểm trong suốt 15 bài lab.
