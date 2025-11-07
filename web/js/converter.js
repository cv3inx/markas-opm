/**
 * JavaScript for the converter page
 */

document.addEventListener('DOMContentLoaded', () => {
   // DOM Elements
   const v2rayToConfigBtn = document.getElementById('v2ray-to-config')
   const configToV2rayBtn = document.getElementById('config-to-v2ray')
   const v2rayToConfigSection = document.getElementById('v2ray-to-config-section')
   const configToV2raySection = document.getElementById('config-to-v2ray-section')

   const clashFormatBtn = document.getElementById('clash-format')
   const nekoboxFormatBtn = document.getElementById('nekobox-format')
   const clashTypeBtn = document.getElementById('clash-type')

   const v2rayInput = document.getElementById('v2ray-input')
   const configInput = document.getElementById('config-input')
   const configOutput = document.getElementById('config-output')
   const v2rayOutput = document.getElementById('v2ray-output')

   const convertV2rayBtn = document.getElementById('convert-v2ray')
   const convertConfigBtn = document.getElementById('convert-config')

   const copyConfigBtn = document.getElementById('copy-config')
   const copyV2rayBtn = document.getElementById('copy-v2ray')

   const loadingIndicator = document.getElementById('loading-indicator')
   const errorMessage = document.getElementById('error-message')

   // Clash configuration options
   const fakeIpBtn = document.getElementById('fake-ip')
   const redirHostBtn = document.getElementById('redir-host')
   const bestPingBtn = document.getElementById('best-ping')
   const loadBalanceBtn = document.getElementById('load-balance')
   const fallbackBtn = document.getElementById('fallback')
   const allGroupsBtn = document.getElementById('all-groups')
   const adsBlockBtn = document.getElementById('ads-block')
   const pornBlockBtn = document.getElementById('porn-block')
   const clashOptionsSection = document.getElementById('clash-options')

   // Direction toggle
   v2rayToConfigBtn.addEventListener('click', () => {
      v2rayToConfigBtn.classList.add('active')
      configToV2rayBtn.classList.remove('active')
      v2rayToConfigSection.classList.remove('hidden')
      configToV2raySection.classList.add('hidden')
      hideError()
   })

   configToV2rayBtn.addEventListener('click', () => {
      configToV2rayBtn.classList.add('active')
      v2rayToConfigBtn.classList.remove('active')
      configToV2raySection.classList.remove('hidden')
      v2rayToConfigSection.classList.add('hidden')
      hideError()
   })

   // Format toggle for V2Ray to Config
   clashFormatBtn.addEventListener('click', () => {
      clashFormatBtn.classList.add('active')
      nekoboxFormatBtn.classList.remove('active')
      toggleClashOptions()
      hideError()
   })

   nekoboxFormatBtn.addEventListener('click', () => {
      nekoboxFormatBtn.classList.add('active')
      clashFormatBtn.classList.remove('active')
      toggleClashOptions()
      hideError()
   })

   // Format toggle for Config to V2Ray
   clashTypeBtn.addEventListener('click', () => {
      clashTypeBtn.classList.add('active')
      hideError()
   })

   // Configuration type toggle for V2Ray to Config
   const minimalConfigBtn = document.getElementById('minimal-config')
   const fullConfigBtn = document.getElementById('full-config')
   const minimalConfigReverseBtn = document.getElementById('minimal-config-reverse')
   const fullConfigReverseBtn = document.getElementById('full-config-reverse')

   minimalConfigBtn.addEventListener('click', () => {
      minimalConfigBtn.classList.add('active')
      fullConfigBtn.classList.remove('active')
      hideError()

      // Update download button visibility
      saveProxyProviderBtn.style.display = 'flex'
      saveFullConfigBtn.style.display = 'none'
   })

   fullConfigBtn.addEventListener('click', () => {
      fullConfigBtn.classList.add('active')
      minimalConfigBtn.classList.remove('active')
      hideError()

      // Update download button visibility
      saveProxyProviderBtn.style.display = 'none'
      saveFullConfigBtn.style.display = 'flex'
   })

   // Configuration type toggle for Config to V2Ray
   minimalConfigReverseBtn.addEventListener('click', () => {
      minimalConfigReverseBtn.classList.add('active')
      fullConfigReverseBtn.classList.remove('active')
      hideError()
   })

   fullConfigReverseBtn.addEventListener('click', () => {
      fullConfigReverseBtn.classList.add('active')
      minimalConfigReverseBtn.classList.remove('active')
      hideError()
   })

   // Toggle DNS mode options
   fakeIpBtn.addEventListener('click', () => {
      fakeIpBtn.classList.add('active')
      redirHostBtn.classList.remove('active')
      hideError()
   })

   redirHostBtn.addEventListener('click', () => {
      redirHostBtn.classList.add('active')
      fakeIpBtn.classList.remove('active')
      hideError()
   })

   // Toggle proxy group options
   bestPingBtn.addEventListener('click', () => {
      bestPingBtn.classList.toggle('active')
      hideError()
   })

   loadBalanceBtn.addEventListener('click', () => {
      loadBalanceBtn.classList.toggle('active')
      hideError()
   })

   fallbackBtn.addEventListener('click', () => {
      fallbackBtn.classList.toggle('active')
      hideError()
   })

   allGroupsBtn.addEventListener('click', () => {
      if (allGroupsBtn.classList.contains('active')) {
         allGroupsBtn.classList.remove('active')
      } else {
         allGroupsBtn.classList.add('active')
         bestPingBtn.classList.add('active')
         loadBalanceBtn.classList.add('active')
         fallbackBtn.classList.add('active')
      }
      hideError()
   })

   // Toggle rule set options
   adsBlockBtn.addEventListener('click', () => {
      adsBlockBtn.classList.toggle('active')
      hideError()
   })

   pornBlockBtn.addEventListener('click', () => {
      pornBlockBtn.classList.toggle('active')
      hideError()
   })

   // Convert V2Ray to Config
   convertV2rayBtn.addEventListener('click', () => {
      const v2rayLinks = v2rayInput.value.trim()
      if (!v2rayLinks) {
         showError('Please enter V2Ray links to convert')
         return
      }

      showLoading()
      setTimeout(() => {
         try {
            const result = convertV2rayToConfig(v2rayLinks, 'clash')
            configOutput.value = result
            hideLoading()
         } catch (error) {
            hideLoading()
            showError(error.message || 'Failed to convert V2Ray links. Please check your input.')
         }
      }, 500)
   })

   // Convert Config to V2Ray
   convertConfigBtn.addEventListener('click', () => {
      const configText = configInput.value.trim()
      if (!configText) {
         showError('Please enter configuration to convert')
         return
      }

      showLoading()
      setTimeout(() => {
         try {
            const result = parseClashConfig(configText, fullConfigReverseBtn.classList.contains('active'))
            v2rayOutput.value = result
            hideLoading()
         } catch (error) {
            hideLoading()
            showError(error.message || 'Failed to convert configuration. Please check your input.')
         }
      }, 500)
   })

   // Copy buttons
   copyConfigBtn.addEventListener('click', () => {
      copyToClipboard(configOutput.value)
      copyConfigBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'
      setTimeout(() => {
         copyConfigBtn.innerHTML = '<i class="far fa-copy"></i> Copy'
      }, 2000)
   })

   copyV2rayBtn.addEventListener('click', () => {
      copyToClipboard(v2rayOutput.value)
      copyV2rayBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'
      setTimeout(() => {
         copyV2rayBtn.innerHTML = '<i class="far fa-copy"></i> Copy'
      }, 2000)
   })

   // Download functions
   function downloadAsYaml(content, filename) {
      // Create a blob with the YAML content
      const blob = new Blob([content], { type: 'text/yaml' })

      // Create a URL for the blob
      const url = URL.createObjectURL(blob)

      // Create a temporary link element
      const a = document.createElement('a')
      a.href = url
      a.download = filename

      // Trigger the download
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Show success toast
      showToast(`File "${filename}" downloaded successfully!`)
   }

   function showToast(message) {
      // Create toast element if it doesn't exist
      let toast = document.getElementById('toast-notification')
      if (!toast) {
         toast = document.createElement('div')
         toast.id = 'toast-notification'
         toast.className = 'toast-notification'
         toast.innerHTML = `<i class="fas fa-check-circle"></i> <span id="toast-message"></span>`
         document.body.appendChild(toast)
      }

      // Set message and show toast
      document.getElementById('toast-message').textContent = message
      toast.classList.add('show')

      // Hide toast after 3 seconds
      setTimeout(() => {
         toast.classList.remove('show')
      }, 3000)
   }

   // Download buttons for V2Ray to Config
   const saveProxyProviderBtn = document.getElementById('save-proxy-provider')
   const saveFullConfigBtn = document.getElementById('save-full-config')

   saveProxyProviderBtn.addEventListener('click', () => {
      const content = configOutput.value
      if (!content) {
         showError('No content to download. Please convert first.')
         return
      }

      // Add timestamp to filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
      downloadAsYaml(content, `proxy_provider_${timestamp}.yaml`)
   })

   saveFullConfigBtn.addEventListener('click', () => {
      const content = configOutput.value
      if (!content) {
         showError('No content to download. Please convert first.')
         return
      }

      // Add timestamp to filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
      downloadAsYaml(content, `markas-opm_${timestamp}.yaml`)
   })

   // Download button for Config to V2Ray
   const saveV2rayLinksBtn = document.getElementById('save-v2ray-links')

   saveV2rayLinksBtn.addEventListener('click', () => {
      const content = v2rayOutput.value
      if (!content) {
         showError('No content to download. Please convert first.')
         return
      }

      // Add timestamp to filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
      downloadAsYaml(content, `v2ray_links_${timestamp}.txt`)
   })

   // Update button visibility based on configuration type
   if (minimalConfigBtn.classList.contains('active')) {
      saveProxyProviderBtn.style.display = 'flex'
      saveFullConfigBtn.style.display = 'none'
   } else {
      saveProxyProviderBtn.style.display = 'none'
      saveFullConfigBtn.style.display = 'flex'
   }

   // Helper functions
   function showLoading() {
      loadingIndicator.classList.remove('hidden')
   }

   function hideLoading() {
      loadingIndicator.classList.add('hidden')
   }

   function showError(message) {
      errorMessage.textContent = message
      errorMessage.classList.remove('hidden')
   }

   function hideError() {
      errorMessage.classList.add('hidden')
   }

   async function copyToClipboard(text) {
      try {
         await navigator.clipboard.writeText(text)
         return true
      } catch (err) {
         console.error('Failed to copy: ', err)

         // Fallback method
         const textarea = document.createElement('textarea')
         textarea.value = text
         textarea.style.position = 'fixed'
         textarea.style.opacity = '0'
         document.body.appendChild(textarea)
         textarea.select()
         document.execCommand('copy')
         document.body.removeChild(textarea)

         return true
      }
   }

   // Conversion functions
   function convertV2rayToConfig(v2rayLinks, outputFormat) {
      // Split input by lines
      const links = v2rayLinks.split(/\r?\n/).filter(line => line.trim() !== '')

      if (links.length === 0) {
         throw new Error('No valid V2Ray links found')
      }

      // Process each link
      const parsedLinks = links.map(link => parseV2rayLink(link))

      // Get configuration type
      const isFullConfig = fullConfigBtn.classList.contains('active')

      // Get Clash configuration options
      const useFakeIp = fakeIpBtn.classList.contains('active')
      const useBestPing = bestPingBtn.classList.contains('active')
      const useLoadBalance = loadBalanceBtn.classList.contains('active')
      const useFallback = fallbackBtn.classList.contains('active')
      const useAllGroups = allGroupsBtn.classList.contains('active')
      const useAdsBlock = adsBlockBtn.classList.contains('active')
      const usePornBlock = pornBlockBtn.classList.contains('active')

      // Generate output based on format
      if (clashFormatBtn.classList.contains('active')) {
         return generateClashConfig(parsedLinks, isFullConfig, {
            useFakeIp,
            useBestPing,
            useLoadBalance,
            useFallback,
            useAllGroups,
            useAdsBlock,
            usePornBlock
         })
      } else if (nekoboxFormatBtn.classList.contains('active')) {
         return generateNekoboxConfig(parsedLinks, isFullConfig)
      }
   }

   function parseClashConfig(configText, isFullConfig) {
      try {
         // Parse YAML to extract proxies
         const lines = configText.split('\n')
         const proxies = []
         let inProxiesSection = false
         let currentProxy = {}
         let indentLevel = 0

         for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trimRight()

            // Skip empty lines and comments
            if (line.trim() === '' || line.trim().startsWith('#')) {
               continue
            }

            // Check if we're entering the proxies section
            if (line.trim() === 'proxies:') {
               inProxiesSection = true
               continue
            }

            // If we're in the proxies section
            if (inProxiesSection) {
               // Check indentation to determine if we're still in the proxies section
               const currentIndent = line.search(/\S/)

               // If this is a new proxy entry (starts with "- name:")
               if (line.trim().startsWith('- name:')) {
                  // If we already have a proxy being built, add it to the list
                  if (Object.keys(currentProxy).length > 0) {
                     proxies.push(currentProxy)
                     currentProxy = {}
                  }

                  // Extract the name
                  const nameMatch = line.match(/- name: "(.+)"/)
                  if (nameMatch && nameMatch[1]) {
                     currentProxy.name = nameMatch[1]
                  }

                  // Set the indent level for this proxy
                  indentLevel = currentIndent
               } else if (currentIndent <= indentLevel && !line.trim().startsWith('-') && line.includes(':')) {
                  // We've exited the proxies section or moved to a new section
                  if (line.trim() === 'proxy-groups:' || line.trim() === 'rules:') {
                     inProxiesSection = false
                     if (Object.keys(currentProxy).length > 0) {
                        proxies.push(currentProxy)
                        currentProxy = {}
                     }
                     continue
                  }
               }

               // If we're still processing a proxy
               if (Object.keys(currentProxy).length > 0) {
                  // Extract proxy properties
                  if (line.includes('type:')) {
                     const typeMatch = line.match(/type: (\w+)/)
                     if (typeMatch && typeMatch[1]) {
                        currentProxy.type = typeMatch[1]
                     }
                  } else if (line.includes('server:')) {
                     const serverMatch = line.match(/server: (.+)/)
                     if (serverMatch && serverMatch[1]) {
                        currentProxy.server = serverMatch[1]
                     }
                  } else if (line.includes('port:')) {
                     const portMatch = line.match(/port: (\d+)/)
                     if (portMatch && portMatch[1]) {
                        currentProxy.port = Number.parseInt(portMatch[1], 10)
                     }
                  } else if (line.includes('uuid:')) {
                     const uuidMatch = line.match(/uuid: (.+)/)
                     if (uuidMatch && uuidMatch[1]) {
                        currentProxy.uuid = uuidMatch[1]
                     }
                  } else if (line.includes('password:')) {
                     const passwordMatch = line.match(/password: (.+)/)
                     if (passwordMatch && passwordMatch[1]) {
                        currentProxy.password = passwordMatch[1]
                     }
                  } else if (line.includes('cipher:')) {
                     const cipherMatch = line.match(/cipher: (.+)/)
                     if (cipherMatch && cipherMatch[1]) {
                        currentProxy.cipher = cipherMatch[1]
                     }
                  } else if (line.includes('tls:')) {
                     const tlsMatch = line.match(/tls: (true|false)/)
                     if (tlsMatch && tlsMatch[1]) {
                        currentProxy.tls = tlsMatch[1] === 'true'
                     }
                  } else if (line.includes('network:')) {
                     const networkMatch = line.match(/network: (.+)/)
                     if (networkMatch && networkMatch[1]) {
                        currentProxy.network = networkMatch[1]
                     }
                  } else if (line.includes('servername:') || line.includes('sni:')) {
                     const sniMatch = line.match(/(servername|sni): (.+)/)
                     if (sniMatch && sniMatch[2]) {
                        currentProxy.sni = sniMatch[2]
                     }
                  } else if (line.includes('path:') && !line.includes('ws-opts:')) {
                     const pathMatch = line.match(/path: (.+)/)
                     if (pathMatch && pathMatch[1]) {
                        currentProxy.path = pathMatch[1]
                     }
                  } else if (line.includes('ws-opts:')) {
                     // We're entering the ws-opts section
                     currentProxy.wsOpts = {}
                  } else if (currentProxy.wsOpts !== undefined) {
                     // We're inside the ws-opts section
                     if (line.includes('path:')) {
                        const pathMatch = line.match(/path: (.+)/)
                        if (pathMatch && pathMatch[1]) {
                           currentProxy.path = pathMatch[1]
                        }
                     } else if (line.includes('headers:')) {
                        currentProxy.wsOpts.headers = {}
                     } else if (currentProxy.wsOpts.headers !== undefined) {
                        // We're inside the headers section
                        if (line.includes('Host:')) {
                           const hostMatch = line.match(/Host: (.+)/)
                           if (hostMatch && hostMatch[1]) {
                              currentProxy.host = hostMatch[1]
                           }
                        }
                     }
                  }
               }
            }
         }

         // Add the last proxy if there is one
         if (Object.keys(currentProxy).length > 0) {
            proxies.push(currentProxy)
         }

         // Convert proxies to V2Ray links
         return convertProxiesToV2RayLinks(proxies)
      } catch (error) {
         console.error('Error parsing Clash config:', error)
         throw new Error('Failed to parse Clash configuration. Please check the format.')
      }
   }

   // Add this new function to convert proxies to V2Ray links
   function convertProxiesToV2RayLinks(proxies) {
      const v2rayLinks = []

      proxies.forEach(proxy => {
         let link = ''

         if (proxy.type === 'vmess') {
            // Create VMess config object
            const vmessConfig = {
               v: '2',
               ps: proxy.name,
               add: proxy.server,
               port: proxy.port,
               id: proxy.uuid,
               aid: '0',
               net: proxy.network || 'tcp',
               type: 'none',
               host: proxy.host || proxy.server,
               path: proxy.path || '',
               tls: proxy.tls ? 'tls' : '',
               sni: proxy.sni || proxy.server,
               scy: proxy.cipher || 'auto'
            }

            // Convert to base64 and create VMess link
            link = `vmess://${btoa(JSON.stringify(vmessConfig))}`
         } else if (proxy.type === 'vless') {
            // Create VLESS link
            const uuid = proxy.uuid
            const server = proxy.server
            const port = proxy.port
            const encryption = 'none'
            const security = proxy.tls ? 'tls' : 'none'
            const type = proxy.network || 'tcp'
            const host = encodeURIComponent(proxy.host || proxy.server)
            const path = encodeURIComponent(proxy.path || '')
            const sni = encodeURIComponent(proxy.sni || proxy.server)
            const name = encodeURIComponent(proxy.name)

            link = `vless://${uuid}@${server}:${port}?encryption=${encryption}&security=${security}&type=${type}&host=${host}&path=${path}&sni=${sni}#${name}`
         } else if (proxy.type === 'trojan') {
            // Create Trojan link
            const password = proxy.password || proxy.uuid
            const server = proxy.server
            const port = proxy.port
            const security = proxy.tls ? 'tls' : 'none'
            const type = proxy.network || 'tcp'
            const host = encodeURIComponent(proxy.host || proxy.server)
            const path = encodeURIComponent(proxy.path || '')
            const sni = encodeURIComponent(proxy.sni || proxy.server)
            const name = encodeURIComponent(proxy.name)

            link = `trojan://${password}@${server}:${port}?security=${security}&type=${type}&host=${host}&path=${path}&sni=${sni}#${name}`
         } else if (proxy.type === 'ss') {
            // Create Shadowsocks link
            const method = proxy.cipher || 'none'
            const password = proxy.password
            const server = proxy.server
            const port = proxy.port
            const name = encodeURIComponent(proxy.name)

            // Base64 encode the method:password part
            const userInfo = btoa(`${method}:${password}`)

            // Create basic SS URL
            link = `ss://${userInfo}@${server}:${port}#${name}`

            // Add plugin info if network is ws
            if (proxy.network === 'ws' || proxy.path) {
               const pluginOpts = `plugin=v2ray-plugin;path=${proxy.path || ''};host=${proxy.host || server};tls=${proxy.tls ? '1' : '0'}`
               link = `ss://${userInfo}@${server}:${port}/?${encodeURIComponent(pluginOpts)}#${name}`
            }
         }

         if (link) {
            v2rayLinks.push(link)
         }
      })

      return v2rayLinks.join('\n')
   }

   function convertConfigToV2ray(configText, configType) {
      const isFullConfig = fullConfigReverseBtn.classList.contains('active')
      return parseClashConfig(configText, isFullConfig)
   }

   function parseV2rayLink(link) {
      try {
         // Determine protocol
         if (link.startsWith('vmess://')) {
            return parseVmessLink(link)
         } else if (link.startsWith('vless://')) {
            return parseVlessLink(link)
         } else if (link.startsWith('trojan://')) {
            return parseTrojanLink(link)
         } else if (link.startsWith('ss://')) {
            return parseShadowsocksLink(link)
         } else {
            throw new Error(`Unsupported protocol in link: ${link}`)
         }
      } catch (error) {
         console.error('Error parsing link:', error)
         throw new Error(`Failed to parse link: ${link}`)
      }
   }

   function parseVmessLink(link) {
      // Remove vmess:// prefix and decode base64
      const base64Content = link.replace('vmess://', '')
      let config

      try {
         const decodedContent = atob(base64Content)
         config = JSON.parse(decodedContent)
      } catch (error) {
         throw new Error('Invalid VMess link format')
      }

      return {
         type: 'vmess',
         name: config.ps || 'VMess Server',
         server: config.add,
         port: Number.parseInt(config.port),
         uuid: config.id,
         alterId: Number.parseInt(config.aid || '0'),
         cipher: config.scy || 'auto',
         tls: config.tls === 'tls',
         network: config.net || 'tcp',
         wsPath: config.path || '',
         wsHost: config.host || '',
         sni: config.sni || config.add,
         skipCertVerify: true
      }
   }

   function parseVlessLink(link) {
      // Format: vless://uuid@server:port?params#name
      try {
         // Remove vless:// prefix
         const content = link.replace('vless://', '')

         // Split into parts
         const [userInfo, rest] = content.split('@')
         const [serverPort, paramsAndName] = rest.split('?')
         const [server, port] = serverPort.split(':')

         // Parse params and name
         const params = {}
         let name = ''

         if (paramsAndName) {
            const [paramsStr, encodedName] = paramsAndName.split('#')
            name = encodedName ? decodeURIComponent(encodedName) : 'VLESS Server'

            // Parse params
            paramsStr.split('&').forEach(param => {
               const [key, value] = param.split('=')
               params[key] = value ? decodeURIComponent(value) : ''
            })
         }

         return {
            type: 'vless',
            name: name,
            server: server,
            port: Number.parseInt(port),
            uuid: userInfo,
            tls: params.security === 'tls',
            network: params.type || 'tcp',
            wsPath: params.path || '',
            wsHost: params.host || '',
            sni: params.sni || server,
            skipCertVerify: true
         }
      } catch (error) {
         throw new Error('Invalid VLESS link format')
      }
   }

   function parseTrojanLink(link) {
      // Format: trojan://password@server:port?params#name
      try {
         // Remove trojan:// prefix
         const content = link.replace('trojan://', '')

         // Split into parts
         const [password, rest] = content.split('@')
         const [serverPort, paramsAndName] = rest.split('?')
         const [server, port] = serverPort.split(':')

         // Parse params and name
         const params = {}
         let name = ''

         if (paramsAndName) {
            const [paramsStr, encodedName] = paramsAndName.split('#')
            name = encodedName ? decodeURIComponent(encodedName) : 'Trojan Server'

            // Parse params
            paramsStr.split('&').forEach(param => {
               const [key, value] = param.split('=')
               params[key] = value ? decodeURIComponent(value) : ''
            })
         }

         return {
            type: 'trojan',
            name: name,
            server: server,
            port: Number.parseInt(port),
            password: password,
            tls: params.security === 'tls' || true, // Trojan usually uses TLS
            network: params.type || 'tcp',
            wsPath: params.path || '',
            wsHost: params.host || '',
            sni: params.sni || server,
            skipCertVerify: true
         }
      } catch (error) {
         throw new Error('Invalid Trojan link format')
      }
   }

   // Update the parseShadowsocksLink function to properly extract path and TLS settings
   function parseShadowsocksLink(link) {
      // Format: ss://base64(method:password)@server:port?params#name
      try {
         // Remove ss:// prefix
         const content = link.replace('ss://', '')

         let userInfo,
            serverPort,
            name,
            params = {}

         // Check if the link contains @ (SIP002 format)
         if (content.includes('@')) {
            const [encodedUserInfo, rest] = content.split('@')
            let serverPortStr, paramsAndName

            // Check if there are URL parameters
            if (rest.includes('?')) {
               const [serverPortPart, paramsNamePart] = rest.split('?')
               serverPortStr = serverPortPart

               // Parse params and name
               if (paramsNamePart) {
                  const [paramsStr, encodedName] = paramsNamePart.split('#')
                  name = encodedName ? decodeURIComponent(encodedName) : 'SS Server'

                  // Parse params
                  paramsStr.split('&').forEach(param => {
                     const [key, value] = param.split('=')
                     params[key] = value ? decodeURIComponent(value) : ''
                  })
               }
            } else {
               // No params, just server:port#name
               const [serverPortPart, encodedName] = rest.split('#')
               serverPortStr = serverPortPart
               name = encodedName ? decodeURIComponent(encodedName) : 'SS Server'
            }

            // Decode user info (method:password)
            try {
               userInfo = atob(encodedUserInfo)
            } catch (e) {
               // If decoding fails, it might be URL encoded
               userInfo = decodeURIComponent(encodedUserInfo)
            }

            serverPort = serverPortStr
         } else {
            // Legacy format: base64(method:password@server:port)
            const [encodedData, encodedName] = content.split('#')
            const decodedData = atob(encodedData)

            // Split into method:password and server:port
            const atIndex = decodedData.lastIndexOf('@')
            userInfo = decodedData.substring(0, atIndex)
            serverPort = decodedData.substring(atIndex + 1)

            name = encodedName ? decodeURIComponent(encodedName) : 'SS Server'
         }

         // Parse user info
         const [method, password] = userInfo.split(':')

         // Parse server and port
         const [server, port] = serverPort.split(':')

         return {
            type: 'ss',
            name: name,
            server: server,
            port: Number.parseInt(port),
            cipher: method,
            password: password,
            udp: false,
            tls: params.security === 'tls',
            wsPath: params.path || '',
            wsHost: params.host || server,
            sni: params.sni || server,
            skipCertVerify: true
         }
      } catch (error) {
         console.error('Invalid Shadowsocks link format:', error)
         throw new Error('Invalid Shadowsocks link format')
      }
   }

   // Update the SS section in generateClashConfig to use the correct path and TLS settings
   function generateClashConfig(parsedLinks, isFullConfig = false, options = {}) {
      const {
         useFakeIp = true,
         useBestPing = true,
         useLoadBalance = false,
         useFallback = false,
         useAllGroups = false,
         useAdsBlock = true,
         usePornBlock = true
      } = options

      let config = `# Clash Configuration
# Generated by Markas-OPM Converter
# Date: ${new Date().toISOString()}

`

      if (isFullConfig) {
         config += `port: 7890
socks-port: 7891
allow-lan: true
mode: rule
log-level: info
external-controller: 127.0.0.1:9090
dns:
  enable: true
  listen: 0.0.0.0:53
  ${useFakeIp ? 'enhanced-mode: fake-ip' : 'enhanced-mode: redir-host'}
  nameserver:
    - 8.8.8.8
    - 1.1.1.1
    - https://dns.cloudflare.com/dns-query
  fallback:
    - 1.0.0.1
    - 8.8.4.4
    - https://dns.google/dns-query

`

         if (useAdsBlock || usePornBlock) {
            config += `rule-providers:\n`

            if (useAdsBlock) {
               config += `
  ⛔ ADS:
    type: http
    behavior: domain
    url: "https://raw.githubusercontent.com/malikshi/open_clash/refs/heads/main/rule_provider/rule_basicads.yaml"
    path: "./rule_provider/rule_basicads.yaml"
    interval: 86400
`
            }

            if (usePornBlock) {
               config += `
  🔞 Porn:
    type: http
    behavior: domain
    url: "https://raw.githubusercontent.com/malikshi/open_clash/refs/heads/main/rule_provider/rule_porn.yaml"
    path: "./rule_provider/rule_porn.yaml"
    interval: 86400
`
            }
         }
      }

      config += `
proxies:
`

      // Add all proxies
      parsedLinks.forEach((link, index) => {
         config += '\n'

         if (link.type === 'vmess') {
            config += `  - name: "[${index + 1}]-${link.name}"
    type: vmess
    server: ${link.server}
    port: ${link.port}
    uuid: ${link.uuid}
    alterId: ${link.alterId || 0}
    cipher: ${link.cipher || 'auto'}
    udp: true
    tls: ${link.tls}
    skip-cert-verify: ${link.skipCertVerify || true}
`

            if (link.network === 'ws') {
               config += `    network: ws
    ws-opts:
      path: ${link.wsPath || ''}
`
               if (link.wsHost) {
                  config += `      headers:
        Host: ${link.wsHost}
`
               }
            }

            if (link.tls && link.sni) {
               config += `    servername: ${link.sni}
`
            }
         } else if (link.type === 'vless') {
            config += `  - name: "[${index + 1}]-${link.name}"
    type: vless
    server: ${link.server}
    port: ${link.port}
    uuid: ${link.uuid}
    udp: true
    tls: ${link.tls}
    skip-cert-verify: ${link.skipCertVerify || true}
`

            if (link.network === 'ws') {
               config += `    network: ws
    ws-opts:
      path: ${link.wsPath || ''}
`
               if (link.wsHost) {
                  config += `      headers:
        Host: ${link.wsHost}
`
               }
            }

            if (link.tls && link.sni) {
               config += `    servername: ${link.sni}
`
            }
         } else if (link.type === 'trojan') {
            config += `  - name: "[${index + 1}]-${link.name}"
    type: trojan
    server: ${link.server}
    port: ${link.port}
    password: ${link.password}
    udp: true
    skip-cert-verify: ${link.skipCertVerify || true}
`

            if (link.network === 'ws') {
               config += `    network: ws
    ws-opts:
      path: ${link.wsPath || ''}
`
               if (link.wsHost) {
                  config += `      headers:
        Host: ${link.wsHost}
`
               }
            }

            if (link.sni) {
               config += `    sni: ${link.sni}
`
            }
         } else if (link.type === 'ss') {
            config += `  - name: "[${index + 1}]-${link.name}"
    server: ${link.server}
    port: ${link.port}
    type: ss
    cipher: ${link.cipher || 'none'}
    password: ${link.password}
    plugin: v2ray-plugin
    client-fingerprint: chrome
    udp: false
    plugin-opts:
      mode: websocket
      host: ${link.wsHost || link.server}
      path: ${link.wsPath || ''}
      tls: ${link.tls}
      mux: false
      skip-cert-verify: true
    headers:
      custom: value
      ip-version: dual
      v2ray-http-upgrade: false
      v2ray-http-upgrade-fast-open: false
`
         }
      })

      if (isFullConfig) {
         // Create a list of proxy names first to avoid duplication
         const proxyNames = parsedLinks.map((link, index) => link.name)

         config += `
proxy-groups:
  - name: "MARKAS-OPM
    type: select
    proxies:
      - SELECTOR
`
         if (useBestPing) config += `      - BEST-PING\n`
         if (useLoadBalance) config += `      - LOAD-BALANCE\n`
         if (useFallback) config += `      - FALLBACK\n`
         config += `      - DIRECT
      - REJECT
`

         // Add SELECTOR group
         config += `  - name: "SELECTOR"
    type: select
    proxies:
      - DIRECT
      - REJECT
`

         // Add all proxy names to the SELECTOR group only once
         parsedLinks.forEach((proxy, index) => {
            config += `      - "[${index + 1}]-${proxy.name}"\n`
         })

         // Add proxy groups based on options
         if (useBestPing) {
            config += `
  - name: "BEST-PING"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    proxies:
`
            // Add all proxy names to the url-test group
            parsedLinks.forEach((proxy, index) => {
               config += `      - "[${index + 1}]-${proxy.name}"\n`
            })
         }

         if (useLoadBalance) {
            config += `
  - name: "LOAD-BALANCE"
    type: load-balance
    url: http://www.gstatic.com/generate_204
    interval: 300
    strategy: round-robin
    proxies:
`
            // Add all proxy names to the load-balance group
            parsedLinks.forEach((proxy, index) => {
               config += `      - "[${index + 1}]-${proxy.name}"\n`
            })
         }

         if (useFallback) {
            config += `
  - name: "FALLBACK"
    type: fallback
    url: http://www.gstatic.com/generate_204
    interval: 300
    proxies:
`
            // Add all proxy names to the fallback group
            parsedLinks.forEach((proxy, index) => {
               config += `      - "[${index + 1}]-${proxy.name}"\n`
            })
         }

         // Add rule groups if needed
         if (useAdsBlock || usePornBlock) {
            if (useAdsBlock) {
               config += `
  - name: "ADS"
    type: select
    proxies:
      - REJECT
      - DIRECT
`
               if (useBestPing) config += `      - BEST-PING\n`
               if (useLoadBalance) config += `      - LOAD-BALANCE\n`
               if (useFallback) config += `      - FALLBACK\n`
            }

            if (usePornBlock) {
               config += `
  - name: "PORN"
    type: select
    proxies:
      - REJECT
      - DIRECT
`
               if (useBestPing) config += `      - BEST-PING\n`
               if (useLoadBalance) config += `      - LOAD-BALANCE\n`
               if (useFallback) config += `      - FALLBACK\n`
            }
         }

         // Add rules
         config += `
rules:
`

         if (useAdsBlock) {
            config += `  - RULE-SET,⛔ ADS,ADS\n`
         }

         if (usePornBlock) {
            config += `  - RULE-SET,🔞 Porn,PORN\n`
         }

         config += `  - IP-CIDR,192.168.0.0/16,DIRECT
  - IP-CIDR,10.0.0.0/8,DIRECT
  - IP-CIDR,172.16.0.0/12,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT
  - MATCH,MARKAS-OPM`
      }

      return config
   }

   // Find the generateNekoboxConfig function and update it to include additional outbound options based on user selections
   function generateNekoboxConfig(parsedLinks, isFullConfig = true) {
      // Get the selected options
      const useBestPing = document.getElementById('best-ping').classList.contains('active')
      const useLoadBalance = document.getElementById('load-balance').classList.contains('active')
      const useFallback = document.getElementById('fallback').classList.contains('active')
      const useAllGroups = document.getElementById('all-groups').classList.contains('active')

      let config = `##MARKAS-OPM##
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
`

      // Add outbound options based on user selections
      const outbounds = []

      if (useBestPing || useAllGroups) {
         outbounds.push('Best Latency')
      }

      if (useLoadBalance || useAllGroups) {
         outbounds.push('Load Balance')
      }

      if (useFallback || useAllGroups) {
         outbounds.push('Fallback')
      }

      // If no outbound is selected, default to Best Latency
      if (outbounds.length === 0) {
         outbounds.push('Best Latency')
      }

      // Add the outbounds to the config
      config += `        "${outbounds[0]}",\n`

      // Add proxy tags
      const proxyTags = parsedLinks.map((proxy, index) => `        "${proxy.name}",`).join('\n')
      config += proxyTags + '\n'
      config += `        "direct"
      ],
      "tag": "Internet",
      "type": "selector"
    },\n`

      // Add Best Latency outbound if selected
      if (useBestPing || useAllGroups) {
         config += `    {
      "interval": "1m0s",
      "outbounds": [
${proxyTags}
        "direct"
      ],
      "tag": "Best Latency",
      "type": "urltest",
      "url": "https://detectportal.firefox.com/success.txt"
    },\n`
      }

      // Add Load Balance outbound if selected
      if (useLoadBalance || useAllGroups) {
         config += `    {
      "interval": "1m0s",
      "outbounds": [
${proxyTags}
        "direct"
      ],
      "tag": "Load Balance",
      "type": "loadbalance",
      "strategy": "round-robin"
    },\n`
      }

      // Add Fallback outbound if selected
      if (useFallback || useAllGroups) {
         config += `    {
      "interval": "1m0s",
      "outbounds": [
${proxyTags}
        "direct"
      ],
      "tag": "Fallback",
      "type": "urltest",
      "url": "https://detectportal.firefox.com/success.txt",
      "fallback_delay": "300ms"
    },\n`
      }

      // Add all proxy configurations
      const proxyConfigs = parsedLinks
         .map((proxy, index) => {
            let proxyConfig = ''

            if (proxy.type === 'vmess') {
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
                     : ''
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
            } else if (proxy.type === 'vless') {
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
                     : ''
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
            } else if (proxy.type === 'trojan') {
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
                     : ''
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
            } else if (proxy.type === 'ss') {
               proxyConfig = `    {
      "type": "shadowsocks",
      "tag": "${proxy.name}",
      "server": "${proxy.server}",
      "server_port": ${proxy.port},
      "method": "none",
      "password": "${proxy.password}",
      "plugin": "v2ray-plugin",
      "plugin_opts": "mux=0;path=${proxy.wsPath};host=${proxy.wsHost || proxy.server};tls=${proxy.tls ? '1' : '0'}"
    }`
            }

            return proxyConfig
         })
         .join(',\n')

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

   // Update the toggleClashOptions function to properly handle visibility based on format
   function toggleClashOptions() {
      const clashOptionsSection = document.getElementById('clash-options')
      const formatType = document.querySelector('.format-btn.active').id

      if (formatType === 'clash-format') {
         // Show Clash options section when Clash format is selected
         clashOptionsSection.style.display = 'block'
      } else {
         // Hide Clash options section when other formats are selected
         clashOptionsSection.style.display = 'none'
      }
   }

   // Update the event listeners for format buttons
   clashFormatBtn.addEventListener('click', () => {
      clashFormatBtn.classList.add('active')
      nekoboxFormatBtn.classList.remove('active')
      toggleClashOptions()
      hideError()
   })

   nekoboxFormatBtn.addEventListener('click', () => {
      nekoboxFormatBtn.classList.add('active')
      clashFormatBtn.classList.remove('active')
      toggleClashOptions()
      hideError()
   })

   // Also update the DOMContentLoaded event listener at the bottom
   document.addEventListener('DOMContentLoaded', () => {
      const clashFormatBtn = document.getElementById('clash-format')
      const nekoboxFormatBtn = document.getElementById('nekobox-format')

      if (clashFormatBtn && nekoboxFormatBtn) {
         clashFormatBtn.addEventListener('click', () => {
            toggleClashOptions()
         })

         nekoboxFormatBtn.addEventListener('click', () => {
            toggleClashOptions()
         })
      }

      // Initialize Clash options visibility on page load
      if (document.getElementById('clash-format').classList.contains('active')) {
         document.getElementById('clash-options').style.display = 'block'
      } else {
         document.getElementById('clash-options').style.display = 'none'
      }
   })
})
