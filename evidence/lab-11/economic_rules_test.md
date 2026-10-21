# BẰNG CHỨNG KIỂM THỬ QUY TẮC KINH TẾ (LAB 11)

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:** Hoàng Thu Trang (`23K4300021`) & Phan Thị Yến Nhi (`23K4300014`)  
**Tệp kiểm thử:** `contracts/project/ProjectCore.sol`  

---

## 1. Nhật ký thực thi các ca kiểm thử trên Remix VM

```text
[TEST 1 - POSITIVE]: Cấp phát huy hiệu lần đầu
CALL: ProjectCore.issueBadge("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 1, "ipfs://Qm...")
RESULT: status true, gas used: 82410
EVENT: BadgeIssued(tokenId: 1, student: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, badgeType: 1)
ASSERT: balanceOf(0xAb84...) == 1 (PASSED)

[TEST 2 - NEGATIVE]: Cố tình chuyển nhượng Soulbound
CALL: ProjectCore.safeTransferFrom("0xAb84...", "0x4B20...", 1)
RESULT: REVERTED with custom error: NotTransferable()
ASSERT: ownerOf(1) == 0xAb84... (PASSED - Không bị đổi chủ sở hữu)

[TEST 3 - NEGATIVE]: Cố tình cấp trùng danh hiệu
CALL: ProjectCore.issueBadge("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 1, "ipfs://Qm...")
RESULT: REVERTED with custom error: BadgeAlreadyAwarded()
ASSERT: nextTokenId == 2 (PASSED - Không sinh mã mới)

[TEST 4 - POSITIVE & NEGATIVE]: Thu hồi và cấp lại
CALL: ProjectCore.revokeBadge(1, "Sua doi thong tin sai lech")
RESULT: status true, hasBadgeType[student][1] == false
CALL: ProjectCore.issueBadge("0xAb84...", 1, "ipfs://QmCorrected...")
RESULT: status true (PASSED - Khắc phục thành công lỗi kẹt trạng thái của Lab 10)
```
