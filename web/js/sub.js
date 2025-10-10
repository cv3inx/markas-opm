/**
 * JavaScript for the subscription page
 */

// Configuration
const CONFIG = {
  proxyListUrl: "https://raw.githubusercontent.com/dit1304/proxie/main/proxyList.txt",
  apiCheckUrl: "https://api.jb8fd7grgd.workers.dev",
  mainDomains: ["zerostore.org"],
  defaultUuid: "bbbbbbbb-zero-store-eeee-ffffffffffff",
  maxProxies: 50,
  defaultProxyCount: 5,
  pathTemplate: "/ZEROSTORE/{ip}-{port}",
}

// Global variables
let proxyList = []
let filteredProxyList = []
let validatedProxies = []
let validationInProgress = false
let totalValidated = 0
let validCount = 0
let invalidCount = 0

// DOM Elements
const form = document.getElementById("subLinkForm")
const configTypeSelect = document.getElementById("configType")
const formatTypeSelect = document.getElementById("formatType")
const uuidInput = document.getElementById("uuid")
const generateUuidBtn = document.getElementById("generateUuid")
const bugTypeSelect = document.getElementById("bugType")
const mainDomainSelect = document.getElementById("mainDomain")
const customBugContainer = document.getElementById("customBugContainer")
const customBugInput = document.getElementById("customBug")
const tlsSelect = document.getElementById("tls")
const countrySelect = document.getElementById("country")
const limitInput = document.getElementById("limit")
const validateProxiesCheckbox = document.getElementById("validateProxies")
const loadingElement = document.getElementById("loading")
const validationStatusElement = document.getElementById("validation-status")
const validationCountElement = document.getElementById("validation-count")
const validationBarElement = document.getElementById("validation-bar")
const validCountElement = document.getElementById("valid-count")
const invalidCountElement = document.getElementById("invalid-count")
const errorMessageElement = document.getElementById("error-message")
const resultElement = document.getElementById("result")
const outputElement = document.getElementById("output")
const copyLinkBtn = document.getElementById("copyLink")

// Utility functions (UUID, copy to clipboard, base64 encode)
function generateUUIDv4() {
  return crypto.randomUUID()
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Failed to copy: ", err)
    return false
  }
}

function safeBase64Encode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)))
  } catch (e) {
    console.error("Error encoding base64:", e)
    return ""
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Populate main domains dropdown
  populateMainDomains()

  // Set up event listeners
  setupEventListeners()

  // Load proxy list
  loadProxyList()
})

// Populate main domains dropdown
function populateMainDomains() {
  CONFIG.mainDomains.forEach((domain) => {
    const option = document.createElement("option")
    option.value = domain
    option.textContent = domain
    mainDomainSelect.appendChild(option)
  })
}

// Set up event listeners
function setupEventListeners() {
  // Generate UUID button
  generateUuidBtn.addEventListener("click", () => {
    uuidInput.value = generateUUIDv4()
  })

  // Bug type change
  bugTypeSelect.addEventListener("change", () => {
    if (bugTypeSelect.value === "non-wildcard" || bugTypeSelect.value === "wildcard") {
      customBugContainer.style.display = "block"
    } else {
      customBugContainer.style.display = "none"
    }
  })

  // Form submission
  form.addEventListener("submit", handleFormSubmit)

  // Copy link button
  copyLinkBtn.addEventListener("click", () => {
    copyToClipboard(outputElement.value).then((success) => {
      if (success) {
        copyLinkBtn.innerHTML = `
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            COPIED SUCCESSFULLY
          `
        setTimeout(() => {
          copyLinkBtn.innerHTML = `
              <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              COPY CONFIGURATION
            `
        }, 2000)
      }
    })
  })
}

// Load proxy list
function loadProxyList() {
  showLoading("Fetching proxy list...")

  fetch(CONFIG.proxyListUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch proxy list")
      }
      return response.text()
    })
    .then((data) => {
      processProxyData(data)
      hideLoading()
    })
    .catch((error) => {
      console.error("Error loading proxy list:", error)
      showError("Failed to load proxy list. Please try again later.")
      hideLoading()
    })
}

// Process proxy data
function processProxyData(data) {
  // Split by lines and filter empty lines
  const lines = data.split(/\r?\n/).filter((line) => line.trim() !== "")

  if (lines.length === 0) {
    showError("No proxies found in the proxy list.")
    return
  }

  // Determine delimiter
  let delimiter = ","
  const firstLine = lines[0]
  if (firstLine.includes("\t")) {
    delimiter = "\t"
  } else if (firstLine.includes("|")) {
    delimiter = "|"
  } else if (firstLine.includes(";")) {
    delimiter = ";"
  }

  // Parse proxy list
  proxyList = lines
    .map((line) => {
      const parts = line.split(delimiter)
      if (parts.length >= 2) {
        return {
          ip: parts[0].trim(),
          port: parts[1].trim(),
          country: parts.length >= 3 ? parts[2].trim() : "Unknown",
          provider: parts.length >= 4 ? parts[3].trim() : "Unknown Provider",
        }
      }
      return null
    })
    .filter((proxy) => proxy && proxy.ip && proxy.port)

  // Populate country dropdown
  populateCountryDropdown()
}

// Populate country dropdown
function populateCountryDropdown() {
  // Get unique countries
  const countries = [...new Set(proxyList.map((proxy) => proxy.country))]
  countries.sort()

  // Clear existing options
  countrySelect.innerHTML = ""

  // Add "All Countries" option
  const allOption = document.createElement("option")
  allOption.value = ""
  allOption.textContent = "All Countries"
  countrySelect.appendChild(allOption)

  // Add country options
  countries.forEach((country) => {
    const option = document.createElement("option")
    option.value = country
    option.textContent = country
    countrySelect.appendChild(option)
  })
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault()

  // Reset error message
  errorMessageElement.textContent = ""
  errorMessageElement.style.display = "none"

  // Get form values
  const configType = configTypeSelect.value
  const formatType = formatTypeSelect.value
  const uuid = uuidInput.value
  const bugType = bugTypeSelect.value
  const mainDomain = mainDomainSelect.value
  const customBug = customBugInput.value
  const useTls = tlsSelect.value === "true"
  const country = countrySelect.value
  const limit = Number.parseInt(limitInput.value, 10)
  const validateProxies = validateProxiesCheckbox.checked

  // Validate inputs
  if (!uuid) {
    showError("Please enter a UUID.")
    return
  }

  if (limit < 1 || limit > CONFIG.maxProxies) {
    showError(`Proxy count must be between 1 and ${CONFIG.maxProxies}.`)
    return
  }

  // Filter proxies by country if selected
  filteredProxyList = country ? proxyList.filter((proxy) => proxy.country === country) : [...proxyList]

  // Check if we have enough proxies
  if (filteredProxyList.length === 0) {
    showError("No proxies found with the selected criteria.")
    return
  }

  // Shuffle the list to get random proxies
  shuffleArray(filteredProxyList)

  // Limit the number of proxies
  filteredProxyList = filteredProxyList.slice(0, limit)

  // Show loading
  showLoading("Generating configuration...")

  // Validate proxies if needed
  if (validateProxies) {
    await validateProxyList()
  }

  // Generate configuration
  const config = generateConfiguration(configType, formatType, uuid, bugType, mainDomain, customBug, useTls)

  // Show result
  showResult(config)
}

// Validate proxy list
async function validateProxyList() {
  validationInProgress = true
  validatedProxies = []
  totalValidated = 0
  validCount = 0
  invalidCount = 0

  // Show validation status
  validationStatusElement.style.display = "block"
  validationCountElement.textContent = `0/${filteredProxyList.length}`
  validationBarElement.style.width = "0%"
  validCountElement.textContent = "0"
  invalidCountElement.textContent = "0"
  invalidCountElement.textContent = "0"

  // Create a copy of the filtered list
  const proxiesToValidate = [...filteredProxyList]

  // Validate proxies in batches to avoid too many simultaneous requests
  const batchSize = 5
  const batches = Math.ceil(proxiesToValidate.length / batchSize)

  for (let i = 0; i < batches; i++) {
    const startIdx = i * batchSize
    const endIdx = Math.min(startIdx + batchSize, proxiesToValidate.length)
    const batch = proxiesToValidate.slice(startIdx, endIdx)

    // Validate batch in parallel
    await Promise.all(
      batch.map(async (proxy) => {
        const isValid = await validateProxy(proxy)
        totalValidated++

        // Update validation status
        const progress = (totalValidated / proxiesToValidate.length) * 100
        validationCountElement.textContent = `${totalValidated}/${proxiesToValidate.length}`
        validationBarElement.style.width = `${progress}%`

        if (isValid) {
          validCount++
          validCountElement.textContent = validCount
          validatedProxies.push(proxy)
        } else {
          invalidCount++
          invalidCountElement.textContent = invalidCount
        }
      }),
    )
  }

  // Use validated proxies if we have any, otherwise use the original filtered list
  if (validatedProxies.length > 0) {
    filteredProxyList = validatedProxies
  }

  validationInProgress = false
}

// Validate a single proxy
async function validateProxy(proxy) {
  try {
    const response = await fetch(`${CONFIG.apiCheckUrl}${proxy.ip}:${proxy.port}`)
    const data = await response.json()

    // Handle the new format where data is an array
    const proxyData = Array.isArray(data) ? data[0] : data

    return proxyData && proxyData.proxyip === true
  } catch (error) {
    console.error("Error validating proxy:", error)
    return false
  }
}

// Generate configuration
function generateConfiguration(configType, formatType, uuid, bugType, mainDomain, customBug, useTls) {
  // Determine which proxies to use
  const proxiesToUse = filteredProxyList

  // Generate configuration based on format type
  switch (formatType) {
    case "v2ray":
      return generateV2rayLinks(configType, proxiesToUse, uuid, bugType, mainDomain, customBug, useTls)
    case "clash":
      return generateClashConfig(configType, proxiesToUse, uuid, bugType, mainDomain, customBug, useTls)
    case "nekobox":
      // For Nekobox, we need to first parse the proxies into a format the new function can use
      const parsedLinks = []

      proxiesToUse.forEach((proxy) => {
        const path = CONFIG.pathTemplate.replace("{ip}", proxy.ip).replace("{port}", proxy.port)
        const port = useTls ? 443 : 80

        // Process custom bugs if provided
        const bugs =
          customBug && (bugType === "non-wildcard" || bugType === "wildcard")
            ? customBug.split(",").map((bug) => bug.trim())
            : [mainDomain]

        bugs.forEach((bug) => {
          // Determine domain, host, and SNI based on bug type
          let domain, host, sni

          switch (bugType) {
            case "default":
              domain = mainDomain
              host = mainDomain
              sni = mainDomain
              break
            case "non-wildcard":
              domain = bug
              host = mainDomain
              sni = mainDomain
              break
            case "wildcard":
              domain = bug
              host = `${bug}.${mainDomain}`
              sni = `${bug}.${mainDomain}`
              break
          }

          const countryCode = proxy.country
          const isp = proxy.provider

          if (configType === "vmess" || configType === "mix") {
            parsedLinks.push({
              type: "vmess",
              name: `[${parsedLinks.length + 1}] (${countryCode}) ${isp} [VMESS-${useTls ? "TLS" : "NTLS"}]`,
              server: domain,
              port: port,
              uuid: uuid,
              tls: useTls,
              sni: sni,
              wsHost: host,
              wsPath: path,
            })
          }

          if (configType === "vless" || configType === "mix") {
            parsedLinks.push({
              type: "vless",
              name: `[${parsedLinks.length + 1}] (${countryCode}) ${isp} [VLESS-${useTls ? "TLS" : "NTLS"}]`,
              server: domain,
              port: port,
              uuid: uuid,
              tls: useTls,
              sni: sni,
              wsHost: host,
              wsPath: path,
            })
          }

          if (configType === "trojan" || configType === "mix") {
            parsedLinks.push({
              type: "trojan",
              name: `[${parsedLinks.length + 1}] (${countryCode}) ${isp} [TROJAN-${useTls ? "TLS" : "NTLS"}]`,
              server: domain,
              port: port,
              password: uuid,
              tls: useTls,
              sni: sni,
              wsHost: host,
              wsPath: path,
            })
          }

          if (configType === "shadowsocks" || configType === "mix") {
            parsedLinks.push({
              type: "ss",
              name: `[${parsedLinks.length + 1}] (${countryCode}) ${isp} [SS-${useTls ? "TLS" : "NTLS"}]`,
              server: domain,
              port: port,
              password: uuid,
              tls: useTls,
              wsHost: host,
              wsPath: path,
            })
          }
        })
      })

      return generateNekoboxConfig(parsedLinks)
    default:
      return "Unsupported format type"
  }
}

// Generate V2Ray links
function generateV2rayLinks(configType, proxies, uuid, bugType, mainDomain, customBug, useTls) {
  const links = []

  // Process custom bugs if provided
  let bugs = []
  if (customBug && (bugType === "non-wildcard" || bugType === "wildcard")) {
    bugs = customBug.split(",").map((bug) => bug.trim())
  }

  // Generate links for each proxy
  proxies.forEach((proxy) => {
    const path = CONFIG.pathTemplate.replace("{ip}", proxy.ip).replace("{port}", proxy.port)
    const port = useTls ? 443 : 80
    const security = useTls ? "tls" : "none"

    // Generate links based on config type
    if (configType === "mix" || configType === "vmess") {
      // Generate VMess links
      if (bugs.length > 0) {
        bugs.forEach((bug, bugIndex) => {
          const server = bug
          const host = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const sni = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain

          const vmessConfig = {
            v: "2",
            ps: `[${links.length + 1}] ${proxy.country} - ${proxy.provider} [VMess-${useTls ? "TLS" : "NTLS"}]`,
            add: server,
            port: port,
            id: uuid,
            aid: "0",
            net: "ws",
            type: "none",
            host: host,
            path: path,
            tls: security,
            sni: sni,
            scy: "zero",
          }

          links.push(`vmess://${safeBase64Encode(JSON.stringify(vmessConfig))}`)
        })
      } else {
        // Direct connection without bug
        const vmessConfig = {
          v: "2",
          ps: `[${links.length + 1}] ${proxy.country} - ${proxy.provider} [VMess-${useTls ? "TLS" : "NTLS"}]`,
          add: mainDomain,
          port: port,
          id: uuid,
          aid: "0",
          net: "ws",
          type: "none",
          host: mainDomain,
          path: path,
          tls: security,
          sni: mainDomain,
          scy: "zero",
        }

        links.push(`vmess://${safeBase64Encode(JSON.stringify(vmessConfig))}`)
      }
    }

    if (configType === "mix" || configType === "vless") {
      // Generate VLESS links
      if (bugs.length > 0) {
        bugs.forEach((bug) => {
          const server = bug
          const host = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const sni = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const name = encodeURIComponent(
            `[${links.length + 1}] ${proxy.country} - ${proxy.provider} [VLESS-${useTls ? "TLS" : "NTLS"}]`,
          )
          const encodedPath = encodeURIComponent(path)

          links.push(
            `vless://${uuid}@${server}:${port}?encryption=none&security=${security}&type=ws&host=${host}&path=${encodedPath}&sni=${sni}#${name}`,
          )
        })
      } else {
        // Direct connection without bug
        const name = encodeURIComponent(
          `[${links.length + 1}] ${proxy.country} - ${proxy.provider} [VLESS-${useTls ? "TLS" : "NTLS"}]`,
        )
        const encodedPath = encodeURIComponent(path)

        links.push(
          `vless://${uuid}@${mainDomain}:${port}?encryption=none&security=${security}&type=ws&host=${mainDomain}&path=${encodedPath}&sni=${mainDomain}#${name}`,
        )
      }
    }

    if (configType === "mix" || configType === "trojan") {
      // Generate Trojan links
      if (bugs.length > 0) {
        bugs.forEach((bug) => {
          const server = bug
          const host = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const sni = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const name = encodeURIComponent(
            `[${links.length + 1}] ${proxy.country} - ${proxy.provider} [Trojan-${useTls ? "TLS" : "NTLS"}]`,
          )
          const encodedPath = encodeURIComponent(path)

          links.push(
            `trojan://${uuid}@${server}:${port}?security=${security}&type=ws&host=${host}&path=${encodedPath}&sni=${sni}#${name}`,
          )
        })
      } else {
        // Direct connection without bug
        const name = encodeURIComponent(
          `[${links.length + 1}] ${proxy.country} - ${proxy.provider} [Trojan-${useTls ? "TLS" : "NTLS"}]`,
        )
        const encodedPath = encodeURIComponent(path)

        links.push(
          `trojan://${uuid}@${mainDomain}:${port}?security=${security}&type=ws&host=${mainDomain}&path=${encodedPath}&sni=${mainDomain}#${name}`,
        )
      }
    }

    if (configType === "mix" || configType === "shadowsocks") {
      // Generate Shadowsocks links
      if (bugs.length > 0) {
        bugs.forEach((bug) => {
          const server = bug
          const host = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const sni = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const name = encodeURIComponent(
            `[${links.length + 1}] ${proxy.country} - ${proxy.provider} [SS-${useTls ? "TLS" : "NTLS"}]`,
          )
          const encodedPath = encodeURIComponent(path)
          const method = "none"
          const userInfo = safeBase64Encode(`${method}:${uuid}`)

          links.push(
            `ss://${userInfo}@${server}:${port}?encryption=none&type=ws&host=${host}&path=${encodedPath}&security=${security}&sni=${sni}#${name}`,
          )
        })
      } else {
        // Direct connection without bug
        const name = encodeURIComponent(
          `[${links.length + 1}] ${proxy.country} - ${proxy.provider} [SS-${useTls ? "TLS" : "NTLS"}]`,
        )
        const encodedPath = encodeURIComponent(path)
        const method = "none"
        const userInfo = safeBase64Encode(`${method}:${uuid}`)

        links.push(
          `ss://${userInfo}@${mainDomain}:${port}?encryption=none&type=ws&host=${mainDomain}&path=${encodedPath}&security=${security}&sni=${mainDomain}#${name}`,
        )
      }
    }
  })

  return links.join("\n")
}

// Generate Clash configuration
function generateClashConfig(configType, proxies, uuid, bugType, mainDomain, customBug, useTls) {
  let config = `# Clash Proxy Provider Configuration
# Generated by Inconigto-Mode
# Date: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })}
# Protocol: ${configType.toUpperCase()}
# TLS: ${useTls ? "Enabled" : "Disabled"}

proxies:\n`

  // Process custom bugs if provided
  let bugs = []
  if (customBug && (bugType === "non-wildcard" || bugType === "wildcard")) {
    bugs = customBug.split(",").map((bug) => bug.trim())
  }

  // Generate configuration for each proxy
  proxies.forEach((proxy) => {
    const path = CONFIG.pathTemplate.replace("{ip}", proxy.ip).replace("{port}", proxy.port)
    const port = useTls ? 443 : 80
    const tls = useTls

    // Generate configuration based on config type
    if (configType === "mix" || configType === "vmess") {
      // Generate VMess configuration
      if (bugs.length > 0) {
        bugs.forEach((bug, bugIndex) => {
          const server = bug
          const host = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const sni = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const name = `[${proxies.indexOf(proxy) * bugs.length + bugIndex + 1}] ${proxy.country} - ${proxy.provider} [VMess-${useTls ? "TLS" : "NTLS"}]`

          config += `
  - name: "${name}"
    type: vmess
    server: ${server}
    port: ${port}
    uuid: ${uuid}
    alterId: 0
    cipher: zero
    udp: false
    tls: ${tls}
    skip-cert-verify: true
    servername: ${sni}
    network: ws
    ws-opts:
      path: ${path}
      headers:
        Host: ${host}
`
        })
      } else {
        // Direct connection without bug
        const name = `[${proxies.indexOf(proxy) + 1}] ${proxy.country} - ${proxy.provider} [VMess-${useTls ? "TLS" : "NTLS"}]`

        config += `
  - name: "${name}"
    type: vmess
    server: ${mainDomain}
    port: ${port}
    uuid: ${uuid}
    alterId: 0
    cipher: zero
    udp: false
    tls: ${tls}
    skip-cert-verify: true
    servername: ${mainDomain}
    network: ws
    ws-opts:
      path: ${path}
      headers:
        Host: ${mainDomain}
`
      }
    }

    if (configType === "mix" || configType === "vless") {
      // Generate VLESS configuration
      if (bugs.length > 0) {
        bugs.forEach((bug, bugIndex) => {
          const server = bug
          const host = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const sni = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const name = `[${proxies.indexOf(proxy) * bugs.length + bugIndex + 1}] ${proxy.country} - ${proxy.provider} [VLESS-${useTls ? "TLS" : "NTLS"}]`

          config += `
  - name: "${name}"
    type: vless
    server: ${server}
    port: ${port}
    uuid: ${uuid}
    udp: false
    tls: ${tls}
    skip-cert-verify: true
    servername: ${sni}
    network: ws
    ws-opts:
      path: ${path}
      headers:
        Host: ${host}
`
        })
      } else {
        // Direct connection without bug
        const name = `[${proxies.indexOf(proxy) + 1}] ${proxy.country} - ${proxy.provider} [VLESS-${useTls ? "TLS" : "NTLS"}]`

        config += `
  - name: "${name}"
    type: vless
    server: ${mainDomain}
    port: ${port}
    uuid: ${uuid}
    udp: false
    tls: ${tls}
    skip-cert-verify: true
    servername: ${mainDomain}
    network: ws
    ws-opts:
      path: ${path}
      headers:
        Host: ${mainDomain}
`
      }
    }

    if (configType === "mix" || configType === "trojan") {
      // Generate Trojan configuration
      if (bugs.length > 0) {
        bugs.forEach((bug, bugIndex) => {
          const server = bug
          const host = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const sni = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const name = `[${proxies.indexOf(proxy) * bugs.length + bugIndex + 1}] ${proxy.country} - ${proxy.provider} [Trojan-${useTls ? "TLS" : "NTLS"}]`

          config += `
  - name: "${name}"
    type: trojan
    server: ${server}
    port: ${port}
    password: ${uuid}
    udp: false
    sni: ${sni}
    skip-cert-verify: true
    network: ws
    ws-opts:
      path: ${path}
      headers:
        Host: ${host}
`
        })
      } else {
        // Direct connection without bug
        const name = `[${proxies.indexOf(proxy) + 1}] ${proxy.country} - ${proxy.provider} [Trojan-${useTls ? "TLS" : "NTLS"}]`

        config += `
  - name: "${name}"
    type: trojan
    server: ${mainDomain}
    port: ${port}
    password: ${uuid}
    udp: false
    sni: ${mainDomain}
    skip-cert-verify: true
    network: ws
    ws-opts:
      path: ${path}
      headers:
        Host: ${mainDomain}
`
      }
    }

    if (configType === "mix" || configType === "shadowsocks") {
      // Generate Shadowsocks configuration
      if (bugs.length > 0) {
        bugs.forEach((bug, bugIndex) => {
          const server = bug
          const host = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const sni = bugType === "wildcard" ? `${bug}.${mainDomain}` : mainDomain
          const name = `[${proxies.indexOf(proxy) * bugs.length + bugIndex + 1}] ${proxy.country} - ${proxy.provider} [SS-${useTls ? "TLS" : "NTLS"}]`

          config += `
  - name: "${name}"
    type: ss
    server: ${server}
    port: ${port}
    cipher: none
    password: ${uuid}
    udp: false
    plugin: v2ray-plugin
    plugin-opts:
      mode: websocket
      tls: ${tls}
      skip-cert-verify: true
      host: ${host}
      path: ${path}
      mux: false
`
        })
      } else {
        // Direct connection without bug
        const name = `[${proxies.indexOf(proxy) + 1}] ${proxy.country} - ${proxy.provider} [SS-${useTls ? "TLS" : "NTLS"}]`

        config += `
  - name: "${name}"
    type: ss
    server: ${mainDomain}
    port: ${port}
    cipher: none
    password: ${uuid}
    udp: false
    plugin: v2ray-plugin
    plugin-opts:
      mode: websocket
      tls: ${tls}
      skip-cert-verify: true
      host: ${mainDomain}
      path: ${path}
      mux: false
`
      }
    }
  })

  return config
}

function generateNekoboxConfig(parsedLinks) {
  let config = `##ZEROSTORE##
{
  "dns": {
    "final": "dns-final",
    "independent_cache": true,
    "rules": [
      {
        "disable_cache": false,
        "domain": [
          "family.cloudflare-dns.com"
        ],
        "server": "direct-dns"
      }
    ],
    "servers": [
      {
        "address": "https://family.cloudflare-dns.com/dns-query",
        "address_resolver": "direct-dns",
        "strategy": "ipv4_only",
        "tag": "remote-dns"
      },
      {
        "address": "local",
        "strategy": "ipv4_only",
        "tag": "direct-dns"
      },
      {
        "address": "local",
        "address_resolver": "dns-local",
        "strategy": "ipv4_only",
        "tag": "dns-final"
      },
      {
        "address": "local",
        "tag": "dns-local"
      },
      {
        "address": "rcode://success",
        "tag": "dns-block"
      }
    ]
  },
  "experimental": {
    "cache_file": {
      "enabled": true,
      "path": "../cache/clash.db",
      "store_fakeip": true
    },
    "clash_api": {
      "external_controller": "127.0.0.1:9090",
      "external_ui": "../files/yacd"
    }
  },
  "inbounds": [
    {
      "listen": "0.0.0.0",
      "listen_port": 6450,
      "override_address": "8.8.8.8",
      "override_port": 53,
      "tag": "dns-in",
      "type": "direct"
    },
    {
      "domain_strategy": "",
      "endpoint_independent_nat": true,
      "inet4_address": [
        "172.19.0.1/28"
      ],
      "mtu": 9000,
      "endpoint_independent_nat": true,
      "inet4_address": [
        "172.19.0.1/28"
      ],
      "mtu": 9000,
      "sniff": true,
      "sniff_override_destination": true,
      "stack": "system",
      "tag": "tun-in",
      "type": "tun"
    },
    {
      "domain_strategy": "",
      "listen": "0.0.0.0",
      "listen_port": 2080,
      "sniff": true,
      "sniff_override_destination": true,
      "tag": "mixed-in",
      "type": "mixed"
    }
  ],
  "log": {
    "level": "info"
  },
  "outbounds": [
    {
      "outbounds": [
        "Best Latency",
`

  // Add proxy tags
  const proxyTags = parsedLinks.map((proxy) => `        "${proxy.name}",`).join("\n")
  config += proxyTags + "\n"
  config += `        "direct"
      ],
      "tag": "Internet",
      "type": "selector"
    },
    {
      "interval": "1m0s",
      "outbounds": [
`
  // Add proxy tags again for Best Latency
  config += proxyTags + "\n"
  config += `        "direct"
      ],
      "tag": "Best Latency",
      "type": "urltest",
      "url": "https://detectportal.firefox.com/success.txt"
    },
`

  // Add all proxy configurations
  const proxyConfigs = parsedLinks
    .map((proxy, index) => {
      let proxyConfig = ""

      if (proxy.type === "vmess") {
        proxyConfig = `    {
      "alter_id": 0,
      "packet_encoding": "",
      "security": "zero",
      "server": "${proxy.server}",
      "server_port": ${proxy.port},${
        proxy.tls
          ? `
      "tls": {
        "enabled": true,
        "insecure": false,
        "server_name": "${proxy.sni || proxy.server}",
        "utls": {
          "enabled": true,
          "fingerprint": "randomized"
        }
      },`
          : ""
      }
      "transport": {
        "headers": {
          "Host": "${proxy.wsHost || proxy.server}"
        },
        "path": "${proxy.wsPath}",
        "type": "ws"
      },
      "uuid": "${proxy.uuid}",
      "type": "vmess",
      "domain_strategy": "prefer_ipv4",
      "tag": "${proxy.name}"
    }`
      } else if (proxy.type === "vless") {
        proxyConfig = `    {
      "domain_strategy": "ipv4_only",
      "flow": "",
      "multiplex": {
        "enabled": false,
        "max_streams": 32,
        "protocol": "smux"
      },
      "packet_encoding": "xudp",
      "server": "${proxy.server}",
      "server_port": ${proxy.port},
      "tag": "${proxy.name}",${
        proxy.tls
          ? `
      "tls": {
        "enabled": true,
        "insecure": false,
        "server_name": "${proxy.sni || proxy.server}",
        "utls": {
          "enabled": true,
          "fingerprint": "randomized"
        }
      },`
          : ""
      }
      "transport": {
        "early_data_header_name": "Sec-WebSocket-Protocol",
        "headers": {
          "Host": "${proxy.wsHost || proxy.server}"
        },
        "max_early_data": 0,
        "path": "${proxy.wsPath}",
        "type": "ws"
      },
      "type": "vless",
      "uuid": "${proxy.uuid}"
    }`
      } else if (proxy.type === "trojan") {
        proxyConfig = `    {
      "domain_strategy": "ipv4_only",
      "multiplex": {
        "enabled": false,
        "max_streams": 32,
        "protocol": "smux"
      },
      "password": "${proxy.password}",
      "server": "${proxy.server}",
      "server_port": ${proxy.port},
      "tag": "${proxy.name}",${
        proxy.tls
          ? `
      "tls": {
        "enabled": true,
        "insecure": false,
        "server_name": "${proxy.sni || proxy.server}",
        "utls": {
          "enabled": true,
          "fingerprint": "randomized"
        }
      },`
          : ""
      }
      "transport": {
        "early_data_header_name": "Sec-WebSocket-Protocol",
        "headers": {
          "Host": "${proxy.wsHost || proxy.server}"
        },
        "max_early_data": 0,
        "path": "${proxy.wsPath}",
        "type": "ws"
      },
      "type": "trojan"
    }`
      } else if (proxy.type === "ss") {
        proxyConfig = `    {
      "type": "shadowsocks",
      "tag": "${proxy.name}",
      "server": "${proxy.server}",
      "server_port": ${proxy.port},
      "method": "none",
      "password": "${proxy.password}",
      "plugin": "v2ray-plugin",
      "plugin_opts": "mux=0;path=${proxy.wsPath};host=${proxy.wsHost || proxy.server};tls=${proxy.tls ? "1" : "0"}"
    }`
      }

      return proxyConfig
    })
    .join(",\n")

  config += proxyConfigs

  // Add the remaining outbounds
  config += `,
    {
      "tag": "direct",
      "type": "direct"
    },
    {
      "tag": "bypass",
      "type": "direct"
    },
    {
      "tag": "block",
      "type": "block"
    },
    {
      "tag": "dns-out",
      "type": "dns"
    }
  ],
  "route": {
    "auto_detect_interface": true,
    "rules": [
      {
        "outbound": "dns-out",
        "port": [
          53
        ]
      },
      {
        "inbound": [
          "dns-in"
        ],
        "outbound": "dns-out"
      },
      {
        "network": [
          "udp"
        ],
        "outbound": "block",
        "port": [
          443
        ],
        "port_range": []
      },
      {
        "ip_cidr": [
          "224.0.0.0/3",
          "ff00::/8"
        ],
        "outbound": "block",
        "source_ip_cidr": [
          "224.0.0.0/3",
          "ff00::/8"
        ]
      }
    ]
  }
}`

  return config
}

// Show loading message
function showLoading(message) {
  loadingElement.style.display = "block"
  loadingElement.querySelector(".loading-text").textContent = message
  resultElement.style.display = "none"
  validationStatusElement.style.display = "none"
}

// Hide loading message
function hideLoading() {
  loadingElement.style.display = "none"
}

// Show error message
function showError(message) {
  errorMessageElement.textContent = message
  errorMessageElement.style.display = "block"
}

// Show result
function showResult(config) {
  // Hide loading and validation status
  hideLoading()
  validationStatusElement.style.display = "none"

  // Set output text
  outputElement.value = config

  // Show result section
  resultElement.style.display = "block"

  // Scroll to result
  resultElement.scrollIntoView({ behavior: "smooth" })
}

// Utility function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
