// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Ket tiet kiem co khoa thoi gian (TimeLockVault) — Bài học kỹ thuật Lab 9
/// @notice Mô hình ký gửi có điều kiện thời gian chuẩn mực theo hướng dẫn ECO2432
contract TimeLockVault {
    address public owner;
    uint256 public unlockTime;

    event Deposited(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    error NotOwner();
    error StillLocked(uint256 unlockAt, uint256 currentTime);
    error NothingToWithdraw();
    error ZeroAmount();

    constructor(uint256 lockDurationSeconds) {
        owner = msg.sender;
        unlockTime = block.timestamp + lockDurationSeconds;
    }

    function deposit() external payable {
        if (msg.value == 0) revert ZeroAmount();
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw() external {
        // 1. Checks — Kiểm tra điều kiện
        if (msg.sender != owner) revert NotOwner();
        if (block.timestamp < unlockTime) revert StillLocked(unlockTime, block.timestamp);

        uint256 amount = address(this).balance;
        if (amount == 0) revert NothingToWithdraw();

        // 2. Effects — Phát sự kiện và cập nhật trước khi chuyển tiền
        emit Withdrawn(owner, amount);

        // 3. Interactions — Chuyển tiền ra ngoài sau cùng
        (bool ok, ) = payable(owner).call{value: amount}("");
        require(ok, "Chuyen tien that bai");
    }

    function timeLeft() external view returns (uint256) {
        if (block.timestamp >= unlockTime) return 0;
        return unlockTime - block.timestamp;
    }
}
