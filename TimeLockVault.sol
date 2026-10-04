// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Ket tiet kiem co khoa thoi gian (Training Lab 9)
/// @notice Nguoi tao ket nap tien vao va chi rut duoc sau khi het thoi gian khoa
contract TimeLockVault {
    address public immutable owner;
    uint256 public immutable unlockTime;

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

    /// @notice Nap ETH vao ket tiet kiem
    function deposit() external payable {
        if (msg.value == 0) revert ZeroAmount();
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Rut toan bo so du sau khi het thoi gian khoa
    function withdraw() external {
        // 1. Checks - Kiem tra dieu kien
        if (msg.sender != owner) revert NotOwner();
        if (block.timestamp < unlockTime) revert StillLocked(unlockTime, block.timestamp);

        uint256 amount = address(this).balance;
        if (amount == 0) revert NothingToWithdraw();

        // 2. Effects - Phat su kien truoc khi chuyen tien ra ngoai
        emit Withdrawn(owner, amount);

        // 3. Interactions - Chuyen tien ra ngoai sau cung
        (bool ok, ) = payable(owner).call{value: amount}("");
        require(ok, "Chuyen tien that bai");
    }

    /// @notice Xem thoi gian con lai truoc khi duoc phep rut
    function timeLeft() external view returns (uint256) {
        if (block.timestamp >= unlockTime) return 0;
        return unlockTime - block.timestamp;
    }
}
