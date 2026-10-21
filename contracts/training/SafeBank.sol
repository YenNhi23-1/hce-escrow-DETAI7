// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title SafeBank — Hợp đồng ngân hàng đã được vá lỗi bằng 2 phương pháp
contract SafeBank is ReentrancyGuard {
    mapping(address => uint256) public balances;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    function deposit() external payable {
        require(msg.value > 0, "So tien nap phai > 0");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice CÁCH 1: Áp dụng chuẩn Checks - Effects - Interactions (Không tốn thêm gas thư viện)
    /// @dev Thứ tự dòng lệnh là thứ chặn đứng tấn công: Cập nhật sổ sách TRƯỚC KHI chuyển tiền!
    function withdrawCEI() external {
        // 1. Checks: Kiểm tra số dư
        uint256 bal = balances[msg.sender];
        require(bal > 0, "Khong co so du");

        // 2. Effects: Cập nhật sổ sách TRƯỚC (Đặt số dư về 0)
        balances[msg.sender] = 0;
        emit Withdrawn(msg.sender, bal);

        // 3. Interactions: Chuyển tiền ra ngoài SAU CÙNG
        (bool ok, ) = msg.sender.call{value: bal}("");
        require(ok, "Chuyen tien that bai");
    }

    /// @notice CÁCH 2: Dùng khóa chống gọi lại ReentrancyGuard của OpenZeppelin
    function withdrawGuard() external nonReentrant {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "Khong co so du");

        balances[msg.sender] = 0;
        emit Withdrawn(msg.sender, bal);

        (bool ok, ) = msg.sender.call{value: bal}("");
        require(ok, "Chuyen tien that bai");
    }

    function bankBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
