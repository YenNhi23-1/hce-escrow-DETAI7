# 🏅 HCE Soulbound Achievement Badge — Đề tài 7
> **Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
> **Khoa:** Hệ thống Thông tin Kinh tế — Trường Đại học Kinh tế, Đại học Huế  
> **Kho khóa:** Khóa K58 / Năm học 2025–2026  

---

## 📌 1. Tuyên ngôn sản phẩm (One-Sentence Pitch)
> **“Nhóm xây Hệ thống Huy hiệu thành tích số (Soulbound Badge) cho Câu lạc bộ & Nhà trường để cấp phát và chứng thực thành tích sinh viên không thể mua bán, làm giả hay chuyển nhượng.”**

---

## 👥 2. Thành viên nhóm & Phân công vai trò
| STT | Họ và tên | Mã sinh viên | Vai chính Lab 8–11 | Vai chính Lab 12–15 |
| :---: | :--- | :---: | :--- | :--- |
| 1 | **Hoàng Thu Trang** | 23K4300021 | Đặc tả nghiệp vụ (BA) & Kiểm thử (QA) | Hợp đồng thông minh & Báo cáo bảo vệ (Lead) |
| 2 | **Phan Thị Yến Nhi** | 23K4300014 | Hợp đồng thông minh & Giao diện Web | Giao diện DApp & Kiểm thử an toàn (QA/Security) |

*(Ghi chú: Nhóm 2 thành viên nên mỗi bạn kiêm 2 vai trò theo quy định của môn học, đồng thời luân chuyển chéo giữa hai giai đoạn Lab 8–11 và Lab 12–15 để cả hai đều nắm vững toàn diện dự án).*

---

## 💡 3. Bài toán thực tế và Giải pháp cốt lõi
- **Thực trạng:** Giấy khen, chứng chỉ sinh viên dạng giấy hoặc PDF dễ bị làm giả bằng các công cụ đồ họa, dễ thất lạc, tốn kém chi phí in ấn và xác minh thủ công. Nếu đưa lên Blockchain bằng token ERC-20 hoặc NFT ERC-721 thông thường, người nhận có thể bán hoặc chuyển nhượng cho người khác — làm sai lệch hoàn toàn ý nghĩa ghi nhận thành tích.
- **Giải pháp:** Xây dựng hợp đồng thông minh tuân thủ cơ chế **Soulbound Token (SBT / EIP-5114)** trên nền ERC-721. 
  - Chỉ đơn vị có thẩm quyền (Admin / Issuer) mới có quyền cấp phát (mint) hoặc thu hồi (revoke) khi có sai phạm.
  - Sau khi sinh viên nhận huy hiệu, **mọi thao tác chuyển nhượng (transfer) đều bị chặn ở cấp độ hợp đồng** (`revert NotTransferable()`).
  - Nhà tuyển dụng, doanh nghiệp hoặc người quan tâm có thể tra cứu tính xác thực trực tiếp on-chain hoàn toàn miễn phí mà không cần phụ thuộc vào bên trung gian.

---

## 📂 4. Cấu trúc Codebase (Chuẩn mực ECO2432)
```text
hce-badge-k58/
├── README.md                 # Giới thiệu sản phẩm, thành viên và hướng dẫn chạy
├── AGENTS.md                 # Bộ quy tắc hướng dẫn AI hỗ trợ lập trình
├── docs/
│   ├── PROJECT_PLAN.md       # Kế hoạch chi tiết, vai trò và các mốc tiến độ
│   ├── SPEC.md               # Đặc tả kỹ thuật và yêu cầu nghiệp vụ v0.1
│   ├── ECONOMIC_RULES.md     # Cơ chế kinh tế, chống lạm dụng và quyền quản trị
│   ├── AI_JOURNAL.md         # Nhật ký prompt AI, lỗi phát hiện và cách khắc phục
│   └── PRESENTATION_PLAN.md  # Kịch bản demo và phân công thuyết trình (Lab 15/20)
├── contracts/
│   ├── training/             # Hợp đồng mẫu thực hành kỹ thuật (Lab 9, 10, 13)
│   └── project/
│       └── ProjectCore.sol   # Hợp đồng thông minh cốt lõi của sản phẩm nhóm
├── test/                     # Kịch bản kiểm thử luồng hợp lệ và ca vi phạm
├── web/
│   └── index.html            # Giao diện Web DApp tương tác qua MetaMask
└── evidence/
    └── lab-08/               # Bằng chứng hoàn thành Lab 8 (ảnh commit, biên bản)
```

---

## 🗺️ 5. Các mốc triển khai xuyên suốt học kỳ
- [x] **Lab 08:** Khởi tạo codebase nhóm, chốt chủ đề 7, lập kế hoạch, viết `SPEC.md` và `ECONOMIC_RULES.md` v0.1.
- [ ] **Lab 09:** Hiện thực hợp đồng `TimeLockVault.sol` (training) và khung sườn `ProjectCore.sol` biên dịch thành công.
- [ ] **Lab 10:** Rà soát mã nguồn (Audit), phát hiện lỗ hổng lưu trữ riêng tư, hoàn thiện bảo mật.
- [ ] **Lab 11:** Cài đặt quy tắc kinh tế vào sản phẩm: chặn chuyển nhượng Soulbound, giới hạn cấp phát và kiểm thử vi phạm.
- [ ] **Lab 12:** **Gate Review 1** — Bảo vệ codebase trước giảng viên và chốt phạm vi dự án.
- [ ] **Lab 13:** Kiểm thử tấn công (Hardening & Reentrancy / Attack vectors).
- [ ] **Lab 14:** Rà soát chéo (Audit chéo) với nhóm bạn.
- [ ] **Lab 15:** Hoàn thiện giao diện Web DApp, triển khai công khai lên GitHub Pages và chạy demo trên Sepolia Testnet.

---

## 🔗 6. Bảng ánh xạ hợp đồng & DApp (Cập nhật khi triển khai)
| Thành phần | Giá trị của nhóm | Ghi chú |
| :--- | :--- | :--- |
| **Mạng triển khai** | Ethereum Sepolia Testnet | Chain ID: 11155111 |
| **Địa chỉ hợp đồng** | *(Sẽ cập nhật ở Lab 9/11)* | Triển khai từ Remix VM -> Sepolia |
| **Chuẩn Token** | ERC-721 Soulbound (OpenZeppelin v5) | Cấm chuyển nhượng (`_update` override) |
| **Hàm đọc (Free)** | `verifyBadge(uint256)`, `hasBadge(address)` | Không tốn Gas |
| **Hàm ghi (Cần ký ví)** | `issueBadge(...)`, `revokeBadge(...)` | Chỉ Admin / Issuer thực hiện |
| **Đường dẫn DApp** | `https://[username].github.io/hce-badge-k58/` | Hoàn thiện ở Lab 15 |

---

## 🛠️ 7. Hướng dẫn chạy và kiểm thử nhanh
1. Mở thư mục dự án trong **Antigravity IDE** hoặc VS Code.
2. Kiểm tra tài liệu nghiệp vụ tại thư mục `docs/`.
3. Kiểm tra các quy tắc lập trình AI tại `AGENTS.md`.
4. Xem chi tiết kế hoạch thực hiện tại `docs/PROJECT_PLAN.md`.
