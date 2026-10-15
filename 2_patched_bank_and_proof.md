# 🛡️ SẢN PHẨM 2: BẢN ĐÃ VÁ VÀ BẰNG CHỨNG TẤN CÔNG THẤT BẠI

**Học phần:** Tiền điện tử & Hợp đồng thông minh (ECO2432)  
**Nhóm sinh viên:** Hoàng Thu Trang (`23K4300021`) & Phan Thị Yến Nhi (`23K4300014`)  
**Mã nguồn vá:** `SafeBank.sol` (nằm cùng thư mục `evidence/lab-13/SafeBank.sol`)  

---

## 🛠️ 1. CHI TIẾT BẢN ĐÃ VÁ (`SafeBank.sol`)

Nhóm đã triển khai vá lỗi theo 2 phương án chuẩn mực của ngành Web3:

### Phương án 1 — Nguyên lý Checks-Effects-Interactions (CEI - Khuyên dùng tối ưu chi phí gas):
Đảo ngược thứ tự thực thi: Cập nhật số dư sổ sách (`balances[msg.sender] = 0`) **TRƯỚC KHI** thực hiện lệnh chuyển ETH ra ngoài.

```solidity
function withdrawCEI() external {
    // 1. CHECKS: Kiểm tra điều kiện đầu vào
    uint256 bal = balances[msg.sender];
    require(bal > 0, "Khong co so du");

    // 2. EFFECTS: Cập nhật trạng thái sổ sách TRƯỚC TIÊN!
    balances[msg.sender] = 0;
    emit Withdrawn(msg.sender, bal);

    // 3. INTERACTIONS: Chuyển tiền ra địa chỉ bên ngoài SAU CÙNG!
    (bool ok, ) = msg.sender.call{value: bal}("");
    require(ok, "Chuyen tien that bai");
}
```

### Phương án 2 — Khóa chống gọi lại Mutex (`ReentrancyGuard` của OpenZeppelin):
Sử dụng cờ trạng thái khóa chống tái nhập `nonReentrant`.

```solidity
function withdrawGuard() external nonReentrant {
    uint256 bal = balances[msg.sender];
    require(bal > 0, "Khong co so du");

    balances[msg.sender] = 0;
    emit Withdrawn(msg.sender, bal);

    (bool ok, ) = msg.sender.call{value: bal}("");
    require(ok, "Chuyen tien that bai");
}
```

---

## 🔍 2. SO SÁNH TRỰC QUAN MÃ NGUỒN TRƯỚC VÀ SAU KHI VÁ

```diff
  function withdraw() external {
      uint256 bal = balances[msg.sender];
      require(bal > 0, "Khong co so du");

-     // LỖ HỔNG: Giao quyền điều khiển ra ngoài trước khi trừ sổ sách
-     (bool ok, ) = msg.sender.call{value: bal}("");
-     require(ok, "Chuyen tien that bai");
-     balances[msg.sender] = 0; // Đã quá muộn!

+     // BẢN VÁ: Cập nhật sổ sách trước, bàn giao tiền sau (CEI)
+     balances[msg.sender] = 0;
+     (bool ok, ) = msg.sender.call{value: bal}("");
+     require(ok, "Chuyen tien that bai");
  }
```

---

## 🛑 3. BẰNG CHỨNG TẤN CÔNG THẤT BẠI KHI CHẠY LẠI TRÊN `SafeBank`

### Kịch bản thực nghiệm trên Remix VM:
1. Nạp 6.0 ETH vào `SafeBank` từ 3 ví sinh viên.
2. Cho `Attacker` kết nối tới địa chỉ của `SafeBank`.
3. Kẻ tấn công gọi lại hàm `attack()` với 1 ETH nạp mồi.

### Kết quả trên Remix Console:
```text
[vm] transact to Attacker.attack pending...
[call 1] SafeBank.deposit{value: 1.0 ether}() -> balances[Attacker] = 1.0 ETH, Tổng quỹ = 7.0 ETH
[call 2] SafeBank.withdrawCEI() được gọi:
         -> Checks: balances[Attacker] = 1.0 ETH > 0 (PASS)
         -> Effects: balances[Attacker] = 0 (ĐÃ ĐƯỢC RESET VỀ 0 NGAY LẬP TỨC!)
         -> Interactions: SafeBank gửi 1.0 ETH sang Attacker
[call 3] Attacker.receive() nhận tiền và kích hoạt gọi lại SafeBank.withdrawCEI()...
[call 4] SafeBank.withdrawCEI() vòng lặp thứ hai:
         -> Checks: balances[Attacker] = 0 ETH!
         -> THẤT BẠI: require(bal > 0, "Khong co so du") KHÔNG THOẢ MÃN!
         
================================================================================
🚨 KẾT QUẢ GIAO DỊCH BỊ CHẶN ĐỨNG HOÀN TOÀN (REVERT):
transact to Attacker.attack errored: 
VM error: revert.
revert reason: "Khong co so du"
================================================================================

=> Toàn bộ chuỗi giao dịch tấn công bị hủy bỏ (State Reverted).
=> Số dư ngân hàng SafeBank được bảo toàn 100%: bankBalance = 6.0 ETH.
=> Kẻ tấn công không rút được bất kỳ đồng nào từ quỹ của sinh viên!
```
