// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title HCE Soulbound Achievement Badge (ProjectCore - Đã qua Audit Lab 10)
/// @notice Hợp đồng cấp phát và chứng thực huy hiệu thành tích số không thể chuyển nhượng
/// @dev Phiên bản v0.2 đã khắc phục 4 lỗi bảo mật và logic nghiệp vụ được phát hiện trong Lab 10
contract ProjectCore is ERC721, Ownable {
    uint256 public nextTokenId = 1;

    // Cấu trúc thông tin một Huy hiệu
    struct Badge {
        uint256 badgeType;       // Mã loại danh hiệu (1: SV 5 Tot, 2: NCKH, 3: Can bo Doan...)
        uint256 dateAwarded;     // Mốc thời gian cấp phát (block.timestamp)
        address issuedBy;        // Địa chỉ đơn vị đã cấp (Admin / Issuer)
        string metadataURI;      // Liên kết IPFS hoặc thông tin chi tiết giải thưởng
        bool revoked;            // Trạng thái bị thu hồi nếu có gian lận
    }

    // Ánh xạ tokenId => Thông tin chi tiết huy hiệu
    mapping(uint256 => Badge) public badges;

    // Danh sách các Đơn vị được ủy quyền phát hành (CLB / Khoa / Đoàn trường)
    mapping(address => bool) public isIssuer;

    // Chống cấp phát trùng lặp: studentAddress => (badgeType => đã nhận hay chưa)
    mapping(address => mapping(uint256 => bool)) public hasBadgeType;

    // Giới hạn trần số lượng cho từng loại huy hiệu: badgeType => maxSupply
    mapping(uint256 => uint256) public maxSupplyPerType;
    // Số lượng đang có hiệu lực theo từng loại: badgeType => currentSupply
    mapping(uint256 => uint256) public currentSupplyPerType;

    // Sự kiện on-chain
    event BadgeIssued(uint256 indexed tokenId, address indexed student, uint256 indexed badgeType, string metadataURI);
    event BadgeRevoked(uint256 indexed tokenId, address indexed student, address indexed revokedBy, string reason);
    event IssuerStatusUpdated(address indexed issuer, bool status);
    event BadgeTypeConfigured(uint256 indexed badgeType, uint256 maxSupply);

    // Danh sách Custom Errors giúp tiết kiệm gas theo chuẩn AGENTS.md
    error NotAuthorized();
    error NotTransferable();
    error InvalidRecipient();
    error EmptyMetadata();
    error BadgeAlreadyAwarded();
    error ExceedsMaxSupply();
    error BadgeNotFound();
    error BadgeAlreadyRevoked();
    error BatchTooLarge(uint256 size, uint256 limit);

    modifier onlyAuthorizedIssuer() {
        if (msg.sender != owner() && !isIssuer[msg.sender]) {
            revert NotAuthorized();
        }
        _;
    }

    constructor() ERC721("HCE Soulbound Achievement Badge", "HCESBT") Ownable(msg.sender) {
        isIssuer[msg.sender] = true;
        emit IssuerStatusUpdated(msg.sender, true);
    }

    /// @notice Quản trị viên cấp quyền hoặc hủy quyền Issuer cho CLB/Khoa
    function setIssuer(address issuer, bool status) external onlyOwner {
        if (issuer == address(0)) revert InvalidRecipient();
        isIssuer[issuer] = status;
        emit IssuerStatusUpdated(issuer, status);
    }

    /// @notice Thiết lập số lượng trần cho một loại huy hiệu
    function setBadgeTypeLimit(uint256 badgeType, uint256 maxSupply) external onlyOwner {
        maxSupplyPerType[badgeType] = maxSupply;
        emit BadgeTypeConfigured(badgeType, maxSupply);
    }

    /// @notice Cấp phát huy hiệu thành tích số cho sinh viên
    /// @dev ĐÃ VÁ LỖI 3 (Audit Lab 10): Bổ sung kiểm tra chuỗi metadata rỗng
    function issueBadge(
        address student,
        uint256 badgeType,
        string calldata metadataURI
    ) public onlyAuthorizedIssuer returns (uint256) {
        // 1. Checks — Kiểm tra chặt chẽ điều kiện
        if (student == address(0)) revert InvalidRecipient();
        if (bytes(metadataURI).length == 0) revert EmptyMetadata(); // [VÁ LỖI 3]
        if (hasBadgeType[student][badgeType]) revert BadgeAlreadyAwarded();

        uint256 limit = maxSupplyPerType[badgeType];
        if (limit > 0 && currentSupplyPerType[badgeType] >= limit) {
            revert ExceedsMaxSupply();
        }

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        // 2. Effects — Cập nhật trạng thái trước
        hasBadgeType[student][badgeType] = true;
        currentSupplyPerType[badgeType]++;

        badges[tokenId] = Badge({
            badgeType: badgeType,
            dateAwarded: block.timestamp,
            issuedBy: msg.sender,
            metadataURI: metadataURI,
            revoked: false
        });

        emit BadgeIssued(tokenId, student, badgeType, metadataURI);

        // 3. Interactions — Thực thi mint token an toàn
        _safeMint(student, tokenId);

        return tokenId;
    }

    /// @notice Cấp phát theo lô cho nhiều sinh viên trong cùng một sự kiện trao giải
    /// @dev [BỔ SUNG VÁ LỖI 4]: Giúp tiết kiệm gas và ngăn ngừa nghẽn mạng khi trao giải hàng loạt
    function issueBatch(
        address[] calldata students,
        uint256 badgeType,
        string calldata metadataURI
    ) external onlyAuthorizedIssuer {
        uint256 total = students.length;
        if (total > 50) revert BatchTooLarge(total, 50); // Giới hạn 50 sinh viên/giao dịch để không vượt block gas

        for (uint256 i = 0; i < total; i++) {
            issueBadge(students[i], badgeType, metadataURI);
        }
    }

    /// @notice Thu hồi huy hiệu khi sinh viên có hành vi gian lận học thuật hoặc bị kỷ luật
    /// @dev ĐÃ VÁ LỖI 1 & LỖI 2 (Audit Lab 10): 
    /// - Kiểm tra quyền Issuer còn hiệu lực (Lỗi 1).
    /// - Reset hasBadgeType và trừ currentSupply để cho phép cấp lại khi giải quyết xong sai sót (Lỗi 2).
    function revokeBadge(uint256 tokenId, string calldata reason) external {
        Badge storage b = badges[tokenId];
        if (b.dateAwarded == 0) revert BadgeNotFound();
        if (b.revoked) revert BadgeAlreadyRevoked();

        // [VÁ LỖI 1]: Issuer cũ nếu đã bị tước quyền thì KHÔNG được phép thu hồi huy hiệu nữa
        bool isCurrentOwner = (msg.sender == owner());
        bool isValidActiveIssuer = (msg.sender == b.issuedBy && isIssuer[msg.sender]);
        if (!isCurrentOwner && !isValidActiveIssuer) {
            revert NotAuthorized();
        }

        // Lấy địa chỉ chủ sở hữu hiện tại trước khi cập nhật
        address student = _ownerOf(tokenId);

        // [VÁ LỖI 2]: Reset trạng thái để không bị khóa vĩnh viễn quyền nhận lại nếu có đính chính
        hasBadgeType[student][b.badgeType] = false;
        if (currentSupplyPerType[b.badgeType] > 0) {
            currentSupplyPerType[b.badgeType]--;
        }

        b.revoked = true;
        emit BadgeRevoked(tokenId, student, msg.sender, reason);
    }

    /// @notice Hàm xác thực trạng thái huy hiệu công khai, không tốn phí Gas
    function verifyBadge(uint256 tokenId) external view returns (
        bool exists,
        bool valid,
        address student,
        uint256 badgeType,
        uint256 dateAwarded,
        address issuedBy,
        string memory metadataURI
    ) {
        Badge memory b = badges[tokenId];
        if (b.dateAwarded == 0) {
            return (false, false, address(0), 0, 0, address(0), "");
        }
        address currentOwner = _ownerOf(tokenId);
        return (
            true,
            !b.revoked,
            currentOwner,
            b.badgeType,
            b.dateAwarded,
            b.issuedBy,
            b.metadataURI
        );
    }

    /// @dev Điểm chặn cốt lõi của Soulbound Token trong OpenZeppelin phiên bản 5.x:
    /// Mọi hành động chuyển quyền sở hữu token đều phải đi qua _update.
    /// Cho phép Mint: from == address(0)
    /// Cho phép Burn: to == address(0)
    /// Chặn mọi giao dịch chuyển nhượng thông thường giữa 2 ví cá nhân
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        bool isTransfer = from != address(0) && to != address(0);

        // Quy tắc bất biến: Cấm chuyển nhượng huy hiệu giữa người dùng
        if (isTransfer) {
            revert NotTransferable();
        }

        return super._update(to, tokenId, auth);
    }
}
