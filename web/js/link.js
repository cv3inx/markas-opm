/**
 * JavaScript for the link generator page
 */

// Declare QRCode variable
const QRCode = window.QRCode;

// Global variables
let proxyList = [];
let filteredProxyList = [];
let selectedProxy = null;
const defaultProxyUrl =
  "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/proxyList.txt";

const serverDomains = ["markas-opm.pp.ua"];
let selectedServerDomain = serverDomains[0]; // Default to first domain
const defaultUUID = "bbbbbbbb-opeem-jiir-ffffffffffff";
const itemsPerPage = 10;
let currentPage = 1;

const pathTemplate = "/MARKASOPM/{ip}-{port}";

// Array of bug options for easy management
const bugOptions = [
  { value: "", label: "Default" },
  { value: "ava.game.naver.com", label: "ava.game.naver.com" },
  { value: "support.zoom.us", label: "support.zoom.us" },
  {
    value: "api24-normal-alisg.tiktokv.com",
    label: "api24-normal-alisg.tiktokv.com",
  },
  { value: "manual", label: "Type Manual" },
];

// DOM elements
const proxyListSection = document.getElementById("proxy-list-section");
const accountCreationSection = document.getElementById(
  "account-creation-section"
);
const resultSection = document.getElementById("result-section");
const loadingIndicator = document.getElementById("loading-indicator");
const proxyListContainer = document.getElementById("proxy-list-container");
const noProxiesMessage = document.getElementById("no-proxies-message");
const customUrlInput = document.getElementById("custom-url-input");
const proxyUrlInput = document.getElementById("proxy-url");
const paginationContainer = document.getElementById("pagination-container");
const proxyCountInfo = document.getElementById("proxy-count-info");
const searchInput = document.getElementById("search-input");

// Function to populate bug select dropdowns
function populateBugOptions() {
  const bugSelects = [
    document.getElementById("vmess-bug"),
    document.getElementById("vless-bug"),
    document.getElementById("trojan-bug"),
    document.getElementById("ss-bug"),
  ];

  bugSelects.forEach((select) => {
    if (select) {
      // Clear existing options
      select.innerHTML = "";

      // Add options from the array
      bugOptions.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
      });
    }
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Display fallback proxy list immediately to ensure something is visible
  displayFallbackProxyList();

  // Then try to load the actual proxy list
  loadProxyList(defaultProxyUrl);

  // Event listeners
  document.getElementById("refresh-btn").addEventListener("click", () => {
    loadProxyList(defaultProxyUrl);
  });

  document.getElementById("custom-url-btn").addEventListener("click", () => {
    customUrlInput.classList.toggle("hidden");
  });

  document.getElementById("load-custom-url").addEventListener("click", () => {
    const url = proxyUrlInput.value.trim();
    if (url) {
      loadProxyList(url);
    }
  });

  document.getElementById("back-to-list").addEventListener("click", () => {
    showProxyListSection();
  });

  document.getElementById("back-to-form").addEventListener("click", () => {
    resultSection.classList.add("hidden");
    accountCreationSection.classList.remove("hidden");
  });

  document.getElementById("create-new").addEventListener("click", () => {
    resultSection.classList.add("hidden");
    accountCreationSection.classList.remove("hidden");
  });

  document
    .getElementById("back-to-list-from-result")
    .addEventListener("click", () => {
      showProxyListSection();
    });

  // Search functionality
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase().trim();

    if (searchTerm === "") {
      filteredProxyList = [...proxyList];
    } else {
      filteredProxyList = proxyList.filter(
        (proxy) =>
          proxy.provider.toLowerCase().includes(searchTerm) ||
          proxy.country.toLowerCase().includes(searchTerm)
      );
    }

    currentPage = 1;
    renderProxyList();
  });

  // Protocol tabs
  const protocolTabs = document.querySelectorAll(".tab-btn");
  const protocolForms = document.querySelectorAll(".protocol-form");

  protocolTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      protocolTabs.forEach((t) => {
        t.classList.remove("active");
      });

      // Add active class to clicked tab
      tab.classList.add("active");

      // Hide all forms
      protocolForms.forEach((form) => {
        form.classList.add("hidden");
      });

      // Show the selected form
      const targetId = tab.getAttribute("data-target");
      document.getElementById(targetId).classList.remove("hidden");
    });
  });

  // Populate server domain dropdowns
  const serverDomainSelects = [
    document.getElementById("vmess-server-domain"),
    document.getElementById("vless-server-domain"),
    document.getElementById("trojan-server-domain"),
    document.getElementById("ss-server-domain"),
  ];

  serverDomainSelects.forEach((select) => {
    if (select) {
      // Clear existing options
      select.innerHTML = "";

      // Add options for each domain
      serverDomains.forEach((domain) => {
        const option = document.createElement("option");
        option.value = domain;
        option.textContent = domain;
        select.appendChild(option);
      });

      // Add event listener to update selected domain
      select.addEventListener("change", function () {
        selectedServerDomain = this.value;
      });
    }
  });

  // Populate bug options dropdowns
  populateBugOptions();

  // Form submissions
  const forms = [
    document.getElementById("vmess-account-form"),
    document.getElementById("vless-account-form"),
    document.getElementById("trojan-account-form"),
    document.getElementById("ss-account-form"),
  ];

  // Custom Bug dan Wildcard functionality
  const bugInputs = [
    document.getElementById("vmess-bug"),
    document.getElementById("vless-bug"),
    document.getElementById("trojan-bug"),
    document.getElementById("ss-bug"),
  ];

  const wildcardContainers = [
    document.getElementById("vmess-wildcard-container"),
    document.getElementById("vless-wildcard-container"),
    document.getElementById("trojan-wildcard-container"),
    document.getElementById("ss-wildcard-container"),
  ];

  const wildcardCheckboxes = [
    document.getElementById("vmess-wildcard"),
    document.getElementById("vless-wildcard"),
    document.getElementById("trojan-wildcard"),
    document.getElementById("ss-wildcard"),
  ];

  // Add event listeners to bug selects
  bugInputs.forEach((select, index) => {
    const manualContainerId = select.id.replace(
      "-bug",
      "-manual-bug-container"
    );
    const manualContainer = document.getElementById(manualContainerId);
    const manualInput = document.getElementById(
      select.id.replace("-bug", "-manual-bug")
    );
    const wildcardCheckbox = wildcardCheckboxes[index];

    select.addEventListener("change", function () {
      if (this.value === "manual") {
        manualContainer.classList.add("show");
        wildcardContainers[index].classList.remove("show"); // Hide wildcard container
        wildcardCheckbox.checked = false; // Uncheck the wildcard checkbox
        wildcardCheckbox.disabled = true; // Disable the wildcard checkbox
      } else if (this.value !== "") {
        manualContainer.classList.remove("show");
        wildcardContainers[index].classList.add("show");
        wildcardCheckbox.disabled = false; // Enable the wildcard checkbox
      } else {
        manualContainer.classList.remove("show");
        wildcardContainers[index].classList.remove("show");
        wildcardCheckbox.checked = false;
        wildcardCheckbox.disabled = false; // Reset the disabled state
      }
    });

    if (manualInput) {
      manualInput.addEventListener("input", () => {
        // Don't show wildcard container for manual input
        wildcardCheckbox.disabled = true;
      });
    }
  });

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const formType = form.id.split("-")[0]; // vmess, vless, trojan, or ss

      // Get custom bug and wildcard values
      let customBug = formData.get("bug")
        ? formData.get("bug").toString().trim()
        : "";

      // If manual bug is selected, use the manual input value instead
      if (customBug === "manual") {
        const manualInputId = `${formType}-manual-bug`;
        const manualBugValue = document
          .getElementById(manualInputId)
          .value.trim();
        if (manualBugValue) {
          formData.set("bug", manualBugValue);
          // Update customBug with the manual value for server address
          customBug = manualBugValue;
        } else {
          formData.set("bug", ""); // Reset to empty if manual field is empty
          customBug = ""; // Also update customBug variable
        }
      }

      const useWildcard = formData.get("wildcard") === "on";

      // Determine server, host, and SNI based on custom bug and wildcard
      // Get the selected server domain from the form
      const selectedDomain =
        formData.get("server-domain") || selectedServerDomain;
      let server = selectedDomain;
      let host = selectedDomain;
      let sni = selectedDomain;

      if (customBug) {
        server = customBug;
        if (useWildcard) {
          host = `${customBug}.${selectedDomain}`;
          sni = `${customBug}.${selectedDomain}`;
        }
      }

      // Generate connection URL based on protocol
      let connectionUrl = "";

      if (formType === "vmess") {
        const security = formData.get("security");
        // Set port based on TLS setting
        const port = security === "tls" ? 443 : 80;

        const vmessConfig = {
          v: "2",
          ps: formData.get("name"),
          add: server,
          port: port,
          id: formData.get("uuid"),
          aid: "0",
          net: "ws", // Always WebSocket
          type: "none",
          host: host,
          path: formData.get("path"),
          tls: security === "tls" ? "tls" : "",
          sni: sni,
          scy: "zero",
        };

        connectionUrl = "vmess://" + btoa(JSON.stringify(vmessConfig));
      } else if (formType === "vless") {
        const uuid = formData.get("uuid");
        const path = encodeURIComponent(formData.get("path"));
        const security = formData.get("security");
        const encryption = "none";
        const name = encodeURIComponent(formData.get("name"));
        // Set port based on TLS setting
        const port = security === "tls" ? 443 : 80;

        connectionUrl = `vless://${uuid}@${server}:${port}?encryption=${encryption}&security=${security}&type=ws&host=${host}&path=${path}&sni=${sni}#${name}`;
      } else if (formType === "trojan") {
        const password = formData.get("password");
        const path = encodeURIComponent(formData.get("path"));
        const security = formData.get("security");
        const name = encodeURIComponent(formData.get("name"));
        // Set port based on TLS setting
        const port = security === "tls" ? 443 : 80;

        connectionUrl = `trojan://${password}@${server}:${port}?security=${security}&type=ws&host=${host}&path=${path}&sni=${sni}#${name}`;
      } else if (formType === "ss") {
        const password = formData.get("password");
        const name = encodeURIComponent(formData.get("name"));
        const path = encodeURIComponent(formData.get("path"));
        const security = formData.get("security");

        // Set port based on TLS setting
        const port = security === "tls" ? 443 : 80;

        // Use fixed cipher: none for Shadowsocks
        const method = "none";

        // Base64 encode the method:password part
        const userInfo = btoa(`${method}:${password}`);

        // Create the new format SS URL with dynamic port
        connectionUrl = `ss://${userInfo}@${server}:${port}?encryption=none&type=ws&host=${host}&path=${path}&security=${security}&sni=${sni}#${name}`;
      }

      // Display the result
      document.getElementById("connection-url").textContent = connectionUrl;

      // Generate QR code - Improved with multiple fallback methods
      generateQRCode(connectionUrl);

      // Show result section
      accountCreationSection.classList.add("hidden");
      resultSection.classList.remove("hidden");
    });
  });

  // Copy URL button
  document.getElementById("copy-url").addEventListener("click", function () {
    const connectionUrl = document.getElementById("connection-url").textContent;
    navigator.clipboard.writeText(connectionUrl).then(() => {
      this.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
      setTimeout(() => {
        this.innerHTML = '<i class="far fa-copy mr-1"></i> Copy';
      }, 2000);
    });
  });

  // Download QR code button
  document.getElementById("download-qr").addEventListener("click", () => {
    downloadQRCode();
  });
});

// Improved QR code generation with multiple fallback methods
function generateQRCode(text) {
  const qrcodeElement = document.getElementById("qrcode");
  qrcodeElement.innerHTML = "";

  // Try multiple methods to generate QR code
  try {
    // Method 1: Try to generate QR code using toCanvas
    QRCode.toCanvas(
      qrcodeElement,
      text,
      {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      },
      (error) => {
        if (error) {
          console.error("QR Code canvas error:", error);
          // If canvas fails, try method 2
          generateQRCodeFallback(text, qrcodeElement);
        }
      }
    );
  } catch (error) {
    console.error("QR Code generation error:", error);
    // If method 1 fails completely, try method 2
    generateQRCodeFallback(text, qrcodeElement);
  }
}

// Fallback QR code generation method
function generateQRCodeFallback(text, container) {
  try {
    // Method 2: Try to generate QR code as SVG
    QRCode.toString(
      text,
      {
        type: "svg",
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      },
      (error, svg) => {
        if (error || !svg) {
          console.error("QR Code SVG error:", error);
          // If SVG fails, try method 3
          generateQRCodeLastResort(text, container);
        } else {
          container.innerHTML = svg;
        }
      }
    );
  } catch (error) {
    console.error("QR Code SVG generation error:", error);
    // If method 2 fails completely, try method 3
    generateQRCodeLastResort(text, container);
  }
}

// Last resort QR code generation method
function generateQRCodeLastResort(text, container) {
  try {
    // Method 3: Try to generate QR code as data URL
    const encodedText = encodeURIComponent(text);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`;

    const img = document.createElement("img");
    img.src = qrApiUrl;
    img.alt = "QR Code";
    img.width = 200;
    img.height = 200;
    img.onerror = () => {
      container.innerHTML =
        '<div class="text-center text-rose-500">Failed to generate QR code</div>';
    };

    container.innerHTML = "";
    container.appendChild(img);
  } catch (error) {
    console.error("QR Code last resort error:", error);
    container.innerHTML =
      '<div class="text-center text-rose-500">Failed to generate QR code</div>';
  }
}

// Download QR code function
function downloadQRCode() {
  const qrcodeElement = document.getElementById("qrcode");

  // Try to find canvas or img in the QR code container
  const canvas = qrcodeElement.querySelector("canvas");
  const img = qrcodeElement.querySelector("img");
  const svg = qrcodeElement.querySelector("svg");

  let imageUrl = null;

  if (canvas) {
    // If canvas exists, convert it to data URL
    try {
      imageUrl = canvas.toDataURL("image/png");
    } catch (e) {
      console.error("Canvas to data URL error:", e);
    }
  } else if (img) {
    // If img exists, use its src
    imageUrl = img.src;
  } else if (svg) {
    // If SVG exists, convert it to data URL
    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      imageUrl = URL.createObjectURL(svgBlob);
    } catch (e) {
      console.error("SVG to data URL error:", e);
    }
  }

  if (imageUrl) {
    // Create a link and trigger download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL if it was created from a blob
    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }
  } else {
    alert("Failed to download QR code. Please try again.");
  }
}

// Function to display fallback proxy list
function displayFallbackProxyList() {
  // Add a fallback proxy list for immediate display
  proxyList = [
    {
      ip: "103.6.207.108",
      port: "8080",
      country: "ID",
      provider: "PT Pusat Media Indonesia",
    },
  ];

  filteredProxyList = [...proxyList];
  renderProxyList();
}

// Process proxy list data
function processProxyData(text) {
  // Handle different line endings and remove empty lines
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  console.log(`Found ${lines.length} lines in proxy data`);

  if (lines.length === 0) {
    noProxiesMessage.classList.remove("hidden");
    return; // No data to process
  }

  // Try to determine the format of the data
  let delimiter = ","; // Default delimiter

  // Check if the data uses tabs or other delimiters
  const firstLine = lines[0];
  if (firstLine.includes("\t")) {
    delimiter = "\t";
  } else if (firstLine.includes("|")) {
    delimiter = "|";
  } else if (firstLine.includes(";")) {
    delimiter = ";";
  }

  // Parse proxy list with the detected delimiter
  proxyList = lines
    .map((line) => {
      const parts = line.split(delimiter);

      // Require at least IP and port
      if (parts.length >= 2) {
        return {
          ip: parts[0].trim(),
          port: parts[1].trim(),
          country: parts.length >= 3 ? parts[2].trim() : "Unknown",
          provider: parts.length >= 4 ? parts[3].trim() : "Unknown Provider",
        };
      }
      return null;
    })
    .filter((proxy) => proxy && proxy.ip && proxy.port);

  console.log(`Processed ${proxyList.length} valid proxies`);

  // If no valid proxies were found, show message and use fallback
  if (proxyList.length === 0) {
    noProxiesMessage.classList.remove("hidden");
    displayFallbackProxyList();
    return;
  }

  // Reset pagination
  currentPage = 1;
  filteredProxyList = [...proxyList];

  // Render the proxy list
  renderProxyList();
}

// Function to render the proxy list with pagination
function renderProxyList() {
  proxyListContainer.innerHTML = "";

  if (filteredProxyList.length === 0) {
    noProxiesMessage.classList.remove("hidden");
    paginationContainer.innerHTML = "";
    proxyCountInfo.textContent = "";
    return;
  }

  noProxiesMessage.classList.add("hidden");

  // Calculate pagination
  const totalPages = Math.ceil(filteredProxyList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredProxyList.length
  );

  // Get current page items
  const currentItems = filteredProxyList.slice(startIndex, endIndex);

  // Render proxy cards
  currentItems.forEach((proxy, index) => {
    const actualIndex = startIndex + index;
    const card = document.createElement("div");
    card.className = "proxy-card group";

    // Create the main content of the card with forced row layout
    const cardContent = document.createElement("div");
    cardContent.className = "flex justify-between items-center";
    cardContent.style.display = "flex"; // Force flex display
    cardContent.style.flexDirection = "row"; // Force row direction

    // Left side with proxy info
    const infoDiv = document.createElement("div");
    infoDiv.className = "flex-1 min-w-0 pr-2"; // min-w-0 helps with text truncation

    // Provider and status badge container
    const providerContainer = document.createElement("div");
    providerContainer.className = "flex-items-center";
    providerContainer.style.display = "flex";
    providerContainer.style.alignItems = "center";
    providerContainer.style.width = "100%";
    providerContainer.style.position = "relative";

    // Provider name with truncation
    const providerName = document.createElement("div");
    providerName.className =
      "font-medium text-sm truncate group-hover:text-indigo-300 transition-colors";
    providerName.style.maxWidth = "calc(100% - 20px)"; // Leave space for the status indicator
    providerName.textContent = proxy.provider;
    providerContainer.appendChild(providerName);

    // Status badge (initially loading)
    const statusBadge = document.createElement("span");
    statusBadge.className =
      "inline-block w-3 h-3 rounded-full bg-gray-500 ml-2 pulse-animation";
    statusBadge.style.flexShrink = "0";
    statusBadge.style.position = "relative";
    statusBadge.innerHTML = "";
    statusBadge.title = "Memeriksa...";
    statusBadge.id = `proxy-status-${actualIndex}`;
    providerContainer.appendChild(statusBadge);

    infoDiv.appendChild(providerContainer);

    // Country and IP:Port info with truncation
    const detailsDiv = document.createElement("div");
    detailsDiv.className =
      "text-xs text-gray-400 mt-1 truncate group-hover:text-gray-300 transition-colors";
    detailsDiv.style.whiteSpace = "nowrap";
    detailsDiv.style.overflow = "hidden";
    detailsDiv.style.textOverflow = "ellipsis";
    detailsDiv.textContent = `${proxy.country} | ${proxy.ip}:${proxy.port}`;
    infoDiv.appendChild(detailsDiv);

    // Right side with button - fixed width to prevent wrapping
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "flex-shrink-0";
    buttonDiv.style.flexShrink = "0"; // Prevent shrinking

    const button = document.createElement("button");
    button.className =
      "create-account-btn btn-sm bg-neutral py-2 px-4 rounded-lg text-xs group-hover:scale-105 transition-transform";
    button.style.whiteSpace = "nowrap";
    button.style.minWidth = "60px";
    button.setAttribute("data-index", actualIndex);
    button.innerHTML = "Create";
    buttonDiv.appendChild(button);

    // Assemble the card
    cardContent.appendChild(infoDiv);
    cardContent.appendChild(buttonDiv);
    card.appendChild(cardContent);

    proxyListContainer.appendChild(card);

    // Check proxy status for this card
    const statusURL = `https://api.jb8fd7grgd.workers.dev/${proxy.ip}:${proxy.port}`;

    fetch(statusURL)
      .then((response) => response.json())
      .then((data) => {
        // Handle the new format where data is an array
        const proxyData = Array.isArray(data) ? data[0] : data;

        if (proxyData && proxyData.proxyip === true) {
          statusBadge.className =
            "inline-block w-3 h-3 rounded-full bg-emerald-500 ml-2";
          statusBadge.innerHTML = "";
          statusBadge.title = "Aktif";
        } else {
          statusBadge.className =
            "inline-block w-3 h-3 rounded-full bg-rose-500 ml-2";
          statusBadge.innerHTML = "";
          statusBadge.title = "Mati";
        }
      })
      .catch((error) => {
        statusBadge.className =
          "inline-block w-3 h-3 rounded-full bg-amber-500 ml-2";
        statusBadge.innerHTML = "";
        statusBadge.title = "Tidak diketahui";
        console.error("Fetch error:", error);
      });
  });

  // Add event listeners to create account buttons
  document.querySelectorAll(".create-account-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"));
      selectProxy(index);
      showAccountCreationSection();
    });
  });

  // Render pagination controls
  renderPagination(totalPages);

  // Update proxy count info
  proxyCountInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${
    filteredProxyList.length
  } proxies`;
}

// Function to check proxy status in the list
function checkProxyStatusInList(proxy, statusBadge) {
  const statusURL = `https://api.jb8fd7grgd.workers.dev/${proxy.ip}:${proxy.port}`;

  fetch(statusURL)
    .then((response) => response.json())
    .then((data) => {
      // Handle the new format where data is an array
      const proxyData = Array.isArray(data) ? data[0] : data;

      if (proxyData && proxyData.proxyip === true) {
        statusBadge.className =
          "inline-block w-3 h-3 rounded-full bg-emerald-500 ml-2";
        statusBadge.innerHTML = "";
        statusBadge.title = "Aktif";
      } else {
        statusBadge.className =
          "inline-block w-3 h-3 rounded-full bg-rose-500 ml-2";
        statusBadge.innerHTML = "";
        statusBadge.title = "Mati";
      }
    })
    .catch((error) => {
      statusBadge.className =
        "inline-block w-3 h-3 rounded-full bg-amber-500 ml-2";
      statusBadge.innerHTML = "";
      statusBadge.title = "Tidak diketahui";
      console.error("Fetch error:", error);
    });
}

// Function to render pagination controls
/**
 * Merender kontrol paginasi menggunakan komponen join dari DaisyUI.
 * @param {number} totalPages - Jumlah total halaman.
 */
function renderPagination(totalPages) {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = ""; // Hapus konten lama

  // Jangan tampilkan pagination jika hanya ada satu halaman atau kurang
  if (totalPages <= 1) {
    return;
  }

  // Buat HTML untuk komponen join DaisyUI
  const paginationHTML = `
        <div class="join">
            <button class="join-item btn btn-sm btn-ghost" data-page="${
              currentPage - 1
            }" ${currentPage === 1 ? "disabled" : ""}>«</button>
            <button class="join-item btn btn-sm btn-disabled">Page ${currentPage} of ${totalPages}</button>
            <button class="join-item btn btn-sm btn-ghost" data-page="${
              currentPage + 1
            }" ${currentPage === totalPages ? "disabled" : ""}>»</button>
        </div>
    `;

  // Masukkan HTML yang sudah jadi ke dalam kontainer
  paginationContainer.innerHTML = paginationHTML;

  // Tambahkan event listener ke tombol 'previous' dan 'next' yang bisa diklik
  paginationContainer
    .querySelectorAll("button[data-page]")
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        // Jangan lakukan apa-apa jika tombolnya disabled
        if (e.currentTarget.hasAttribute("disabled")) {
          return;
        }

        // Perbarui halaman saat ini dan render ulang daftar proksi
        currentPage = parseInt(e.currentTarget.dataset.page, 10);
        renderProxyList();
      });
    });
}

// Function to select a proxy
async function selectProxy(index) {
  selectedProxy = filteredProxyList[index];

  // Update selected proxy info
  document.getElementById("selected-ip").textContent = selectedProxy.ip;
  document.getElementById("selected-port").textContent = selectedProxy.port;
  document.getElementById("selected-country").textContent =
    selectedProxy.country;
  document.getElementById("selected-provider").textContent =
    selectedProxy.provider;

  // Update form fields
  const baseAccountName = `${selectedProxy.country} - ${selectedProxy.provider}`;
  const path = pathTemplate
    .replace("{ip}", selectedProxy.ip)
    .replace("{port}", selectedProxy.port);

  // Set the path values
  document.getElementById("vmess-path").value = path;
  document.getElementById("vless-path").value = path;
  document.getElementById("trojan-path").value = path;
  document.getElementById("ss-path").value = path;

  // Set initial account names with protocol and TLS info
  const vmessSecurity = document.getElementById("vmess-security").value;
  const vlessSecurity = document.getElementById("vless-security").value;
  const trojanSecurity = document.getElementById("trojan-security").value;
  const ssSecurity = document.getElementById("ss-security").value;

  document.getElementById("vmess-name").value = `${baseAccountName} [VMess-${
    vmessSecurity === "tls" ? "TLS" : "NTLS"
  }]`;
  document.getElementById("vless-name").value = `${baseAccountName} [VLESS-${
    vlessSecurity === "tls" ? "TLS" : "NTLS"
  }]`;
  document.getElementById("trojan-name").value = `${baseAccountName} [Trojan-${
    trojanSecurity === "tls" ? "TLS" : "NTLS"
  }]`;
  document.getElementById("ss-name").value = `${baseAccountName} [SS-${
    ssSecurity === "tls" ? "TLS" : "NTLS"
  }]`;

  // Add event listeners to update account names when security option changes
  const securitySelects = [
    { id: "vmess-security", nameId: "vmess-name", protocol: "VMess" },
    { id: "vless-security", nameId: "vless-name", protocol: "VLESS" },
    { id: "trojan-security", nameId: "trojan-name", protocol: "Trojan" },
    { id: "ss-security", nameId: "ss-name", protocol: "SS" },
  ];

  securitySelects.forEach((item) => {
    const select = document.getElementById(item.id);
    const nameInput = document.getElementById(item.nameId);

    // Remove any existing event listeners (to prevent duplicates)
    const newSelect = select.cloneNode(true);
    select.parentNode.replaceChild(newSelect, select);

    // Add new event listener
    newSelect.addEventListener("change", function () {
      const tlsType = this.value === "tls" ? "TLS" : "NTLS";
      nameInput.value = `${baseAccountName} [${item.protocol}-${tlsType}]`;
    });
  });

  // Check proxy status in the account creation section
  const statusContainer = document.getElementById("proxy-status-container");
  const statusLoading = document.getElementById("proxy-status-loading");
  const statusActive = document.getElementById("proxy-status-active");
  const statusDead = document.getElementById("proxy-status-dead");
  const statusUnknown = document.getElementById("proxy-status-unknown");
  const latencyElement = document.getElementById("proxy-latency");

  // Show status container and loading state
  statusContainer.classList.remove("hidden");
  statusLoading.classList.remove("hidden");
  statusActive.classList.add("hidden");
  statusDead.classList.add("hidden");
  statusUnknown.classList.add("hidden");

  checkProxyStatus(selectedProxy);
}

// Function to check proxy status in the account creation section
function checkProxyStatus(proxy) {
  const startTime = performance.now();
  const statusURL = `https://api.jb8fd7grgd.workers.dev/${proxy.ip}:${proxy.port}`;
  const statusContainer = document.getElementById("proxy-status-container");
  const statusLoading = document.getElementById("proxy-status-loading");
  const statusActive = document.getElementById("proxy-status-active");
  const statusDead = document.getElementById("proxy-status-dead");
  const statusUnknown = document.getElementById("proxy-status-unknown");
  const latencyElement = document.getElementById("proxy-latency");

  // Show status container and loading state
  statusContainer.classList.remove("hidden");
  statusLoading.classList.remove("hidden");
  statusActive.classList.add("hidden");
  statusDead.classList.add("hidden");
  statusUnknown.classList.add("hidden");

  fetch(statusURL)
    .then((response) => response.json())
    .then((data) => {
      const endTime = performance.now();
      const latency = Math.floor(endTime - startTime);

      // Hide loading state
      statusLoading.classList.add("hidden");

      // Handle the new format where data is an array
      const proxyData = Array.isArray(data) ? data[0] : data;

      if (proxyData && proxyData.proxyip === true) {
        statusActive.classList.remove("hidden");
        latencyElement.textContent = `${latency}ms`;
      } else {
        statusDead.classList.remove("hidden");
      }
    })
    .catch((error) => {
      // Hide loading state
      statusLoading.classList.add("hidden");
      statusUnknown.classList.remove("hidden");
      console.error("Fetch error:", error);
    });
}

// Function to show proxy list section
function showProxyListSection() {
  proxyListSection.classList.remove("hidden");
  accountCreationSection.classList.add("hidden");
  resultSection.classList.add("hidden");
}

// Function to show account creation section
function showAccountCreationSection() {
  proxyListSection.classList.add("hidden");
  accountCreationSection.classList.remove("hidden");
  resultSection.classList.add("hidden");
}

// Update the loadProxyList function to better handle GitHub data and CORS issues
function loadProxyList(url) {
  // Show loading indicator
  loadingIndicator.classList.remove("hidden");
  proxyListContainer.innerHTML = "";
  noProxiesMessage.classList.add("hidden");

  // Try multiple CORS proxies in sequence
  const corsProxies = [
    // Direct fetch (no proxy)
    async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Direct fetch failed");
      return await response.text();
    },
    // CORS Anywhere proxy
    async () => {
      const corsUrl = `https://cors-anywhere.herokuapp.com/${url}`;
      const response = await fetch(corsUrl);
      if (!response.ok) throw new Error("CORS Anywhere proxy failed");
      return await response.text();
    },
    // AllOrigins proxy
    async () => {
      const corsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        url
      )}`;
      const response = await fetch(corsUrl);
      if (!response.ok) throw new Error("AllOrigins proxy failed");
      const data = await response.json();
      return data.contents;
    },
    // CORS.sh proxy
    async () => {
      const corsUrl = `https://cors.sh/${url}`;
      const response = await fetch(corsUrl, {
        headers: {
          "x-cors-api-key":
            "temp_" + Math.random().toString(36).substring(2, 12),
        },
      });
      if (!response.ok) throw new Error("CORS.sh proxy failed");
      return await response.text();
    },
  ];

  // Try each proxy in sequence
  (async function tryProxies(index = 0) {
    if (index >= corsProxies.length) {
      console.error("All proxies failed");
      loadingIndicator.classList.add("hidden");
      noProxiesMessage.classList.remove("hidden");
      // Fall back to sample data
      displayFallbackProxyList();
      return;
    }

    try {
      const text = await corsProxies[index]();
      console.log("Fetched data:", text.substring(0, 200) + "..."); // Debug log (truncated)
      processProxyData(text);
      loadingIndicator.classList.add("hidden");
    } catch (error) {
      console.error(`Proxy ${index} failed:`, error);
      // Try next proxy
      tryProxies(index + 1);
    }
  })();
}
