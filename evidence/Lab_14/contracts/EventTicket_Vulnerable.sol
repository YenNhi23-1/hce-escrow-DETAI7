// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Ve su kien gioi han ban lai - Ban ban dau cua Nhom 06 truoc khi Audit
/// @notice Chứa các lỗi tiềm ẩn được phát hiện tại Lab 14 (dòng 42, 65, 88)
contract EventTicket is ERC721, Ownable {
    uint256 public nextTokenId = 1;
    uint256 public maxSupply;
    uint256 public price;
    uint256 public maxResellPrice; // Tran gia ban lai tranh dau co
    address public admin;

    mapping(uint256 => bool) public used;             // Ve da check-in vao cong hay chua
    mapping(address => bool) public hasTicket;        // Moi vi chi duoc mua 1 ve
    mapping(uint256 => uint256) public resellPrice;   // Gia dang niem yet ban lai

    event TicketMinted(address indexed to, uint256 indexed tokenId);
    event TicketUsed(uint256 indexed tokenId, address indexed by);
    event TicketListed(uint256 indexed tokenId, uint256 price);
    event TicketResold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);

    error SoldOut();
    error WrongPrice();
    error AlreadyOwns();
    error AlreadyUsed();
    error ExceedsMaxResellPrice();
    error NotTicketOwner();
    error NotListed();

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 _maxSupply,
        uint256 _price,
        uint256 _maxResellPrice
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        price = _price;
        maxResellPrice = _maxResellPrice;
        admin = msg.sender;
    }

    // [LỖI 3 - DÒNG 42]: Thieu kiem tra address(0) khi thay doi Admin
    function setAdmin(address newAdmin) external onlyOwner {
        address oldAdmin = admin;
        admin = newAdmin;
        emit AdminChanged(oldAdmin, newAdmin);
    }

    /// @notice Nguoi tham du tu mua ve dot 1
    function buy() external payable {
        if (nextTokenId > maxSupply) revert SoldOut();
        if (msg.value != price) revert WrongPrice();
        if (hasTicket[msg.sender]) revert AlreadyOwns();

        uint256 id = nextTokenId++;
        hasTicket[msg.sender] = true;
        _safeMint(msg.sender, id);

        emit TicketMinted(msg.sender, id);
    }

    /// @notice Niem yet ban lai ve tren thi truong thu cap (co tran gia)
    function listResell(uint256 tokenId, uint256 askPrice) external {
        if (ownerOf(tokenId) != msg.sender) revert NotTicketOwner();
        if (askPrice > maxResellPrice) revert ExceedsMaxResellPrice();
        // [LỖI 2 - DÒNG 65]: Khong kiem tra ve da used[tokenId] chua
        resellPrice[tokenId] = askPrice;
        emit TicketListed(tokenId, askPrice);
    }

    /// @notice Nguoi khac mua lai ve tu nguoi dang niem yet
    function buyResell(uint256 tokenId) external payable {
        uint256 askPrice = resellPrice[tokenId];
        if (askPrice == 0) revert NotListed();
        if (msg.value != askPrice) revert WrongPrice();

        address seller = ownerOf(tokenId);
        resellPrice[tokenId] = 0; // Xoa niem yet truoc (Checks-Effects)

        // Chuyen tien cho nguoi ban
        (bool ok, ) = payable(seller).call{value: msg.value}("");
        require(ok, "Thanh toan cho nguoi ban that bai");

        // Chuyen ve sang nguoi mua moi
        _transfer(seller, msg.sender, tokenId);
        hasTicket[seller] = false;
        hasTicket[msg.sender] = true;

        emit TicketResold(tokenId, seller, msg.sender, askPrice);
    }

    /// @notice Soat ve tai cua su kien - Chi Admin moi duoc goi
    function checkIn(uint256 tokenId) external {
        require(msg.sender == admin || msg.sender == owner(), "Khong co quyen soat ve");
        if (used[tokenId]) revert AlreadyUsed();
        used[tokenId] = true;

        emit TicketUsed(tokenId, ownerOf(tokenId));
    }

    // [LỖI 1 - DÒNG 88]: Dung transfer() co dinh 2300 gas de rut doanh thu ve vi owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "So du bang 0");
        payable(owner()).transfer(balance);
    }
}
