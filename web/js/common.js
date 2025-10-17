/**
 * Common JavaScript functions shared across all pages
 */

// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
  const currentYearElements = document.querySelectorAll("#current-year");
  const currentYear = new Date().getFullYear();

  currentYearElements.forEach((element) => {
    element.textContent = currentYear;
  });
});

// Donation modal functionality
document.addEventListener("DOMContentLoaded", () => {
  const donationButton = document.getElementById("donation-button");
  const donationModal = document.getElementById("donation-modal");
  const closeButton = document.getElementById("close-donation");
  const donationBackdrop = document.getElementById("donation-backdrop");

  if (donationButton && donationModal) {
    // Open donation modal
    donationButton.addEventListener("click", () => {
      donationModal.classList.add("active");
    });

    // Close donation modal
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        donationModal.classList.remove("active");
      });
    }

    // Close modal when clicking on backdrop
    if (donationBackdrop) {
      donationBackdrop.addEventListener("click", () => {
        donationModal.classList.remove("active");
      });
    }

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && donationModal.classList.contains("active")) {
        donationModal.classList.remove("active");
      }
    });
  }
});

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
 * Safe base64 encoding function
 * @param {string|object} str - String or object to encode
 * @returns {string} Base64 encoded string
 */
function safeBase64Encode(str) {
  try {
    // Make sure we're working with a string
    const stringToEncode =
      typeof str === "object" ? JSON.stringify(str) : String(str);
    return window.btoa(stringToEncode);
  } catch (e) {
    console.error("Base64 encoding error:", e);
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
 * Copy text to clipboard
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
    console.error("Failed to copy text: ", err);
    return false;
  }
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = "info", duration = 3000) {
  // Check if toast container exists, create if not
  let toastContainer = document.getElementById("toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.position = "fixed";
    toastContainer.style.bottom = "20px";
    toastContainer.style.right = "20px";
    toastContainer.style.zIndex = "9999";
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.style.minWidth = "250px";
  toast.style.margin = "10px 0";
  toast.style.padding = "15px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.justifyContent = "space-between";
  toast.style.animation =
    "fadeIn 0.3s, fadeOut 0.3s " + (duration / 1000 - 0.3) + "s forwards";

  // Set background color based on type
  switch (type) {
    case "success":
      toast.style.backgroundColor = "rgba(16, 185, 129, 0.9)";
      break;
    case "error":
      toast.style.backgroundColor = "rgba(239, 68, 68, 0.9)";
      break;
    default:
      toast.style.backgroundColor = "rgba(99, 102, 241, 0.9)";
  }

  // Add icon based on type
  let icon = "";
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case "error":
      icon = '<i class="fas fa-exclamation-circle"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle"></i>';
  }

  // Set toast content
  toast.innerHTML = `
        <div style="display: flex; align-items: center;">
            <span style="margin-right: 10px; font-size: 18px;">${icon}</span>
            <span style="color: white;">${message}</span>
        </div>
        <button style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">
            <i class="fas fa-times"></i>
        </button>
    `;

  // Add close button functionality
  const closeButton = toast.querySelector("button");
  closeButton.addEventListener("click", () => {
    toastContainer.removeChild(toast);
  });

  // Add toast to container
  toastContainer.appendChild(toast);

  // Add CSS for animations if not already added
  if (!document.getElementById("toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
        `;
    document.head.appendChild(style);
  }

  // Remove toast after duration
  setTimeout(() => {
    if (toastContainer.contains(toast)) {
      toastContainer.removeChild(toast);
    }
  }, duration);
}

/**
 * Generate UUID for form fields
 * @param {string} elementId - ID of the element to update
 */
function generateUUID(elementId) {
  document.getElementById(elementId).value = generateUUIDv4();
}

/**
 * Generate password (same as UUID for consistency)
 * @param {string} elementId - ID of the element to update
 */
function generatePassword(elementId) {
  document.getElementById(elementId).value = generateUUIDv4();
}
