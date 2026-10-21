// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title VaultBuggy — Hợp đồng mẫu chứa 4 lỗ hổng bảo mật thực hành Lab 10
/// @notice Dùng để sinh viên luyện kỹ năng kiểm toán (Audit) và nhận diện lỗi AI sinh ra
contract VaultBuggy {
    // Slot 0: 20 bytes địa chỉ owner
    address public owner;
    
    // Slot 1: 32 bytes tổng số dư két
    uint256 public totalVaultBalance;
    
    // Slot 2: LỖ HỔNG 1 (Lộ dữ liệu nhạy cảm)
    // Từ khóa private chỉ chặn hợp đồng khác đọc trực tiếp qua Solidity,
    // nhưng KHÔNG hề bảo mật trên blockchain. Bất kỳ ai cũng đọc được qua eth_getStorageAt(addr, "0x2", "latest").
    uint256 private emergencyPin;

    mapping(address => uint256) public balances;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event EmergencyWithdrawn(address indexed to, uint256 amount);

    constructor(uint256 _pin) {
        owner = msg.sender;
        emergencyPin = _pin; // Ví dụ khởi tạo: 123456
    }

    function deposit() external payable {
        require(msg.value > 0, "So tien phai lon hon 0");
        balances[msg.sender] += msg.value;
        totalVaultBalance += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice LỖ HỔNG 2: Vi phạm thứ tự Checks - Effects - Interactions (Reentrancy Bug)
    /// @dev Chuyển tiền (Interactions) TRƯỚC KHI trừ số dư (Effects). Kẻ tấn công có thể gọi lại (fallback) để rút cạn quỹ.
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Khong du so du");
        
        // NGUY HIỂM: Chuyển tiền trước
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "Chuyen tien that bai");

        // Trừ sổ sách sau
        balances[msg.sender] -= amount;
        totalVaultBalance -= amount;
        emit Withdrawn(msg.sender, amount);
    }

    /// @notice LỖ HỔNG 3: Kiểm soát quyền hạn yếu kết hợp lộ mã bí mật
    /// @dev Bất kỳ ai đọc được PIN từ slot 2 đều có thể gọi hàm này để rút toàn bộ tiền trong hợp đồng về ví của mình!
    function emergencyWithdraw(uint256 pin, address payable to) external {
        require(pin == emergencyPin, "Sai ma PIN");
        uint256 amount = address(this).balance;
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Rut khan cap that bai");
        emit EmergencyWithdrawn(to, amount);
    }

    /// @notice LỖ HỔNG 4: Xác thực người dùng bằng tx.origin thay vì msg.sender
    /// @dev Lỗ hổng cho phép tấn công lừa đảo (Phishing Attack). Nếu owner tương tác với một hợp đồng độc hại, hợp đồng đó có thể mạo danh owner để chiếm quyền quản trị.
    function changeOwner(address newOwner) external {
        require(tx.origin == owner, "Chi chu so huu moi duoc doi");
        require(newOwner != address(0), "Dia chi moi khong hop le");
        owner = newOwner;
    }
}
