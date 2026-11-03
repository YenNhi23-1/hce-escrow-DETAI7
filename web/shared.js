/**
 * shared.js — Dữ liệu & tiện ích dùng chung giữa các trang (localStorage)
 */

const BADGE_GROUPS = {
  degree: "🎓 Văn Bằng Tốt Nghiệp & Học Vị",
  award: "🏆 Danh Hiệu & Giải Thưởng Vinh Danh",
  cert: "📜 Chứng Chỉ Chuyên Môn & Kỹ Năng",
  service: "🌟 Hoạt Động Đoàn - Hội & Cống Hiến Xã Hội",
  custom: "✍️ Tùy Chỉnh (Tự Điền Văn Bằng Mới)"
};

const BADGE_TYPES = {
  // --- Nhóm 1: Văn Bằng Tốt Nghiệp & Học Vị ---
  1:  { group: "degree", title: "Bằng Cử Nhân Xuất Sắc — Đại Học Huế", icon: "🎓", desc: "Tốt nghiệp loại Xuất sắc, hoàn thành toàn diện chương trình đào tạo chính quy." },
  2:  { group: "degree", title: "Bằng Kỹ Sư Công Nghệ Thông Tin & Web3", icon: "💻", desc: "Tốt nghiệp Kỹ sư CNTT chuyên sâu Kiến trúc Hợp đồng thông minh và Mạng phân tán." },
  3:  { group: "degree", title: "Bằng Bác Sĩ Đa Khoa — Trường ĐH Y Dược Huế", icon: "🩺", desc: "Tốt nghiệp chương trình đào tạo Bác sĩ Y khoa chính quy chuẩn mực của Đại học Huế." },
  4:  { group: "degree", title: "Bằng Thạc Sĩ Khoa Học & Dữ Liệu Lớn", icon: "📚", desc: "Bảo vệ thành công luận văn Thạc sĩ chuyên ngành Trí tuệ nhân tạo và Khoa học dữ liệu." },
  5:  { group: "degree", title: "Thủ Khoa Tốt Nghiệp Toàn Khóa K58", icon: "💡", desc: "Thành tích học tập Thủ khoa toàn khóa đào tạo với điểm rèn luyện và GPA dẫn đầu." },

  // --- Nhóm 2: Danh Hiệu & Giải Thưởng ---
  6:  { group: "award", title: "Sinh Viên 5 Tốt Tiêu Biểu Cấp Đại Học Huế", icon: "🏆", desc: "Đạt chuẩn 5 tiêu chí: Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt, Hội nhập tốt." },
  7:  { group: "award", title: "Giải Nhất Nghiên Cứu Khoa Học Sinh Viên HUE 2026", icon: "🔬", desc: "Đề tài ứng dụng công nghệ Blockchain trong minh bạch hóa tài chính giáo dục công lập." },
  8:  { group: "award", title: "Quán Quân Cuộc Thi Khởi Nghiệp HUE Startup", icon: "🚀", desc: "Dự án khởi nghiệp đổi mới sáng tạo xuất sắc nhất toàn Đại học Huế năm 2026." },
  9:  { group: "award", title: "Giải Nhất Olympic Tin Học & Lập Trình Web3", icon: "🥇", desc: "Giải Nhất kỳ thi Lập trình giải thuật và Ứng dụng Hợp đồng thông minh phân tán." },
  10: { group: "award", title: "Học Bổng Khuyến Tài Doanh Nghiệp Bảo Trợ", icon: "🎖️", desc: "Sinh viên vượt khó đạt thành tích xuất sắc, được tập đoàn tài chính/công nghệ bảo trợ." },

  // --- Nhóm 3: Chứng Chỉ Chuyên Môn & Kỹ Năng ---
  11: { group: "cert", title: "Chứng Chỉ Kỹ Sư Smart Contract ECO2432", icon: "📜", desc: "Hoàn thành xuất sắc khóa phát triển Smart Contract, vượt qua Gate Review và Security Audit." },
  12: { group: "cert", title: "Chứng Chỉ Năng Lực Ngoại Ngữ IELTS Academic 7.5+", icon: "🌐", desc: "Đạt năng lực tiếng Anh học thuật chuẩn quốc tế phục vụ nghiên cứu và hội nhập." },
  13: { group: "cert", title: "Chứng Chỉ Chuyên Gia Bảo Mật Blockchain & Web3", icon: "🛡️", desc: "Đạt chứng nhận năng lực rà quét lỗ hổng Reentrancy, Overflow và Access Control." },
  14: { group: "cert", title: "Chứng Chỉ Nghiên Cứu & Công Bố Quốc Tế (Scopus)", icon: "📑", desc: "Tác giả chính có bài báo khoa học được chấp nhận đăng trên tạp chí uy tín quốc tế." },

  // --- Nhóm 4: Đoàn - Hội & Cống Hiến ---
  15: { group: "service", title: "Cán Bộ Đoàn - Hội Xuất Sắc Tiêu Biểu HUE", icon: "🌟", desc: "Thành tích đặc biệt xuất sắc trong công tác Đoàn và phong trào Thanh niên HUE 2024-2026." },
  16: { group: "service", title: "Chiến Sĩ Tình Nguyện Xuất Sắc Mùa Hè Xanh", icon: "🎗️", desc: "Cống hiến nổi bật vì cộng đồng tại vùng cao, biên giới và hải đảo miền Trung." },
  17: { group: "service", title: "Huy Hiệu Tôn Vinh Hiến Máu Nhân Đạo (≥5 lần)", icon: "🩸", desc: "Hiến máu tình nguyện cứu người liên tục từ 5 lần trở lên trong thời gian học tập." },

  // --- Nhóm 5: Tùy Chỉnh Tự Điền ---
  999: { group: "custom", title: "✍️ [TỰ ĐIỀN] Nhập Văn Bằng / Danh Hiệu Tùy Chỉnh...", icon: "✨", desc: "Tự do nhập tên văn bằng, chọn biểu tượng và mô tả theo quyết định khen thưởng của trường." }
};

function getBadgeInfo(badgeOrId) {
  if (!badgeOrId) return { title: "Văn bằng thành tích", icon: "🎖️", desc: "" };
  if (typeof badgeOrId === "object") {
    if (badgeOrId.customTitle) {
      return {
        title: badgeOrId.customTitle,
        icon: badgeOrId.customIcon || "📜",
        desc: badgeOrId.customDesc || "Văn bằng / Danh hiệu do Hội đồng Đại học Huế cấp phát."
      };
    }
    const typeId = badgeOrId.badgeType;
    return BADGE_TYPES[typeId] || { title: "Văn bằng thành tích", icon: "🎖️", desc: "Thành tích học thuật Đại học Huế." };
  }
  return BADGE_TYPES[badgeOrId] || { title: "Văn bằng thành tích", icon: "🎖️", desc: "" };
}

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
  return currentConnectedWallet;
}

function formatAddress(addr) {
  if (!addr || addr.length < 12) return addr || "";
  return `${addr.substring(0, 7)}...${addr.substring(addr.length - 5)}`;
}

function getEthereumProvider() {
  if (typeof window.ethereum !== "undefined") {
    // Nếu có nhiều ví Web3 cùng cài đặt (MetaMask, Phantom, OKX...)
    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      const mm = window.ethereum.providers.find(p => p.isMetaMask);
      if (mm) return mm;
    }
    return window.ethereum;
  }
  if (window.web3 && window.web3.currentProvider) {
    return window.web3.currentProvider;
  }
  return null;
}

let listenersAttached = false;
function setupProviderListeners(provider) {
  if (!provider || !provider.on || listenersAttached) return;
  listenersAttached = true;

  provider.on("accountsChanged", (accounts) => {
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

  provider.on("chainChanged", () => {
    window.location.reload();
  });
}

async function connectMetaMask(forcePopup = true) {
  let provider = getEthereumProvider();
  if (!provider) {
    // Đợi 300ms phòng trường hợp Extension cần thêm thời gian inject
    await new Promise(r => setTimeout(r, 300));
    provider = getEthereumProvider();
  }

  if (!provider) {
    // Hiển thị modal hướng dẫn chuẩn xác theo môi trường hiện tại
    showWalletModal();
    return null;
  }

  try {
    let accounts = [];

    // Luôn yêu cầu mở cửa sổ MetaMask popup để người dùng trực tiếp chọn tài khoản (EIP-2255)
    if (forcePopup) {
      try {
        const permissions = await provider.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }]
        });
        const accountsCaveat = permissions?.[0]?.caveats?.find(c => c.type === "filterResponse" || c.name === "exposedAccounts");
        if (accountsCaveat && Array.isArray(accountsCaveat.value)) {
          accounts = accountsCaveat.value;
        } else {
          accounts = await provider.request({ method: "eth_accounts" });
        }
      } catch (permErr) {
        if (permErr.code === 4001) {
          showToast("Bạn đã đóng cửa sổ chọn ví MetaMask.", "info");
          return null;
        }
        // Nếu trình duyệt hoặc extension cũ không hỗ trợ requestPermissions, dùng eth_requestAccounts
        accounts = await provider.request({ method: "eth_requestAccounts" });
      }
    } else {
      accounts = await provider.request({ method: "eth_requestAccounts" });
    }

    if (accounts && accounts.length > 0) {
      currentConnectedWallet = accounts[0];
      sessionStorage.setItem("connected_wallet", currentConnectedWallet);
      sessionStorage.removeItem("is_simulated_wallet");

      // Tự động kiểm tra và chuyển sang mạng Sepolia (ChainID: 11155111 = 0xaa36a7)
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (switchError) {
        // Nếu mạng Sepolia chưa được thêm vào ví
        if (switchError.code === 4902) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: { name: 'SepoliaETH', symbol: 'SEP', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
          } catch (addError) {
            console.warn("Không thể thêm mạng Sepolia:", addError);
          }
        }
      }

      setupProviderListeners(provider);
      updateAllWalletButtons();
      showToast(`🦊 Đã kết nối thành công ví: ${formatAddress(currentConnectedWallet)}`, "success");
      
      // Kích hoạt sự kiện thông báo cho các trang
      window.dispatchEvent(new CustomEvent("walletConnected", { detail: { address: currentConnectedWallet } }));
      return currentConnectedWallet;
    }
  } catch (err) {
    console.warn("Lỗi kết nối MetaMask:", err);
    if (err.code === 4001) {
      showToast("Bạn đã đóng cửa sổ ví MetaMask.", "info");
    } else if (err.code === -32002) {
      showToast("🦊 MetaMask đang có cửa sổ chờ xác nhận! Hãy nhấp vào biểu tượng con Cáo ở thanh công cụ trình duyệt.", "info");
    } else {
      showToast("Lỗi kết nối ví MetaMask: " + (err.message || ""), "error");
    }
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

function disconnectWallet() {
  currentConnectedWallet = null;
  sessionStorage.removeItem("connected_wallet");
  sessionStorage.removeItem("is_simulated_wallet");
  updateAllWalletButtons();
  showToast("Đã ngắt kết nối ví. Nút đã trở về 'Kết nối MetaMask'.", "info");
  window.dispatchEvent(new CustomEvent("walletDisconnected"));
}

function handleWalletBtnClick() {
  const wallet = getConnectedWallet();
  if (wallet) {
    const choice = confirm(`Đang kết nối: ${formatAddress(wallet)}\n\n• Bấm [OK] để mở cửa sổ MetaMask và ĐỔI SANG VÍ KHÁC\n• Bấm [Cancel] để NGẮT KẾT NỐI VÍ`);
    if (choice) {
      connectMetaMask(true);
    } else {
      disconnectWallet();
    }
  } else {
    // Mở cửa sổ popup MetaMask để người dùng chọn tài khoản đăng nhập
    connectMetaMask(true);
  }
}

// Modal hướng dẫn & Chọn ví giả lập
function showWalletModal() {
  const isFileProtocol = window.location.protocol === "file:";

  let modal = document.getElementById("walletConnectHelpModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "walletConnectHelpModal";
    modal.className = "modal-overlay active";
    document.body.appendChild(modal);
  } else {
    modal.classList.add("active");
  }

  modal.onclick = (e) => { if (e.target === modal) closeWalletModal(); };
  modal.innerHTML = `
    <div class="modal-box" style="max-width: 600px; text-align: left; padding: 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:28px;">🦊</span>
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin:0;">Kết Nối Ví MetaMask Cá Nhân</h3>
            <span style="font-size:0.78rem; color:var(--text-dim);">Hệ thống văn bằng số Đại học Huế</span>
          </div>
        </div>
        <button onclick="closeWalletModal()" style="background:none; border:none; font-size:20px; cursor:pointer; color:var(--text-dim);">✕</button>
      </div>

      ${isFileProtocol ? `
      <!-- CẢNH BÁO FILE:// -->
      <div style="background:#fff1f2; border:1.5px solid #fecdd3; border-radius:var(--radius-md); padding:16px; margin-bottom:18px;">
        <div style="font-weight:800; color:#e11d48; margin-bottom:8px; font-size:0.95rem; display:flex; align-items:center; gap:6px;">
          <span>🛑</span> Vì sao MetaMask chưa thể kết nối?
        </div>
        <p style="font-size:0.85rem; color:#475569; margin:0 0 10px 0; line-height:1.5;">
          Bạn đang mở web dưới dạng tệp ngoại tuyến (<strong>file:///...</strong>). Trình duyệt Google Chrome &amp; Microsoft Edge <strong>mặc định chặn toàn bộ Extension</strong> trên đường dẫn file:// vì lý do an ninh.
        </p>

        <div style="background:#ffffff; border:1.5px solid #22c55e; border-radius:8px; padding:12px 14px; margin-bottom:10px;">
          <div style="font-weight:700; color:#15803d; margin-bottom:4px; font-size:0.9rem;">
            ✅ GIẢI PHÁP 1 BƯỚC DUY NHẤT (Khuyên dùng):
          </div>
          <p style="font-size:0.83rem; color:var(--text-main); margin:0 0 8px 0; line-height:1.5;">
            1. Vào thư mục dự án và <strong>nhấp đúp chuột chạy file:</strong> <strong style="color:var(--primary); font-family:monospace; background:#e0f2fe; padding:2px 6px; border-radius:4px;">CHAY-WEB.bat</strong><br>
            2. Trình duyệt sẽ tự động mở <strong style="color:var(--primary);">http://localhost:3000</strong>. Khi đó bấm "Kết nối MetaMask" là ví sẽ nhảy popup ngay lập tức!
          </p>
          <button class="btn-outline" style="font-size:0.78rem; padding:4px 10px;" onclick="navigator.clipboard.writeText('http://localhost:3000'); showToast('Đã copy: http://localhost:3000', 'success');">📋 Copy link http://localhost:3000</button>
        </div>

        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:10px 14px; font-size:0.8rem; color:#64748b; line-height:1.5;">
          <strong>Cách 2 (Nếu vẫn muốn dùng file:///):</strong> Mở <code style="color:var(--primary);">chrome://extensions</code> ➔ Tìm MetaMask ➔ Bấm "Chi tiết" ➔ Bật công tắc <strong>"Cho phép truy cập vào các URL tệp"</strong> ➔ F5 lại trang này.
        </div>
      </div>
      ` : `
      <!-- THÔNG BÁO KHI ĐÃ TRÊN HTTP NHƯNG CHƯA CÀI HOẶC KHÁC TRÌNH DUYỆT -->
      <div style="background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:var(--radius-md); padding:16px; margin-bottom:18px;">
        <div style="font-weight:800; color:#1d4ed8; margin-bottom:8px; font-size:0.95rem; display:flex; align-items:center; gap:6px;">
          <span>🔍</span> Chưa nhận diện được tiện ích MetaMask trên trình duyệt này!
        </div>
        <p style="font-size:0.85rem; color:#334155; margin:0 0 10px 0; line-height:1.5;">
          • Nếu bạn đã cài MetaMask trên <strong>Google Chrome</strong> nhưng đang mở trang web này bằng <strong>Microsoft Edge</strong> (hoặc ngược lại), hãy copy đường link và mở bằng đúng trình duyệt có cài MetaMask:<br>
          <div style="margin:8px 0;">
            <input type="text" value="${window.location.href}" readonly style="width:100%; padding:8px 10px; font-family:monospace; font-size:0.82rem; background:#ffffff; border:1px solid #93c5fd; border-radius:6px; color:#1e40af;" onclick="this.select()">
          </div>
          • Nếu chưa cài đặt ví, bạn có thể cài miễn phí từ trang chủ: <a href="https://metamask.io/download/" target="_blank" style="color:var(--primary); font-weight:700;">metamask.io/download ↗</a>
        </p>
      </div>
      `}

      <div style="border-top:1px dashed var(--border-color); padding-top:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <h4 style="font-size:0.92rem; font-weight:800; color:var(--text-main); margin:0;">
            ⚡ Dùng Thử Ví Web3 Giả Lập (Không Cần Cài Tiện Ích)
          </h4>
          <span class="badge-tag" style="background:var(--emerald-bg); color:var(--emerald); border-color:var(--emerald-border);">Trải nghiệm ngay</span>
        </div>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:10px; line-height:1.5;">
          Bạn có thể nhập địa chỉ ví của mình hoặc chọn 1 ví mẫu để test toàn bộ giao dịch, đúc bằng và xác thực:
        </p>

        <div style="display:flex; gap:8px; margin-bottom:10px;">
          <input type="text" id="inputManualWallet" class="form-input" placeholder="0x..." style="font-family:monospace; font-size:0.85rem; flex:1;" value="0x71C26071493b86EFA7AC41b38f828a2aC41Ea47B">
          <button class="btn-primary" style="font-size:0.85rem; padding:8px 16px; white-space:nowrap;" onclick="connectManualWallet(document.getElementById('inputManualWallet').value.trim())">
            Kích Hoạt
          </button>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
          <button class="btn-outline" style="font-size:0.75rem; padding:6px 8px; text-align:left;" onclick="connectManualWallet('0x71C26071493b86EFA7AC41b38f828a2aC41Ea47B')">
            🎓 <strong>Phan Thị Yến Nhi</strong><br><small style="color:var(--text-dim); font-family:monospace;">0x71C2...a47B</small>
          </button>
          <button class="btn-outline" style="font-size:0.75rem; padding:6px 8px; text-align:left;" onclick="connectManualWallet('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')">
            🎓 <strong>Nguyễn Quốc Bảo</strong><br><small style="color:var(--text-dim); font-family:monospace;">0x3C44...93BC</small>
          </button>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; margin-top:16px; border-top:1px solid var(--border-color); padding-top:12px;">
        <button class="btn-outline" onclick="closeWalletModal()" style="font-size:0.85rem; padding:6px 16px;">Đóng Cửa Sổ</button>
      </div>
    </div>
  `;
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

// Cập nhật giao diện nút ví khi tải trang (giữ ở trạng thái "🦊 Kết nối MetaMask")
document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("connected_wallet");
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


