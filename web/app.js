/**
 * HUE Soulbound Credentials — Production Frontend Engine (web/app.js)
 * Nền tảng Quản lý & Xác thực Huy hiệu Thành tích Số Đại học Huế (HUE-SBT)
 */

// --- 1. DANH MỤC VĂN BẰNG & DANH HIỆU CHÍNH THỨC CỦA ĐẠI HỌC HUẾ ---
const BADGE_TYPES = {
  1: { 
    title: "Sinh viên 5 tốt tiêu biểu cấp Đại học Huế", 
    icon: "🏆", 
    desc: "Đạt thành tích Xuất sắc trong 5 tiêu chí: Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt và Hội nhập tốt." 
  },
  2: { 
    title: "Thủ khoa tốt nghiệp Xuất sắc Khóa K58", 
    icon: "💡", 
    desc: "Thành tích học tập Thủ khoa toàn khóa đào tạo với điểm học tập và rèn luyện xuất sắc dẫn đầu." 
  },
  3: { 
    title: "Học bổng Khuyến tài Doanh nghiệp Bảo trợ", 
    icon: "🎖️", 
    desc: "Sinh viên có hoàn cảnh vượt khó đạt thành tích xuất sắc, được các tập đoàn tài chính/công nghệ bảo trợ." 
  },
  4: { 
    title: "Giải Nhất NCKH Sinh viên HUE 2026", 
    icon: "🔬", 
    desc: "Đề tài nghiên cứu ứng dụng công nghệ Chuỗi khối trong minh bạch hóa tài chính giáo dục công lập." 
  },
  5: { 
    title: "Quán quân Cuộc thi Khởi nghiệp HUE Startup", 
    icon: "🚀", 
    desc: "Dự án khởi nghiệp đổi mới sáng tạo xuất sắc nhất toàn Đại học Huế năm 2026." 
  },
  6: { 
    title: "Giải Nhất Olympic Tin học & Công nghệ Web3", 
    icon: "💻", 
    desc: "Đạt giải Nhất cuộc thi Lập trình giải thuật và Ứng dụng Hợp đồng thông minh phân tán." 
  },
  7: { 
    title: "Cán bộ Đoàn - Hội xuất sắc tiêu biểu Đại học Huế", 
    icon: "🌟", 
    desc: "Có thành tích đặc biệt xuất sắc trong công tác Đoàn và phong trào Thanh niên Đại học Huế nhiệm kỳ 2024 - 2026." 
  },
  8: { 
    title: "Chiến sĩ Tình nguyện Xuất sắc Chiến dịch Mùa hè Xanh", 
    icon: "🎗️", 
    desc: "Có cống hiến nổi bật vì cộng đồng tại các địa bàn vùng cao, biên giới và hải đảo miền Trung." 
  },
  9: { 
    title: "Huy hiệu Tôn vinh Hiến máu Nhân đạo (Từ 5 lần)", 
    icon: "🩸", 
    desc: "Nghĩa cử cao đẹp hiến máu tình nguyện cứu người liên tục từ 5 lần trở lên trong thời gian học tập." 
  },
  10: { 
    title: "Chứng chỉ Xuất sắc Kỹ sư Smart Contract (ECO2432)", 
    icon: "📜", 
    desc: "Hoàn thành xuất sắc khóa huấn luyện phát triển Smart Contract, vượt qua Gate Review và Audit bảo mật." 
  }
};

let isWeb3Connected = false;
let userAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"; // Ban Quản trị HUE

// Cơ sở dữ liệu on-chain mô phỏng State Trie của Smart Contract ProjectCore.sol (HUE-SBT)
let badgesDatabase = [
  {
    tokenId: 1,
    badgeType: 1,
    studentName: "Phan Thị Yến Nhi",
    studentId: "23K4300014",
    recipient: "0x71C26071493b86EFA7AC41b38f828a2aC41Ea47B",
    issuedAt: "10/10/2026, 09:30:15",
    isRevoked: false,
    revokeReason: ""
  },
  {
    tokenId: 2,
    badgeType: 4,
    studentName: "Nguyễn Quốc Bảo",
    studentId: "23K4300028",
    recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    issuedAt: "11/10/2026, 14:15:00",
    isRevoked: false,
    revokeReason: ""
  },
  {
    tokenId: 3,
    badgeType: 7,
    studentName: "Lê Thị Diệu Linh",
    studentId: "23K4300085",
    recipient: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    issuedAt: "12/10/2026, 16:45:20",
    isRevoked: false,
    revokeReason: ""
  }
];

// --- 2. KHỞI TẠO HỆ THỐNG ---

// Tài khoản Admin - Hội đồng Khen thưởng HUE
const ADMIN_ACCOUNTS = {
  "admin.hue": { password: "admin@2026", displayName: "Hội đồng Khen thưởng — Đại học Huế" },
  "giam.doc": { password: "admin@2026", displayName: "Ban Giám đốc Đại học Huế" },
};

// Tài khoản Doanh nghiệp được ủy quyền xác minh
const ENTERPRISE_ACCOUNTS = {
  "DN001": { password: "verify@2026", displayName: "FPT Software — Nhà tuyển dụng đối tác" },
  "DN002": { password: "verify@2026", displayName: "VNG Corporation — Nhà tuyển dụng đối tác" },
  "DN003": { password: "verify@2026", displayName: "Viettel Group — Đối tác học thuật" },
};

let isAdminLoggedIn = false;
let isEnterpriseLoggedIn = false;

document.addEventListener("DOMContentLoaded", () => {
  // Ẩn dashboard, chỉ hiện màn hình login
  document.getElementById("adminDashboard").style.display    = "none";
  document.getElementById("enterpriseDashboard").style.display = "none";

  renderAllBadges();
  updateStats();
  updatePreviewCard();

  const btnConnect = document.getElementById("btnConnectWallet");
  if (btnConnect) {
    btnConnect.addEventListener("click", connectMetaMask);
  }
});

// --- ADMIN AUTH ---
function handleAdminLogin(e) {
  e.preventDefault();
  const username = document.getElementById("adminLoginUser").value.trim();
  const password = document.getElementById("adminLoginPass").value;
  const errorEl  = document.getElementById("adminLoginError");

  const account = ADMIN_ACCOUNTS[username];
  if (!account || account.password !== password) {
    errorEl.style.display = "block";
    document.getElementById("adminLoginPass").value = "";
    return;
  }

  errorEl.style.display = "none";
  isAdminLoggedIn = true;
  document.getElementById("adminDisplayName").innerText = account.displayName;
  document.getElementById("adminLoginScreen").style.display  = "none";
  document.getElementById("adminDashboard").style.display    = "block";
  renderAllBadges();
  showToast(`✅ Chào mừng ${account.displayName} đã đăng nhập!`, "success");
}

function handleAdminLogout() {
  isAdminLoggedIn = false;
  document.getElementById("formAdminLogin").reset();
  document.getElementById("adminLoginError").style.display = "none";
  document.getElementById("adminLoginScreen").style.display = "block";
  document.getElementById("adminDashboard").style.display   = "none";
  showToast("Đã đăng xuất khỏi tài khoản Ban Quản trị.", "info");
}

// --- ENTERPRISE AUTH ---
function handleEnterpriseLogin(e) {
  e.preventDefault();
  const username = document.getElementById("enterpriseLoginUser").value.trim();
  const password = document.getElementById("enterpriseLoginPass").value;
  const errorEl  = document.getElementById("enterpriseLoginError");

  const account = ENTERPRISE_ACCOUNTS[username];
  if (!account || account.password !== password) {
    errorEl.style.display = "block";
    document.getElementById("enterpriseLoginPass").value = "";
    return;
  }

  errorEl.style.display = "none";
  isEnterpriseLoggedIn = true;
  document.getElementById("enterpriseDisplayName").innerText   = account.displayName;
  document.getElementById("enterpriseLoginScreen").style.display = "none";
  document.getElementById("enterpriseDashboard").style.display   = "block";
  showToast(`✅ Chào mừng ${account.displayName}!`, "success");
}

function handleEnterpriseLogout() {
  isEnterpriseLoggedIn = false;
  document.getElementById("formEnterpriseLogin").reset();
  document.getElementById("enterpriseLoginError").style.display  = "none";
  document.getElementById("enterpriseLoginScreen").style.display = "block";
  document.getElementById("enterpriseDashboard").style.display   = "none";
  document.getElementById("verifyResultBody").innerHTML = `<p style="color:var(--text-dim);text-align:center;padding:40px 0;">Nhập mã định danh huy hiệu hoặc địa chỉ ví sinh viên để tra cứu.</p>`;
  document.getElementById("verifyBadgeStatusTag").innerText = "Đang chờ tra cứu";
  showToast("Đã đăng xuất khỏi Cổng Doanh nghiệp.", "info");
}

function fillEnterpriseDemoLogin(user, pwd) {
  document.getElementById("enterpriseLoginUser").value = user;
  document.getElementById("enterpriseLoginPass").value = pwd;
  document.getElementById("enterpriseLoginError").style.display = "none";
}

// --- TOGGLE PASSWORD (dùng chung) ---
function togglePwd(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type   = "text";
    btn.innerText = "🙈";
  } else {
    input.type   = "password";
    btn.innerText = "👁️";
  }
}


// --- 3. ĐIỀU HƯỚNG CÁC PHÂN HỆ (PORTAL TABS) ---
function showTab(tabName) {
  const tabs = ['issuer', 'student', 'verify', 'contract'];
  tabs.forEach(t => {
    const tabBtn = document.getElementById(`tabBtn${capitalize(t)}`);
    const tabContent = document.getElementById(`tabContent${capitalize(t)}`);
    if (tabBtn && tabContent) {
      if (t === tabName) {
        tabBtn.classList.add("active");
        tabContent.classList.add("active");
      } else {
        tabBtn.classList.remove("active");
        tabContent.classList.remove("active");
      }
    }
  });
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// --- 4. BẢN XEM TRƯỚC HUY HIỆU THỜI GIAN THỰC (METADATA PREVIEW) ---
function updatePreviewCard() {
  const typeSelect = document.getElementById("selectBadgeType");
  const nameInput = document.getElementById("inputStudentName");
  const idInput = document.getElementById("inputStudentId");
  const addrInput = document.getElementById("inputStudentAddress");

  const typeId = parseInt(typeSelect.value) || 1;
  const badgeInfo = BADGE_TYPES[typeId] || BADGE_TYPES[1];

  document.getElementById("previewBadgeIcon").innerText = badgeInfo.icon;
  document.getElementById("previewBadgeTitle").innerText = badgeInfo.title;
  document.getElementById("previewRecipientName").innerText = nameInput.value || "Tên sinh viên";
  document.getElementById("previewRecipientId").innerText = idInput.value || "MSSV";

  const addr = addrInput.value.trim();
  if (addr.length >= 10) {
    document.getElementById("previewRecipientAddress").innerText = `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  } else {
    document.getElementById("previewRecipientAddress").innerText = addr || "0x...";
  }
}

// --- 5. TẠO VÍ NGẪU NHIÊN ---
function generateRandomWallet() {
  const hex = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) {
    addr += hex[Math.floor(Math.random() * hex.length)];
  }
  const input = document.getElementById("inputStudentAddress");
  if (input) {
    input.value = addr;
  }
  updatePreviewCard();
  showToast(`Đã tạo ví sinh viên mới: ${addr.substring(0, 8)}...`, "info");
}

// --- 6. PHÁT HÀNH HUY HIỆU ON-CHAIN (ISSUE BADGE) ---
function handleIssueBadge(e) {
  e.preventDefault();

  const type = parseInt(document.getElementById("selectBadgeType").value);
  const studentName = document.getElementById("inputStudentName").value.trim();
  const studentId = document.getElementById("inputStudentId").value.trim();
  const recipientAddr = document.getElementById("inputStudentAddress").value.trim();

  // Quy tắc E5: InvalidRecipient — địa chỉ ví không được để trống/zero
  if (!recipientAddr || recipientAddr === "0x0000000000000000000000000000000000000000") {
    showToast("LỖI REVERT: InvalidRecipient() — Không được cấp vào địa chỉ rỗng!", "error");
    return;
  }

  // Quy tắc R-W: WalletAlreadyLinked — mỗi ví chỉ được liên kết với 1 MSSV
  const walletOwner = badgesDatabase.find(b => b.recipient.toLowerCase() === recipientAddr.toLowerCase() && !b.isRevoked);
  if (walletOwner) {
    showToast(`LỖI REVERT: WalletAlreadyLinked() — Ví ${recipientAddr.substring(0, 8)}... đã được liên kết với sinh viên "${walletOwner.studentName}" (${walletOwner.studentId})!`, "error");
    return;
  }

  // Quy tắc R-S: StudentAlreadyRegistered — 1 MSSV chỉ được đăng ký 1 ví on-chain
  const studentWithWallet = badgesDatabase.find(b => b.studentId.toLowerCase() === studentId.toLowerCase() && !b.isRevoked);
  if (studentWithWallet) {
    showToast(`LỖI REVERT: StudentAlreadyRegistered() — MSSV "${studentId}" đã liên kết ví ${studentWithWallet.recipient.substring(0, 8)}... Mỗi sinh viên chỉ được dùng 1 ví on-chain!`, "error");
    return;
  }

  // Quy tắc R-D: DuplicateBadgeType — không cấp 2 huy hiệu cùng danh mục cho 1 sinh viên
  const dupType = badgesDatabase.find(b => b.studentId.toLowerCase() === studentId.toLowerCase() && b.badgeType === type && !b.isRevoked);
  if (dupType) {
    showToast(`LỖI REVERT: DuplicateBadgeType() — MSSV "${studentId}" đã có huy hiệu #${dupType.tokenId} thuộc cùng danh mục này!`, "error");
    return;
  }

  // Quy tắc R2: SoldOut — hạn mức đợt khen thưởng
  if (badgesDatabase.length >= 50) {
    showToast("LỖI REVERT: SoldOut() — Đã đạt hạn mức 50 huy hiệu của đợt khen thưởng này!", "error");
    return;
  }

  const newId = badgesDatabase.length + 1;
  const now = new Date();
  const timeString = `${now.toLocaleDateString("vi-VN")}, ${now.toLocaleTimeString("vi-VN")}`;

  const newBadge = {
    tokenId: newId,
    badgeType: type,
    studentName: studentName,
    studentId: studentId,
    recipient: recipientAddr,
    issuedAt: timeString,
    isRevoked: false,
    revokeReason: ""
  };

  badgesDatabase.push(newBadge);

  showToast(`✅ Đã phát hành thành công Huy hiệu HUE #${newId} cho sinh viên ${studentName}!`, "success");
  
  renderAllBadges();
  renderStudentGallery();
  updateStats();

  document.getElementById("inputStudentName").value = "";
  document.getElementById("inputStudentId").value = "";
  generateRandomWallet();
}

// --- 7. SỔ CÁI VĂN BẰNG ĐÃ PHÁT HÀNH ---
function renderAllBadges() {
  const tbody = document.getElementById("issuedBadgesList");
  if (!tbody) return;

  tbody.innerHTML = "";
  badgesDatabase.forEach(badge => {
    const badgeInfo = BADGE_TYPES[badge.badgeType] || { title: "Danh hiệu", icon: "🎖️" };
    const shortAddr = `${badge.recipient.substring(0, 6)}...${badge.recipient.substring(badge.recipient.length - 4)}`;
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="padding: 10px; font-weight: 700; color: var(--gold);">#${badge.tokenId}</td>
      <td style="padding: 10px;">
        <span style="font-size: 1.1rem; margin-right: 6px;">${badgeInfo.icon}</span>
        <strong>${badgeInfo.title}</strong>
      </td>
      <td style="padding: 10px;">
        ${badge.studentName} <br>
        <small style="color: var(--text-dim); font-family: monospace;">MSSV: ${badge.studentId}</small>
      </td>
      <td style="padding: 10px; font-family: monospace; color: var(--primary); font-weight: 600;">${shortAddr}</td>
      <td style="padding: 10px; font-size: 0.8rem; color: var(--text-dim);">${badge.issuedAt}</td>
      <td style="padding: 10px;">
        ${badge.isRevoked 
          ? `<span class="badge-tag" style="background: var(--rose-bg); color: var(--rose); border-color: var(--rose-border);">Đã thu hồi (${badge.revokeReason})</span>`
          : `<span class="badge-tag">Hợp lệ (Active)</span>`
        }
      </td>
      <td style="padding: 10px;">
        ${!badge.isRevoked ? `
          <button class="btn-outline" style="padding: 4px 10px; font-size: 0.75rem; color: var(--rose); border-color: var(--rose-border);" onclick="handleRevoke(${badge.tokenId})">
            Thu hồi
          </button>
        ` : `<span style="font-size: 0.75rem; color: var(--text-dim);">Đã hủy</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });

  const countPill = document.getElementById("badgeCountPill");
  if (countPill) countPill.innerText = `${badgesDatabase.length} bản ghi`;
}

// --- 8. THU HỒI HUY HIỆU KHI CÓ KỶ LUẬT (REVOKE BADGE) ---
function handleRevoke(tokenId) {
  const reason = prompt("Nhập số quyết định kỷ luật của Hội đồng trường (Ví dụ: QĐ-124/ĐHH):", "Vi phạm quy chế học vụ");
  if (!reason) return;

  const b = badgesDatabase.find(x => x.tokenId === tokenId);
  if (b) {
    b.isRevoked = true;
    b.revokeReason = reason;
    showToast(`⚠️ Đã thiêu hủy (Burn) & thu hồi văn bằng #${tokenId} trên blockchain Đại học Huế!`, "error");
    renderAllBadges();
    renderStudentGallery();
    updateStats();
  }
}

// --- 9. HỆ THỐNG XÁC THỰC SINH VIÊN ---

// Cơ sở dữ liệu tài khoản sinh viên (mô phỏng — thực tế nối API trường)
const STUDENT_ACCOUNTS = {
  "23K4300014": { password: "hue@2026", name: "Phan Thị Yến Nhi" },
  "23K4300028": { password: "hue@2026", name: "Nguyễn Quốc Bảo" },
  "23K4300085": { password: "hue@2026", name: "Lê Thị Diệu Linh" },
};

let currentLoggedStudentId = null; // null = chưa đăng nhập

function handleStudentAuthLogin(e) {
  e.preventDefault();
  const mssv     = document.getElementById("loginMssv").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorBox = document.getElementById("loginErrorMsg");
  const errorTxt = document.getElementById("loginErrorText");

  const account = STUDENT_ACCOUNTS[mssv];

  // Kiểm tra tài khoản
  if (!account || account.password !== password) {
    errorTxt.innerText = "MSSV hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
    errorBox.style.display = "block";
    document.getElementById("loginPassword").value = "";
    return;
  }

  errorBox.style.display = "none";
  currentLoggedStudentId = mssv;

  // Tìm dữ liệu on-chain
  const badgeRecord = badgesDatabase.find(b =>
    b.studentId.toLowerCase() === mssv.toLowerCase() && !b.isRevoked
  );

  // Cập nhật thông tin hồ sơ
  document.getElementById("loggedStudentName").innerText  = account.name;
  document.getElementById("loggedStudentId").innerText    = mssv;
  document.getElementById("loggedStudentAddress").innerText =
    badgeRecord ? badgeRecord.recipient : "Chưa liên kết ví on-chain";

  const badgeCount = badgesDatabase.filter(
    b => b.studentId.toLowerCase() === mssv.toLowerCase() && !b.isRevoked
  ).length;
  document.getElementById("loggedStudentBadgeCountTag").innerText =
    `${badgeCount} Huy hiệu`;

  // Chuyển sang dashboard
  document.getElementById("studentLoginScreen").style.display  = "none";
  document.getElementById("studentDashboard").style.display    = "block";

  renderStudentGallery();
  showToast(`✅ Chào mừng ${account.name} đã đăng nhập thành công!`, "success");
}

function handleStudentLogout() {
  currentLoggedStudentId = null;
  document.getElementById("formStudentLogin").reset();
  document.getElementById("loginErrorMsg").style.display = "none";
  document.getElementById("studentLoginScreen").style.display = "block";
  document.getElementById("studentDashboard").style.display   = "none";
  showToast("Đã đăng xuất khỏi tài khoản sinh viên.", "info");
}

function fillDemoLogin(mssv, password) {
  document.getElementById("loginMssv").value     = mssv;
  document.getElementById("loginPassword").value = password;
  document.getElementById("loginErrorMsg").style.display = "none";
}

function togglePasswordVisibility() {
  const input = document.getElementById("loginPassword");
  const btn   = document.getElementById("btnTogglePwd");
  if (input.type === "password") {
    input.type = "text";
    btn.innerText = "🙈";
  } else {
    input.type = "password";
    btn.innerText = "👁️";
  }
}



function copyStudentResumeLink() {
  const mssv = document.getElementById("loggedStudentId").innerText;
  const link = `https://hue.edu.vn/sbt-verify/${mssv}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link);
  }
  showToast(`📋 Đã sao chép link chứng thực CV: ${link}`, "success");
}

// --- 10. BỘ SƯU TẬP HUY HIỆU SINH VIÊN ---
function renderStudentGallery() {
  const container = document.getElementById("studentBadgesGallery");
  if (!container) return;

  // Chưa đăng nhập thì không render
  if (!currentLoggedStudentId) return;

  container.innerHTML = "";

  const myBadges = badgesDatabase.filter(b => 
    b.studentId.toLowerCase() === currentLoggedStudentId.toLowerCase() ||
    b.recipient.toLowerCase() === currentLoggedStudentId.toLowerCase()
  );

  if (myBadges.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
        <div style="font-size: 40px; margin-bottom: 12px;">🎖️</div>
        <h4 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 6px; font-weight: 700;">Sinh viên chưa có Huy hiệu Thành tích nào</h4>
        <p style="font-size: 0.85rem; color: var(--text-dim); max-width: 500px; margin: 0 auto 16px;">
          Tài khoản này chưa có dữ liệu khen thưởng trên blockchain Đại học Huế. Bạn có thể sang phân hệ Ban Quản Trị để cấp phát thử nghiệm.
        </p>
        <button class="btn-outline" onclick="showTab('issuer')">🏛️ Chuyển sang Cổng Quản Trị</button>
      </div>
    `;
    return;
  }

  myBadges.forEach(badge => {
    const info = BADGE_TYPES[badge.badgeType] || { title: "Danh hiệu", icon: "🎖️", desc: "" };
    const card = document.createElement("div");
    card.className = `badge-item-card ${badge.isRevoked ? 'revoked' : ''}`;
    
    card.innerHTML = `
      <div>
        <div class="badge-card-header">
          <div class="badge-card-icon">${info.icon}</div>
          <div class="badge-card-info">
            <h3>${info.title}</h3>
            <p>Đại học Huế • Token #${badge.tokenId}</p>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.45;">${info.desc}</p>
        
        <div style="background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 0.8rem; margin-bottom: 12px;">
          <div style="color: var(--text-main);">👤 <strong>Sinh viên:</strong> ${badge.studentName} (${badge.studentId})</div>
          <div style="margin-top: 4px; color: var(--text-muted);">📅 <strong>Thời điểm cấp:</strong> ${badge.issuedAt}</div>
          <div style="margin-top: 4px; font-family: monospace; color: var(--primary); font-weight: 600; word-break: break-all;">🔑 ${badge.recipient}</div>
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 0.75rem; color: var(--emerald); font-weight: 600;">✓ Verified by Hue University</span>
          <span style="font-size: 0.72rem; color: var(--rose); font-weight: 700; background: var(--rose-bg); padding: 2px 8px; border-radius: var(--radius-full); border: 1px solid var(--rose-border);">🔒 NON-TRANSFERABLE</span>
        </div>

        <div class="badge-card-actions">
          <button class="btn-primary" style="flex: 1; font-size: 0.8rem; padding: 7px 10px; background: var(--rose-bg); border: 1px solid var(--rose-border); color: var(--rose); font-weight: 600;" onclick="triggerSimulateTransfer(${badge.tokenId})">
            ⛔ Chuyển Nhượng Token
          </button>
          <button class="btn-outline" style="font-size: 0.8rem; padding: 7px 12px;" onclick="viewBadgeOnVerifier(${badge.tokenId})">
            🔍 Tra cứu
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- 11. MÔ PHỎNG LỖI TỪ CHỐI CHUYỂN NHƯỢNG (SOULBOUND REVERT) ---
function triggerSimulateTransfer(tokenId) {
  const modal = document.getElementById("revertModalOverlay");
  if (modal) {
    modal.classList.add("active");
  }
}

function closeRevertModal() {
  const modal = document.getElementById("revertModalOverlay");
  if (modal) {
    modal.classList.remove("active");
  }
}

// --- 12. CỔNG XÁC MINH DOANH NGHIỆP ---
function handleVerifyBadge() {
  const query = document.getElementById("inputVerifyQuery").value.trim();
  const body = document.getElementById("verifyResultBody");
  const statusTag = document.getElementById("verifyBadgeStatusTag");

  if (!query) {
    showToast("Vui lòng nhập Token ID hoặc Địa chỉ ví để tra cứu!", "info");
    return;
  }

  let badge = null;
  if (!isNaN(query)) {
    badge = badgesDatabase.find(b => b.tokenId === parseInt(query));
  } else {
    badge = badgesDatabase.find(b => b.recipient.toLowerCase() === query.toLowerCase());
  }

  if (!badge) {
    statusTag.className = "badge-tag mode-badge";
    statusTag.style.color = "#f43f5e";
    statusTag.style.borderColor = "rgba(244, 63, 94, 0.4)";
    statusTag.innerText = "Không tìm thấy";

    body.innerHTML = `
      <div class="verify-status-banner invalid">
        <span style="font-size: 24px;">❌</span>
        <div>
          <strong>KHÔNG TÌM THẤY DỮ LIỆU ON-CHAIN</strong><br>
          <small>Địa chỉ ví hoặc Token ID này chưa từng được Đại học Huế phát hành chứng nhận.</small>
        </div>
      </div>
    `;
    return;
  }

  const info = BADGE_TYPES[badge.badgeType];

  if (badge.isRevoked) {
    statusTag.className = "badge-tag mode-badge";
    statusTag.style.color = "#f43f5e";
    statusTag.style.borderColor = "rgba(244, 63, 94, 0.4)";
    statusTag.innerText = "Văn bằng đã bị thu hồi";

    body.innerHTML = `
      <div class="verify-status-banner invalid">
        <span style="font-size: 24px;">⚠️</span>
        <div>
          <strong>DANH HIỆU ĐÃ BỊ THU HỒI BỞI ĐẠI HỌC HUẾ</strong><br>
          <small>Căn cứ: ${badge.revokeReason}</small>
        </div>
      </div>
      <table class="verify-meta-table">
        <tr><td>Mã Token ID:</td><td>#${badge.tokenId}</td></tr>
        <tr><td>Danh hiệu:</td><td>${info.title}</td></tr>
        <tr><td>Sinh viên:</td><td>${badge.studentName} (MSSV: ${badge.studentId})</td></tr>
        <tr><td>Địa chỉ ví:</td><td><code>${badge.recipient}</code></td></tr>
        <tr><td>Thời điểm cấp:</td><td>${badge.issuedAt}</td></tr>
      </table>
    `;
  } else {
    statusTag.className = "badge-tag";
    statusTag.innerText = "Xác Thực Hợp Lệ 100%";

    body.innerHTML = `
      <div class="verify-status-banner valid">
        <span style="font-size: 24px;">✅</span>
        <div>
          <strong>CHỨNG NHẬN CHÍNH THỨC — ĐẠI HỌC HUẾ</strong><br>
          <small>Văn bằng số được cấp trực tiếp trên mạng Sepolia Testnet, có giá trị xác thực vĩnh cửu.</small>
        </div>
      </div>

      <div style="text-align: center; margin: 15px 0;">
        <span style="font-size: 48px;">${info.icon}</span>
        <h3 style="font-size: 1.15rem; margin-top: 6px;">${info.title}</h3>
      </div>

      <table class="verify-meta-table">
        <tr><td>Token ID:</td><td style="color: var(--gold); font-weight: 700;">#${badge.tokenId}</td></tr>
        <tr><td>Sinh viên vinh danh:</td><td><strong>${badge.studentName}</strong></td></tr>
        <tr><td>Mã sinh viên (MSSV):</td><td><code>${badge.studentId}</code></td></tr>
        <tr><td>Địa chỉ ví nhận:</td><td><code style="color: var(--primary); font-weight: 600;">${badge.recipient}</code></td></tr>
        <tr><td>Thời điểm cấp on-chain:</td><td>${badge.issuedAt}</td></tr>
        <tr><td>Đơn vị cấp phát:</td><td><strong>Đại học Huế (HUE)</strong></td></tr>
        <tr><td>Cơ chế chuyển nhượng:</td><td><span style="color: var(--rose); font-weight: 700;">🔒 Bất khả chuyển nhượng (Soulbound)</span></td></tr>
        <tr><td>Smart Contract:</td><td><code>ProjectCore.sol (ERC-721 v5)</code></td></tr>
      </table>
    `;
  }
}

function loadSampleAddress() {
  document.getElementById("inputVerifyQuery").value = "0x71C26071493b86EFA7AC41b38f828a2aC41Ea47B";
  handleVerifyBadge();
}

function viewBadgeOnVerifier(tokenId) {
  showTab('verify');
  document.getElementById("inputVerifyQuery").value = tokenId.toString();
  handleVerifyBadge();
}

// --- 13. CẬP NHẬT CHỈ SỐ ---
function updateStats() {
  const activeBadges = badgesDatabase.filter(b => !b.isRevoked);
  const totalMinted = badgesDatabase.length;
  
  const elTotal = document.getElementById("statTotalMinted");
  if (elTotal) elTotal.innerText = `${totalMinted} / 50 HUE-SBT`;

  const elUnique = document.getElementById("statUniqueRecipients");
  if (elUnique) elUnique.innerText = `${activeBadges.length} Sinh viên`;
}

// --- 14. KẾT NỐI VÍ METAMASK ---
async function connectMetaMask() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      userAddress = accounts[0];
      isWeb3Connected = true;

      const short = `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`;
      document.getElementById("walletBtnText").innerText = short;
      document.getElementById("netStatusTag").innerText = "🌐 Sepolia Connected";
      document.getElementById("netStatusTag").style.background = "rgba(16, 185, 129, 0.2)";
      document.getElementById("netStatusTag").style.color = "#34d399";
      
      showToast(`Đã kết nối ví Ban Quản trị: ${short}`, "success");
    } catch (err) {
      console.warn("Lỗi kết nối MetaMask:", err);
      showToast("Không thể kết nối ví MetaMask.", "error");
    }
  } else {
    showToast("Đang chạy trên môi trường Web3 Simulator của Đại học Huế!", "info");
  }
}

// --- 15. THÔNG BÁO TOAST ---
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "❌";

  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
