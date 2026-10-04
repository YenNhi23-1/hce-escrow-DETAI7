// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title HCE Soulbound Badge - Huy hieu thanh tich sinh vien khong chuyen nhuong (Chu de 7)
/// @notice Cap phat danh hieu sinh vien tren blockchain, khoa tinh nang chuyen nhuong vinh vien
/// @dev Su dung OpenZeppelin v5 voi ham chan duy nhat la _update. Do dai duoi 120 dong.
contract ProjectCore is ERC721, Ownable {
    // --- 1. BIẾN TRẠNG THÁI ---
    uint256 public nextTokenId = 1;
    uint256 public immutable maxSupply;
    bool public constant soulbound = true; // Bat buoc true: Khong the chuyen nhuong

    // Loai danh hieu: 1 = Sinh vien 5 tot, 2 = Giai thuong NCKH, 3 = Can bo Doan xuat sac
    mapping(uint256 => uint256) public badgeType;
    mapping(uint256 => uint256) public issuedAt;
    mapping(address => bool) public hasBadge; // Moi vi chi nhan 1 huy hieu cua dot nay

    // --- 2. SỰ KIỆN ---
    event BadgeIssued(address indexed recipient, uint256 indexed tokenId, uint256 badgeType, uint256 timestamp);
    event BadgeRevoked(uint256 indexed tokenId, address indexed recipient, string reason);

    // --- 3. LỖI TÙY BIẾN (CUSTOM ERRORS) ---
    error SoldOut();
    error AlreadyClaimed(address recipient);
    error NotTransferable();
    error InvalidRecipient();
    error NotFound(uint256 tokenId);

    // --- 4. HÀM KHỞI TẠO (CONSTRUCTOR) ---
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 _maxSupply
    ) 
        ERC721(name_, symbol_) 
        Ownable(msg.sender) 
    {
        maxSupply = _maxSupply;
    }

    // --- 5. HÀM NGHIỆP VỤ ---

    /// @notice Nha truong / Doan truong cap phat huy hieu mien phi cho sinh vien xuat sac
    function issueBadge(address to, uint256 _badgeType) external onlyOwner {
        if (to == address(0)) revert InvalidRecipient();
        if (hasBadge[to]) revert AlreadyClaimed(to);
        if (nextTokenId > maxSupply) revert SoldOut();

        uint256 id = nextTokenId;
        nextTokenId++;

        hasBadge[to] = true;
        badgeType[id] = _badgeType;
        issuedAt[id] = block.timestamp;

        _safeMint(to, id);
        emit BadgeIssued(to, id, _badgeType, block.timestamp);
    }

    /// @notice Hoi dong ky luat thu hoi huy hieu khi sinh vien vi pham quy che hoc vu
    function revokeBadge(uint256 tokenId, string calldata reason) external onlyOwner {
        address recipient = _ownerOf(tokenId);
        if (recipient == address(0)) revert NotFound(tokenId);

        hasBadge[recipient] = false;
        _burn(tokenId);

        emit BadgeRevoked(tokenId, recipient, reason);
    }

    /// @dev OpenZeppelin v5: Moi thay doi so huu (mint, transfer, burn) deu di qua _update.
    /// Mint co from == address(0), Burn co to == address(0) -> Phai loai tru hai truong hop nay!
    function _update(
        address to, 
        uint256 tokenId, 
        address auth
    ) 
        internal 
        override 
        returns (address) 
    {
        address from = _ownerOf(tokenId);
        bool isTransfer = from != address(0) && to != address(0);

        // KHOA SOULBOUND: Cam tuyet doi chuyen nhuong giua hai vi nguoi dung
        if (soulbound && isTransfer) revert NotTransferable();

        return super._update(to, tokenId, auth);
    }

    // --- 6. HÀM XEM THÔNG TIN (VIEW) ---

    /// @notice Xac thuc trang thai huy hieu phuc vu nha tuyen dung va he thong xep hang
    function verifyBadge(uint256 tokenId) external view returns (
        bool isValid,
        address recipient,
        uint256 _badgeType,
        uint256 _issuedAt
    ) {
        address currentOwner = _ownerOf(tokenId);
        if (currentOwner == address(0)) {
            return (false, address(0), 0, 0);
        }
        return (true, currentOwner, badgeType[tokenId], issuedAt[tokenId]);
    }
}
