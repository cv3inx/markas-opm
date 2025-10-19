/**
 * Common JavaScript functions shared across all pages
 * Markas OPM Project
 */

// ============================================
// DOM Content Loaded - Initialize Components
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initializeComponents();
  initializeDonationModal();
  setCurrentYear();
});

/**
 * Initialize reusable components (nav, footer, floating)
 */
function initializeComponents() {
  const nav = document.getElementById("navSec");
  const footer = document.getElementById("footer");
  const floating = document.getElementById("floating");
  const currentPath = window.location.pathname;

  // Navigation Component
if (nav) {
    nav.innerHTML = `
      <nav role="tablist" class="tabs tabs-bordered items-center gap-2"> <a role="tab" href="/" class="tab text-lg ${currentPath === '/' ? 'tab-active' : ''} hover:scale-101 hover:shadow-lg hover:shadow-neutral-500/50 transition-all duration-500 ease-in-out">
          Home
        </a>
        <a role="tab" href="/sub" class="tab text-lg ${currentPath === '/sub' ? 'tab-active' : ''} hover:scale-101 hover:shadow-lg hover:shadow-neutral-500/50 transition-all duration-500 ease-in-out">
          Subscription
        </a>
        <a role="tab" href="/link" class="tab text-lg ${currentPath === '/link' ? 'tab-active' : ''} hover:scale-101 hover:shadow-lg hover:shadow-neutral-500/50 transition-all duration-500 ease-in-out">
          Generate
        </a>
      </nav>
    `;
  }
  // Floating Donation Button & Modal
  if (floating) {
    floating.innerHTML = `
      <button 
        id="donation-button"
        class="btn btn-circle btn-primary fixed bottom-4 right-4 shadow-2xl animate-pulse hover:animate-none z-50 hover:scale-110 hover:shadow-xl hover:shadow-primary/50 transition-all duration-200 ease-in-out"
        aria-label="Support us">
        <i class="fas fa-hand-holding-heart text-xl"></i>
      </button>
   
      <dialog id="donation_modal" class="modal">
        <div class="modal-box glass-pane text-center">
          <h3 class="font-bold text-2xl font-orbitron mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Support Us!
          </h3>
          <p class="py-4 text-white/80">
            Your donation keeps our services running. Thank you! 🙏
          </p>
          <div class="bg-white p-4 rounded-xl inline-block shadow-lg">
            <img 
              src="https://x.fairy.my.id/f/POzuPGfJ42ir.png  "
              alt="Donation QR Code"
              class="w-full max-w-xs mx-auto"
              loading="lazy">
          </div>
          <div class="modal-action flex flex-col gap-2"> <!-- Menambahkan flex-col dan gap untuk jarak antar tombol dalam modal action -->
            <form method="dialog">
              <button class="btn btn-outline btn-wide">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button aria-label="Close modal">close</button>
        </form>
      </dialog>
    `;
  }

  // Footer Component
  if (footer) {
    const currentYear = new Date().getFullYear();
    footer.innerHTML = `
      <footer class="text-center p-4 mt-4 text-sm text-white/50">
        <p>
          © <span id="current-year">${currentYear}</span> MARKAS OPM PROJECT — 
          <a 
            href="https://t.me/shouwee  " 
            class="link link-hover text-purple-400  transition-colors hover:scale-105 hover:underline transition-all duration-200 ease-in-out" 
            target="_blank"
            rel="noopener noreferrer">
            Contact Admin
          </a>
        </p>
      </footer>
    `;
  }
}

/**
 * Initialize donation modal functionality (DaisyUI modal)
 */
function initializeDonationModal() {
  // Wait a bit for DOM to fully render
  setTimeout(() => {
    const donationButton = document.getElementById("donation-button");
    const donationModal = document.getElementById("donation_modal");

    if (donationButton && donationModal) {
      donationButton.addEventListener("click", () => {
        donationModal.showModal();
      });

      // Close with Escape key (DaisyUI handles this by default)
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && donationModal.open) {
          donationModal.close();
        }
      });
    }
  }, 100);
}

/**
 * Set current year in footer and other elements
 */
function setCurrentYear() {
  const currentYear = new Date().getFullYear();
  const yearElements = document.querySelectorAll("#current-year, .current-year");
  
  yearElements.forEach((element) => {
    element.textContent = currentYear;
  });
}

// ============================================
// UUID & Password Generation
// ============================================

/**
 * Generate a UUID v4
 * @returns {string} A random UUID v4
 */
function generateUUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate UUID and update form field
 * @param {string} elementId - ID of the input element to update
 */
function generateUUID(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found`);
    return;
  }

  const uuid = generateUUIDv4();
  element.value = uuid;

  // Visual feedback
  addSuccessFeedback(element);
  
  return uuid;
}

/**
 * Generate password (uses UUID format for consistency)
 * @param {string} elementId - ID of the input element to update
 */
function generatePassword(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found`);
    return;
  }

  const password = generateUUIDv4();
  element.value = password;

  // Visual feedback
  addSuccessFeedback(element);
  
  return password;
}

/**
 * Add visual success feedback to an input element
 * @param {HTMLElement} element - The input element
 */
function addSuccessFeedback(element) {
  element.classList.add("input-success");
  setTimeout(() => {
    element.classList.remove("input-success");
  }, 600);
}

// ============================================
// Utility Functions
// ============================================

/**
 * Safe base64 encoding function
 * @param {string|object} str - String or object to encode
 * @returns {string} Base64 encoded string
 */
function safeBase64Encode(str) {
  try {
    const stringToEncode = typeof str === "object" ? JSON.stringify(str) : String(str);
    return window.btoa(unescape(encodeURIComponent(stringToEncode)));
  } catch (e) {
    console.error("Base64 encoding error:", e);
    return "";
  }
}

/**
 * Safe base64 decoding function
 * @param {string} str - Base64 string to decode
 * @returns {string} Decoded string
 */
function safeBase64Decode(str) {
  try {
    return decodeURIComponent(escape(window.atob(str)));
  } catch (e) {
    console.error("Base64 decoding error:", e);
    return "";
  }
}

/**
 * Format a date to a readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Copy text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
}

/**
 * Debounce function to limit function execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// Toast Notification System
// ============================================

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info, warning)
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = "info", duration = 3000) {
  // Ensure toast container exists
  let toastContainer = document.getElementById("toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.style.cssText = `
    min-width: 250px;
    max-width: 400px;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    animation: slideInRight 0.3s ease-out, slideOutRight 0.3s ease-in ${(duration / 1000) - 0.3}s forwards;
    pointer-events: auto;
    backdrop-filter: blur(10px);
  `;

  // Set background color and icon based on type
  const config = {
    success: { bg: "rgba(16, 185, 129, 0.95)", icon: "fa-check-circle" },
    error: { bg: "rgba(239, 68, 68, 0.95)", icon: "fa-exclamation-circle" },
    warning: { bg: "rgba(245, 158, 11, 0.95)", icon: "fa-exclamation-triangle" },
    info: { bg: "rgba(99, 102, 241, 0.95)", icon: "fa-info-circle" },
  };

  const { bg, icon } = config[type] || config.info;
  toast.style.backgroundColor = bg;

  // Toast content
  toast.innerHTML = `
    <i class="fas ${icon}" style="font-size: 20px; flex-shrink: 0;"></i>
    <span style="flex: 1;">${message}</span>
    <button 
      style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; flex-shrink: 0;"
      aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
  `;

  // Close button functionality
  const closeButton = toast.querySelector("button");
  closeButton.addEventListener("click", () => {
    removeToast(toast, toastContainer);
  });

  // Add to container
  toastContainer.appendChild(toast);

  // Inject animation CSS if not exists
  if (!document.getElementById("toast-animation-styles")) {
    const style = document.createElement("style");
    style.id = "toast-animation-styles";
    style.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100px);
        }
      }
      .input-success {
        border-color: #10b981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
        transition: all 0.3s ease !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Auto remove after duration
  setTimeout(() => {
    removeToast(toast, toastContainer);
  }, duration);
}

/**
 * Remove toast from container
 * @param {HTMLElement} toast - Toast element to remove
 * @param {HTMLElement} container - Toast container
 */
function removeToast(toast, container) {
  if (container.contains(toast)) {
    toast.style.animation = "slideOutRight 0.3s ease-in forwards";
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
      // Remove container if empty
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }
}

// ============================================
// Loading Spinner Utility
// ============================================

/**
 * Show loading spinner on an element
 * @param {HTMLElement} element - Element to show spinner on
 */
function showLoading(element) {
  if (!element) return;
  
  element.classList.add("loading", "loading-spinner");
  element.disabled = true;
}

/**
 * Hide loading spinner from an element
 * @param {HTMLElement} element - Element to hide spinner from
 */
function hideLoading(element) {
  if (!element) return;
  
  element.classList.remove("loading", "loading-spinner");
  element.disabled = false;
}

// ============================================
// Export for module usage (optional)
// ============================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateUUID,
    generateUUIDv4,
    generatePassword,
    copyToClipboard,
    showToast,
    safeBase64Encode,
    safeBase64Decode,
    formatDate,
    debounce,
    showLoading,
    hideLoading,
  };
}