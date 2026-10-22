/**
 * shared.js — Dữ liệu & tiện ích dùng chung giữa các trang (localStorage)
 */

const BADGE_TYPES = {
  1:  { title: "Sinh viên 5 tốt tiêu biểu cấp Đại học Huế",       icon: "🏆", desc: "Đạt thành tích Xuất sắc trong 5 tiêu chí: Đạo đức, Học tập, Thể lực, Tình nguyện, Hội nhập tốt." },
  2:  { title: "Thủ khoa tốt nghiệp Xuất sắc Khóa K58",           icon: "💡", desc: "Thành tích học tập Thủ khoa toàn khóa đào tạo với điểm học tập và rèn luyện xuất sắc dẫn đầu." },
  3:  { title: "Học bổng Khuyến tài Doanh nghiệp Bảo trợ",        icon: "🎖️", desc: "Sinh viên vượt khó đạt thành tích xuất sắc, được các tập đoàn tài chính/công nghệ bảo trợ." },
  4:  { title: "Giải Nhất NCKH Sinh viên HUE 2026",                icon: "🔬", desc: "Đề tài ứng dụng công nghệ Blockchain trong minh bạch hóa tài chính giáo dục công lập." },
  5:  { title: "Quán quân Cuộc thi Khởi nghiệp HUE Startup",      icon: "🚀", desc: "Dự án khởi nghiệp đổi mới sáng tạo xuất sắc nhất toàn Đại học Huế năm 2026." },
  6:  { title: "Giải Nhất Olympic Tin học & Công nghệ Web3",       icon: "💻", desc: "Giải Nhất cuộc thi Lập trình giải thuật và Ứng dụng Hợp đồng thông minh phân tán." },
  7:  { title: "Cán bộ Đoàn - Hội xuất sắc tiêu biểu HUE",       icon: "🌟", desc: "Thành tích đặc biệt xuất sắc trong công tác Đoàn và phong trào Thanh niên HUE 2024-2026." },
  8:  { title: "Chiến sĩ Tình nguyện Xuất sắc Mùa hè Xanh",      icon: "🎗️", desc: "Cống hiến nổi bật vì cộng đồng tại vùng cao, biên giới và hải đảo miền Trung." },
  9:  { title: "Huy hiệu Tôn vinh Hiến máu Nhân đạo (≥5 lần)",   icon: "🩸", desc: "Hiến máu tình nguyện cứu người liên tục từ 5 lần trở lên trong thời gian học tập." },
  10: { title: "Chứng chỉ Xuất sắc Kỹ sư Smart Contract ECO2432", icon: "📜", desc: "Hoàn thành xuất sắc khóa phát triển Smart Contract, vượt qua Gate Review và Audit bảo mật." }
};

const STUDENT_ACCOUNTS = {
  "23K4300014": { password: "hue@2026", name: "Phan Thị Yến Nhi" },
  "23K4300028": { password: "hue@2026", name: "Nguyễn Quốc Bảo" },
  "23K4300085": { password: "hue@2026", name: "Lê Thị Diệu Linh" },
};

const ADMIN_ACCOUNTS = {
  "admin.hue": { password: "admin@2026", displayName: "Hội đồng Khen thưởng — Đại học Huế" },
  "giam.doc":  { password: "admin@2026", displayName: "Ban Giám đốc Đại học Huế" },
};

const ENTERPRISE_ACCOUNTS = {
  "DN001": { password: "verify@2026", displayName: "FPT Software — Nhà tuyển dụng đối tác" },
  "DN002": { password: "verify@2026", displayName: "VNG Corporation — Nhà tuyển dụng đối tác" },
  "DN003": { password: "verify@2026", displayName: "Viettel Group — Đối tác học thuật" },
};

const DB_KEY = "hue_sbt_database";

const DEFAULT_DB = [
  { tokenId: 1, badgeType: 1, studentName: "Phan Thị Yến Nhi",  studentId: "23K4300014", recipient: "0x71C26071493b86EFA7AC41b38f828a2aC41Ea47B", issuedAt: "10/10/2026, 09:30:15", isRevoked: false, revokeReason: "" },
  { tokenId: 2, badgeType: 4, studentName: "Nguyễn Quốc Bảo",   studentId: "23K4300028", recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", issuedAt: "11/10/2026, 14:15:00", isRevoked: false, revokeReason: "" },
  { tokenId: 3, badgeType: 7, studentName: "Lê Thị Diệu Linh",  studentId: "23K4300085", recipient: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", issuedAt: "12/10/2026, 16:45:20", isRevoked: false, revokeReason: "" },
];

function loadDatabase() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) { saveDatabase(DEFAULT_DB); return DEFAULT_DB; }
    return JSON.parse(raw);
  } catch { return DEFAULT_DB; }
}

function saveDatabase(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Toast chung
function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity="0"; toast.style.transform="translateX(50px)"; setTimeout(() => toast.remove(), 300); }, 4000);
}

// Navbar chung
function renderPageNav(activePortal) {
  const labels = { admin: "Ban Quản Trị", student: "Cổng Sinh Viên", enterprise: "Cổng Doanh Nghiệp", contract: "Smart Contract" };
  const el = document.querySelector(".page-nav-breadcrumb");
  if (el) {
    el.innerHTML = `<a href="index.html">Trang chủ</a> <span>›</span> <strong>${labels[activePortal] || ""}</strong>`;
  }
}

// Toggle hiển thị mật khẩu
function togglePwd(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (btn) btn.innerText = "🙈";
  } else {
    input.type = "password";
    if (btn) btn.innerText = "👁️";
  }
}

// Modal cảnh báo Soulbound (chặn chuyển nhượng)
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

// ====================================================
// METAMASK WEB3 WALLET INTEGRATION
// ====================================================
let currentConnectedWallet = null;

function getConnectedWallet() {
  return currentConnectedWallet || sessionStorage.getItem("connected_wallet");
}

function formatAddress(addr) {
  if (!addr || addr.length < 10) return addr || "";
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}

async function connectMetaMask() {
  if (typeof window.ethereum === "undefined") {
    // Hiển thị modal hướng dẫn & bộ giả lập Web3
    showWalletModal();
    return null;
  }
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (accounts && accounts.length > 0) {
      currentConnectedWallet = accounts[0];
      sessionStorage.setItem("connected_wallet", currentConnectedWallet);
      sessionStorage.removeItem("is_simulated_wallet");
      updateAllWalletButtons();
      showToast(`🦊 Đã kết nối ví MetaMask thật: ${formatAddress(currentConnectedWallet)}`, "success");
      
      // Kích hoạt sự kiện thông báo cho các trang
      window.dispatchEvent(new CustomEvent("walletConnected", { detail: { address: currentConnectedWallet } }));
      return currentConnectedWallet;
    }
  } catch (err) {
    console.warn("Lỗi kết nối MetaMask:", err);
    showToast("Người dùng đã hủy hoặc từ chối kết nối ví.", "error");
    return null;
  }
}

// Kết nối ví thủ công / giả lập
function connectManualWallet(addr) {
  if (!addr || !addr.startsWith("0x") || addr.length < 10) {
    showToast("Địa chỉ ví không hợp lệ (phải bắt đầu bằng 0x...).", "error");
    return;
  }
  currentConnectedWallet = addr;
  sessionStorage.setItem("connected_wallet", currentConnectedWallet);
  sessionStorage.setItem("is_simulated_wallet", "true");
  updateAllWalletButtons();
  closeWalletModal();
  showToast(`🦊 Đã kích hoạt ví Web3: ${formatAddress(currentConnectedWallet)}`, "success");
  window.dispatchEvent(new CustomEvent("walletConnected", { detail: { address: currentConnectedWallet } }));
}

function handleWalletBtnClick() {
  const wallet = getConnectedWallet();
  if (wallet) {
    const isSim = sessionStorage.getItem("is_simulated_wallet") === "true";
    const label = isSim ? "Ví Web3 (Giả lập / Nhập tay)" : "Ví MetaMask (Tiện ích)";
    if (confirm(`Đang kết nối: ${label}\nĐịa chỉ: ${wallet}\n\nBạn có muốn ngắt kết nối hoặc đổi ví khác không?`)) {
      currentConnectedWallet = null;
      sessionStorage.removeItem("connected_wallet");
      sessionStorage.removeItem("is_simulated_wallet");
      updateAllWalletButtons();
      showToast("Đã ngắt kết nối ví.", "info");
      window.dispatchEvent(new CustomEvent("walletDisconnected"));
    }
  } else {
    connectMetaMask();
  }
}

// Modal hướng dẫn & Chọn ví giả lập
function showWalletModal() {
  let modal = document.getElementById("walletConnectHelpModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "walletConnectHelpModal";
    modal.className = "modal-overlay active";
    modal.onclick = (e) => { if (e.target === modal) closeWalletModal(); };
    modal.innerHTML = `
      <div class="modal-box" style="max-width: 580px; text-align: left; padding: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:26px;">🦊</span>
            <div>
              <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin:0;">Kết Nối Ví Web3 &amp; MetaMask</h3>
              <span style="font-size:0.78rem; color:var(--text-dim);">Hệ thống văn bằng số Đại học Huế</span>
            </div>
          </div>
          <button onclick="closeWalletModal()" style="background:none; border:none; font-size:20px; cursor:pointer; color:var(--text-dim);">✕</button>
        </div>

        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:18px; font-size:0.84rem; line-height:1.55;">
          <div style="font-weight:700; color:#b45309; margin-bottom:4px;">⚠️ Tại sao trình duyệt báo "Chưa cài đặt MetaMask"?</div>
          <ul style="padding-left:18px; margin:0; color:#78350f;">
            <li style="margin-bottom:6px;">
              <strong>Nếu bạn đang mở file trực tiếp (dạng <code>file:///C:...</code>):</strong>
              Trình duyệt Chrome / Edge mặc định <strong>chặn tiện ích mở rộng</strong> chạy trên file offline. 
              <div style="margin-top:4px; font-size:0.8rem; background:#fff; padding:6px 10px; border-radius:4px; border:1px solid #fed7aa;">
                👉 <strong>Cách khắc phục 30 giây:</strong> Mở <code style="color:var(--primary);">chrome://extensions</code> (hoặc <code style="color:var(--primary);">edge://extensions</code>) ➔ Bấm <strong>Chi tiết (Details)</strong> của MetaMask ➔ Bật công tắc <strong>"Cho phép truy cập vào các URL tệp" (Allow access to file URLs)</strong> ➔ Tải lại trang này!
              </div>
            </li>
            <li>
              <strong>Nếu máy bạn chưa từng cài MetaMask:</strong> 
              Bạn có thể <a href="https://metamask.io/download/" target="_blank" style="color:var(--primary); font-weight:700; text-decoration:underline;">Tải MetaMask miễn phí tại metamask.io</a>.
            </li>
          </ul>
        </div>

        <div style="border-top:1px dashed var(--border-color); padding-top:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <h4 style="font-size:0.95rem; font-weight:800; color:var(--primary); margin:0;">
              ⚡ Dùng Ngay "Ví Web3 Giả Lập" (Không cần Extension)
            </h4>
            <span class="badge-tag" style="background:var(--emerald-bg); color:var(--emerald); border-color:var(--emerald-border);">Sẵn sàng ngay</span>
          </div>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px; line-height:1.5;">
            Bạn có thể nhập địa chỉ ví cá nhân bất kỳ (hoặc chọn ví sinh viên có sẵn) để trải nghiệm toàn bộ tính năng Web3 ngay lập tức:
          </p>

          <div style="display:flex; gap:8px; margin-bottom:12px;">
            <input type="text" id="inputManualWallet" class="form-input" placeholder="Nhập địa chỉ ví của bạn (0x...)" style="font-family:monospace; font-size:0.85rem; flex:1;" value="0x71C26071493b86EFA7AC41b38f828a2aC41Ea47B">
            <button class="btn-primary" style="font-size:0.85rem; padding:8px 16px; white-space:nowrap;" onclick="connectManualWallet(document.getElementById('inputManualWallet').value.trim())">
              Kết Nối Ví Này
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:6px;">
            <span style="font-size:0.78rem; color:var(--text-dim); font-weight:600;">Chọn nhanh ví mẫu sinh viên để test:</span>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
              <button class="btn-outline" style="font-size:0.75rem; padding:6px 8px; text-align:left;" onclick="connectManualWallet('0x71C26071493b86EFA7AC41b38f828a2aC41Ea47B')">
                🎓 <strong>Phan Thị Yến Nhi</strong><br><small style="color:var(--text-dim); font-family:monospace;">0x71C2...a47B</small>
              </button>
              <button class="btn-outline" style="font-size:0.75rem; padding:6px 8px; text-align:left;" onclick="connectManualWallet('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')">
                🎓 <strong>Nguyễn Quốc Bảo</strong><br><small style="color:var(--text-dim); font-family:monospace;">0x3C44...93BC</small>
              </button>
              <button class="btn-outline" style="font-size:0.75rem; padding:6px 8px; text-align:left;" onclick="connectManualWallet('0x90F79bf6EB2c4f870365E785982E1f101E93b906')">
                🎓 <strong>Lê Thị Diệu Linh</strong><br><small style="color:var(--text-dim); font-family:monospace;">0x90F7...b906</small>
              </button>
              <button class="btn-outline" style="font-size:0.75rem; padding:6px 8px; text-align:left;" onclick="createAndConnectRandomWallet()">
                🎲 <strong>Tạo Ví Mới Ngẫu Nhiên</strong><br><small style="color:var(--text-dim);">Sinh ngẫu nhiên 0x...</small>
              </button>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:20px; border-top:1px solid var(--border-color); padding-top:12px;">
          <button class="btn-outline" onclick="closeWalletModal()" style="font-size:0.85rem; padding:6px 16px;">Đóng</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    modal.classList.add("active");
  }
}

function closeWalletModal() {
  const modal = document.getElementById("walletConnectHelpModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function createAndConnectRandomWallet() {
  const hex = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) {
    addr += hex[Math.floor(Math.random() * hex.length)];
  }
  connectManualWallet(addr);
}

function updateAllWalletButtons() {
  const wallet = getConnectedWallet();
  const btns = document.querySelectorAll(".btn-connect-metamask");
  btns.forEach(btn => {
    if (wallet) {
      btn.innerHTML = `🦊 <code>${formatAddress(wallet)}</code>`;
      btn.classList.add("wallet-connected");
      btn.title = `Ví MetaMask: ${wallet} (Bấm để ngắt kết nối)`;
    } else {
      btn.innerHTML = `🦊 Kết nối MetaMask`;
      btn.classList.remove("wallet-connected");
      btn.title = `Kết nối ví Web3 cá nhân`;
    }
  });
}

// Tự động kiểm tra ví khi load trang
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Kiểm tra nếu ví đã được cấp quyền trước đó
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts && accounts.length > 0) {
        currentConnectedWallet = accounts[0];
        sessionStorage.setItem("connected_wallet", currentConnectedWallet);
      }
    } catch (e) {
      // Bỏ qua lỗi ngầm
    }
  }
  updateAllWalletButtons();
});

// Lắng nghe sự kiện chuyển tài khoản từ MetaMask
if (typeof window.ethereum !== "undefined") {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts && accounts.length > 0) {
      currentConnectedWallet = accounts[0];
      sessionStorage.setItem("connected_wallet", currentConnectedWallet);
      showToast(`🦊 Đã chuyển sang ví: ${formatAddress(accounts[0])}`, "info");
      window.dispatchEvent(new CustomEvent("walletConnected", { detail: { address: currentConnectedWallet } }));
    } else {
      currentConnectedWallet = null;
      sessionStorage.removeItem("connected_wallet");
      showToast("Đã ngắt kết nối ví MetaMask.", "info");
      window.dispatchEvent(new CustomEvent("walletDisconnected"));
    }
    updateAllWalletButtons();
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}


