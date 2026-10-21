// Kịch bản kiểm thử tiêu cực (Negative & Security Tests) cho ProjectCore.sol - Lab 13
// Thực thi trên Remix VM / Hardhat / Mocha

describe("ProjectCore Security Hardening Tests", function () {
    let projectCore, owner, issuer, student1, student2, attacker;

    it("Ca 1 - Chặn mạo danh Issuer gọi hàm issueBadge", async function () {
        // Kẻ tấn công cố tình gọi issueBadge khi không có quyền
        // Kết quả mong đợi: Revert với custom error NotAuthorized()
    });

    it("Ca 2 - Chặn sinh viên chuyển nhượng huy hiệu Soulbound (safeTransferFrom)", async function () {
        // Sinh viên 1 cố tình chuyển huy hiệu cho sinh viên 2
        // Kết quả mong đợi: Revert với custom error NotTransferable()
    });

    it("Ca 3 - Chặn Issuer bị bãi nhiệm gọi hàm revokeBadge", async function () {
        // Issuer sau khi bị gỡ quyền (isIssuer = false) cố tình thu hồi huy hiệu cũ
        // Kết quả mong đợi: Revert với custom error NotAuthorized()
    });

    it("Ca 4 - Chặn tham số chuỗi metadata rỗng", async function () {
        // Cố tình truyền metadataURI = ""
        // Kết quả mong đợi: Revert với custom error EmptyMetadata()
    });

    it("Ca 5 - Chặn cấp phát vào địa chỉ 0x0", async function () {
        // Truyền student = address(0)
        // Kết quả mong đợi: Revert với custom error InvalidRecipient()
    });
});
