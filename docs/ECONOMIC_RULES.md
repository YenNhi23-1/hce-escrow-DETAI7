# ⚖️ ECONOMIC RULES & GOVERNANCE — HCE Soulbound Achievement Badge

**Đề tài 7:** Huy hiệu thành tích không chuyển nhượng (Soulbound Token - SBT)  
**Môn học:** ECO2432 — Tiền điện tử & Hợp đồng thông minh  

---

## 💎 1. Dòng tiền và Quyền lợi (Value Flow & Incentives)

### 1.1. Bản chất kinh tế của sản phẩm
- **Không có dòng tiền mua bán thứ cấp:** Khác với các dự án NFT thương mại hay vé sự kiện có thị trường trao đổi, Huy hiệu thành tích HCE là **Soulbound Token (SBT)**. Giá trị của sản phẩm không nằm ở đầu cơ giá cả mà nằm ở **Vốn danh tiếng số (On-chain Reputational Capital)** và **Sự tín nhiệm không thể làm giả (Tamper-proof Credibility)**.
- **Quyền lợi của các bên tham gia:**
  - **Sinh viên (Người nhận):** 
    - Nhận chứng nhận thành tích vĩnh viễn, lưu trữ trên blockchain công khai, không lo thất lạc hay hỏng hóc như bằng giấy.
    - Sở hữu hồ sơ năng lực số (On-chain Resume / CV) minh bạch, được liên kết trực tiếp vào hồ sơ xin việc, hồ sơ xin học bổng du học hoặc xét tuyển doanh nghiệp đối tác.
    - Được ưu tiên tích lũy điểm rèn luyện và xét các danh hiệu cấp cao hơn tại HCE.
  - **Nhà trường & Câu lạc bộ (Bên phát hành):**
    - Cắt giảm 100% chi phí in ấn phôi bằng khen, con dấu và công chứng xác thực.
    - Minh bạch hóa quá trình khen thưởng, ngăn ngừa tiêu cực hoặc tự ý nâng điểm, cấp bằng khống.
  - **Nhà tuyển dụng & Bên thứ ba (Bên xác thực):**
    - Kiểm tra tính xác thực của ứng viên trong vòng **3 giây** thông qua giao diện Web DApp hoặc Etherscan mà không cần gửi văn bản xác minh đến phòng đào tạo.

### 1.2. Cơ chế chi trả chi phí vận hành (Gas Fee Model)
- **Sinh viên nhận huy hiệu hoàn toàn MIỄN PHÍ:** Sinh viên không phải trả bất kỳ khoản phí gas nào khi nhận hoặc tra cứu danh hiệu của mình.
- **Đơn vị phát hành (CLB / Nhà trường) chịu phí Gas:** Phí gas khi gọi hàm phát hành (`issueBadge`) được thanh toán từ ví ngân sách hoạt động của đơn vị tổ chức. Với sự tối ưu mã nguồn (chi phí gas dưới 80.000 gas/lần cấp), chi phí trên mạng Layer 2 hoặc mạng thử nghiệm Sepolia là không đáng kể.

---

## 🛡️ 2. Giới hạn chống lạm dụng (Anti-Abuse Limits & Sybil Resistance)

Nhằm ngăn chặn các hành vi gian lận và giữ vững giá trị uy tín của huy hiệu, hệ thống áp dụng các giới hạn kỹ thuật nghiêm ngặt:

1. **Khóa chuyển nhượng tuyệt đối (Non-Transferability):**
   - Chặn toàn bộ các hàm `transferFrom`, `safeTransferFrom`, `approve` và `setApprovalForAll`.
   - Sinh viên không thể bán, tặng, cho thuê hoặc chuyển huy hiệu sang ví của người khác dưới bất kỳ hình thức nào.
2. **Quy tắc chống cấp phát trùng lặp (Anti-Duplication Rule):**
   - Hệ thống duy trì bản đồ lưu trữ `hasBadgeType[studentAddress][badgeType]`. Mỗi địa chỉ ví sinh viên chỉ được phép nhận **tối đa 01 huy hiệu** cho cùng một hạng mục thành tích trong cùng một đợt xét.
   - Ngăn chặn tình trạng phát hành nhầm hoặc sinh viên nhận nhiều lần để làm giả khối lượng thành tích.
3. **Trần số lượng phát hành (Supply Cap per Badge Type):**
   - Mỗi danh mục giải thưởng đều có số lượng trần cố định (`maxSupply`) được thiết lập tại thời điểm tạo danh mục (ví dụ: Giải Nhất chỉ có đúng 05 giải; Sinh viên 5 Tốt chỉ có tối đa 50 sinh viên).
   - Hợp đồng lập tức từ chối (`revert ExceedsMaxSupply()`) nếu số lượng cấp phát vượt quá chỉ tiêu đã phê duyệt.
4. **Bảo vệ quyền riêng tư dữ liệu (Off-chain Metadata Hashing):**
   - Tuyệt đối không ghi thông tin cá nhân định danh trực tiếp (như họ tên, CCCD, số điện thoại, điểm số nhạy cảm) dưới dạng văn bản thô lên blockchain.
   - Chỉ lưu trữ mã băm mật mã (`bytes32 docHash`) hoặc liên kết IPFS chứa dữ liệu đã được ký điện tử, đảm bảo tuân thủ các quy định bảo vệ dữ liệu cá nhân.

---

## 🏛️ 3. Quyền quản trị (Governance & Access Control)

Hệ thống phân quyền theo mô hình phân cấp minh bạch (Role-based Governance):

| Vai trò | Đối tượng đảm nhận | Quyền hạn trên Smart Contract |
| :--- | :--- | :--- |
| **Owner (Admin tối cao)** | Ban Giám hiệu / Trưởng Khoa HTTT Kinh tế | - Phê duyệt / thu hồi quyền của các Đơn vị phát hành (`addIssuer`, `removeIssuer`).<br>- Khởi tạo các danh mục huy hiệu mới.<br>- Không có quyền tự ý chuyển huy hiệu của sinh viên sang ví khác. |
| **Issuer (Đơn vị ủy quyền)** | Ban Chủ nhiệm CLB, Bí thư Đoàn trường | - Cấp phát huy hiệu (`issueBadge`) cho sinh viên thuộc phạm vi phụ trách.<br>- Thu hồi huy hiệu (`revokeBadge`) đối với các danh hiệu do chính đơn vị mình phát hành khi phát hiện vi phạm. |
| **Student (Người nắm giữ)** | Sinh viên HCE | - Xem và chứng minh quyền sở hữu huy hiệu cá nhân.<br>- Được quyền yêu cầu hủy huy hiệu (`burn`) nếu không muốn hiển thị trên hồ sơ. |
| **Verifier (Công chúng)** | Nhà tuyển dụng, Doanh nghiệp | - Tra cứu, kiểm tra tính hợp lệ và toàn vẹn của mọi huy hiệu hoàn toàn miễn phí (`verifyBadge`). |

---

## ⚠️ 4. Tình huống người dùng bị thiệt hại & Phương án xử lý (Adverse Scenarios)

1. **Tình huống sinh viên bị mất Private Key hoặc ví bị tấn công:**
   - *Hậu quả:* Sinh viên mất quyền kiểm soát ví chứa huy hiệu thành tích, không thể tự chuyển sang ví mới do tính chất Soulbound.
   - *Phương án xử lý:* Sinh viên nộp đơn xác minh danh tính ngoại tuyến (kèm CCCD và thẻ sinh viên) tại Văn phòng Khoa/Trường. Sau khi xác thực, Admin sẽ thực hiện thu hồi (`revokeBadge`) trên ví cũ kèm lý do ghi rõ trên sự kiện on-chain, sau đó phát hành lại huy hiệu mới tương đương tới địa chỉ ví an toàn mới của sinh viên.
2. **Tình huống bị thu hồi huy hiệu sai (Unfair Revocation):**
   - *Hậu quả:* Sinh viên bị tước danh hiệu do nhầm lẫn của cán bộ phát hành.
   - *Phương án xử lý:* Mọi hành động thu hồi đều bắt buộc phải phát ra sự kiện `BadgeRevoked` ghi rõ địa chỉ người thu hồi và lý do (`reason`). Cơ chế này giúp sinh viên có bằng chứng khiếu nại lên Hội đồng Quản trị/Ban Giám hiệu để khôi phục quyền lợi.

---

## 🥊 5. Phản biện mô hình kinh tế & Phản hồi của Nhóm (Economic Stress Test)

Nhóm đã sử dụng prompt chuẩn **I.6 (Phần I - Sổ tay ECO2432)** để đóng vai một nhà đầu tư/người dùng cực kỳ thận trọng nhằm tìm ra 5 lỗ hổng nghiêm trọng nhất trong thiết kế quy tắc. Dưới đây là biên bản phản biện và các biện pháp nhóm đã bổ sung:

### ⚡ Phản biện 1: "Lỗ hổng mua bán cả chiếc ví (Private Key Trading)"
- **Ý kiến phản biện:** Quy tắc cấm chuyển nhượng token (`NotTransferable`) chỉ chặn giao dịch chuyển token trên hợp đồng. Nhưng nếu người dùng rao bán luôn **khóa riêng tư (Private Key)** hoặc bán cả tài khoản ví chứa huy hiệu danh giá cho người khác thì quy tắc này trở nên vô hiệu.
- **Phản hồi & Khắc phục của nhóm:** 
  - *Giải pháp:* Huy hiệu Soulbound không đứng độc lập mà metadata chứa mã băm xác thực mã sinh viên (`studentIdHash`). 
  - Khi nhà tuyển dụng kiểm tra ứng viên ngoài đời, ứng viên phải xuất trình thẻ sinh viên hoặc ký số xác nhận trùng khớp với định danh gốc. Việc mua một chiếc ví chứa danh hiệu của người khác sẽ bị lộ ngay lập tức ở khâu phỏng vấn đối chiếu thực tế.

### ⚡ Phản biện 2: "Rủi ro Admin lạm quyền thu hồi danh hiệu tùy tiện"
- **Ý kiến phản biện:** Quy tắc cho phép Admin/Issuer toàn quyền thu hồi (`revokeBadge`) tạo ra sự tập trung quyền lực nguy hiểm. Một cán bộ mâu thuẫn cá nhân với sinh viên có thể tự ý hủy danh hiệu của sinh viên đó mà không có cơ chế ngăn cản.
- **Phản hồi & Khắc phục của nhóm:** 
  - *Giải pháp:* Đưa ràng buộc tính năng thu hồi phải ghi kèm chuỗi lý do bắt buộc `string reason` vào sự kiện `BadgeRevoked`.
  - Ở giai đoạn Gate Review 1, nhóm sẽ bổ sung cơ chế kiểm soát: chỉ Admin cấp cao (Multi-sig hoặc Ban Giám hiệu) mới có quyền thu hồi, hoặc yêu cầu chữ ký đồng thuận từ 2 cán bộ quản trị trước khi lệnh thu hồi có hiệu lực.

### ⚡ Phản biện 3: "Rủi ro chi phí Gas tăng cao khi cấp phát hàng loạt (Mass Minting Gas Spikes)"
- **Ý kiến phản biện:** Nếu nhà trường tổ chức một hội nghị và trao 500 huy hiệu cùng lúc, việc gọi 500 giao dịch riêng lẻ sẽ gây nghẽn mạng và tốn kém chi phí ngân sách rất lớn cho nhà trường.
- **Phản hồi & Khắc phục của nhóm:** 
  - *Giải pháp:* Nhóm cập nhật thiết kế bổ sung hàm cấp phát theo lô (`issueBatch(address[] students, uint256 badgeType)`).
  - Phân lô tối đa 50 sinh viên/giao dịch để không vượt trần block gas limit, đồng thời khuyến nghị lộ trình triển khai trên các mạng Layer 2 (như Arbitrum / Base) với chi phí chỉ bằng 1/100 so với Ethereum Mainnet.

### ⚡ Phản biện 4: "Rủi ro cấp nhầm địa chỉ ví không thể sửa chữa"
- **Ý kiến phản biện:** Nếu cán bộ nhập sai một ký tự trong địa chỉ ví của sinh viên (gửi nhầm vào ví chết hoặc ví của người lạ), do token không thể chuyển nhượng nên số huy hiệu đó sẽ bị kẹt vĩnh viễn, làm mất chỉ tiêu và làm thiệt thòi cho sinh viên thực tế.
- **Phản hồi & Khắc phục của nhóm:** 
  - *Giải pháp:* Nhờ có hàm `revokeBadge`, nếu phát hiện gửi sai địa chỉ, Issuer có thể thu hồi ngay lập tức mã token đó (`burn`) để hoàn lại chỉ tiêu, sau đó thực hiện cấp lại cho đúng địa chỉ ví của sinh viên.

### ⚡ Phản biện 5: "Rủi ro rò rỉ dữ liệu cá nhân nhạy cảm vĩnh viễn trên On-chain"
- **Ý kiến phản biện:** Nếu Issuer vô tình đưa tên thật, điểm trung bình tích lũy, số CMND/CCCD vào `tokenURI` hoặc trường metadata công khai, do tính chất bất biến của blockchain, dữ liệu cá nhân này sẽ bị lưu lại vĩnh viễn, vi phạm Luật Bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP).
- **Phản hồi & Khắc phục của nhóm:** 
  - *Quy tắc bổ sung:* Cấm tuyệt đối lưu trữ văn bản rõ (plain text) thông tin cá nhân. Chỉ lưu mã băm Keccak-256 đối chiếu: `hash(CCCD + MSSV + Salt bí mật)`. Người ngoài nhìn vào chỉ thấy chuỗi băm vô nghĩa; chỉ khi sinh viên tự tay cung cấp tài liệu gốc thì bên thứ ba mới có thể băm lại và đối chiếu trùng khớp.
