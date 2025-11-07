/**
 * Link Generator Page - Markas OPM
 * Handles proxy list, account creation, and QR code generation
 */

// ============================================
// Configuration & Constants
// ============================================

const CONFIG = {
   defaultProxyUrl: 'https://raw.githubusercontent.com/AFRcloud/ProxyList/refs/heads/main/ProxyList.txt',
   serverDomains: ['markas-opm.pp.ua'],
   pathTemplate: '/MARKASOPM/{ip}-{port}',
   itemsPerPage: 10,
   proxyStatusApi: 'https://api.jb8fd7grgd.workers.dev',
   bugOptions: [
      { value: 'ava.game.naver.com', label: 'ava.game.naver.com' },
      { value: 'cache.netflix.com', label: 'cache.netflix.com' },
      { value: 'graph.instagram.com', label: 'graph.instagram.com' },
      { value: 'zaintest.vuclip.com', label: 'zaintest.vuclip.com' },
      { value: 'api.midtrans.com', label: 'api.midtrans.com' },
      { value: 'blog.webex.com', label: 'blog.webex.com' },
      { value: 'investors.spotify.com', label: 'investors.spotify.com' },
      { value: 'investors.fb.com', label: 'investors.fb.com' },
      { value: 'unnes.ac.id', label: 'unnes.ac.id' },
      { value: 'cf-vod-nimo.tv', label: 'cf-vod-nimo.tv' },
      { value: 'sushiroll.co.id', label: 'sushiroll.co.id' },
      { value: 'teaching.udemy.com', label: 'teaching.udemy.com' },
      { value: 'support.udemy.com', label: 'support.udemy.com' },
      { value: 'web.whatsapp.com', label: 'web.whatsapp.com' },
      { value: 'upload.youtube.com', label: 'upload.youtube.com' },
      { value: 'store.linefriends.com', label: 'store.linefriends.com' },
      { value: 'invite.tinder.com', label: 'invite.tinder.com' },
      { value: 'speedtest.net', label: 'speedtest.net' },
      { value: 'cdn.opensignal.com', label: 'cdn.opensignal.com' },
      { value: 'silent-auth.u.com.my', label: 'silent-auth.u.com.my' },
      { value: 'support.zoom.us', label: 'support.zoom.us' },
      { value: 'collection.linefriends.com', label: 'collection.linefriends.com' },
      { value: 'dl.cvs.freefiremobile.com', label: 'dl.cvs.freefiremobile.com' },
      { value: 'investors.grab.com', label: 'investors.grab.com' },
      { value: 'quiz.int.vidio.com', label: 'quiz.int.vidio.com' },
      { value: 'space.byu.id', label: 'space.byu.id' },
      { value: 'investor.fb.com', label: 'investor.fb.com' },
      { value: 'api24-normal.tiktokv.com', label: 'api24-normal.tiktokv.com' },
      { value: 'punggi.byu.id', label: 'punggi.byu.id' },
      { value: 'partner.catchplay.com', label: 'partner.catchplay.com' },
      { value: 'poe.garena.com', label: 'poe.garena.com' },
      { value: 'mobile-legends.net', label: 'mobile-legends.net' },
      { value: 'www.genflix.co.id', label: 'www.genflix.co.id' },
      { value: 'blog.sushiroll.co.id', label: 'blog.sushiroll.co.id' },
      { value: 'www.udemy.com', label: 'www.udemy.com' },
      { value: 'api22-normal-c-alisg.tiktokv.com', label: 'api22-normal-c-alisg.tiktokv.com' },
      { value: 'safety-enforcement.tiktok.com', label: 'safety-enforcement.tiktok.com' },
      { value: 'account.pmang.game.naver.com', label: 'account.pmang.game.naver.com' },
      { value: 'media-sin6-3.cdn.whatsapp.net', label: 'media-sin6-3.cdn.whatsapp.net' },
      { value: 'cf.shopee.co.id.sea-sw.swiftserve.com', label: 'cf.shopee.co.id.sea-sw.swiftserve.com' },
      { value: 'api24-normal-alisg.tiktokv.com', label: 'api24-normal-alisg.tiktokv.com' },
      { value: 'chat.sociomile.com', label: 'chat.sociomile.com' },
      { value: 'edu.ruangguru.com', label: 'edu.ruangguru.com' },
      { value: 'ads.ruangguru.com', label: 'ads.ruangguru.com' },
      { value: 'v.whatsapp.net', label: 'v.whatsapp.net' },
      { value: 'support-id.catchplay.com', label: 'support-id.catchplay.com' },
      { value: 'm.udemy.com', label: 'm.udemy.com' },
      { value: 'media.fcgk35-1.fna.whatsapp.net', label: 'media.fcgk35-1.fna.whatsapp.net' },
      { value: 'w5.web.whatsapp.com', label: 'w5.web.whatsapp.com' }
   ],
   countries: {
      AF: 'Afghanistan',
      AX: 'Åland Islands',
      AL: 'Albania',
      DZ: 'Algeria',
      AS: 'American Samoa',
      AD: 'Andorra',
      AO: 'Angola',
      AI: 'Anguilla',
      AQ: 'Antarctica',
      AG: 'Antigua and Barbuda',
      AR: 'Argentina',
      AM: 'Armenia',
      AW: 'Aruba',
      AU: 'Australia',
      AT: 'Austria',
      AZ: 'Azerbaijan',
      BS: 'Bahamas',
      BH: 'Bahrain',
      BD: 'Bangladesh',
      BB: 'Barbados',
      BY: 'Belarus',
      BE: 'Belgium',
      BZ: 'Belize',
      BJ: 'Benin',
      BM: 'Bermuda',
      BT: 'Bhutan',
      BO: 'Bolivia',
      BQ: 'Bonaire, Sint Eustatius and Saba',
      BA: 'Bosnia and Herzegovina',
      BW: 'Botswana',
      BV: 'Bouvet Island',
      BR: 'Brazil',
      IO: 'British Indian Ocean Territory',
      BN: 'Brunei',
      BG: 'Bulgaria',
      BF: 'Burkina Faso',
      BI: 'Burundi',
      KH: 'Cambodia',
      CM: 'Cameroon',
      CA: 'Canada',
      CV: 'Cabo Verde',
      KY: 'Cayman Islands',
      CF: 'Central African Republic',
      TD: 'Chad',
      CL: 'Chile',
      CN: 'China',
      CX: 'Christmas Island',
      CC: 'Cocos Islands',
      CO: 'Colombia',
      KM: 'Comoros',
      CD: 'Congo',
      CG: 'Congo',
      CK: 'Cook Islands',
      CR: 'Costa Rica',
      CI: 'Côte d’Ivoire',
      HR: 'Croatia',
      CU: 'Cuba',
      CW: 'Curaçao',
      CY: 'Cyprus',
      CZ: 'Czechia',
      DK: 'Denmark',
      DJ: 'Djibouti',
      DM: 'Dominica',
      DO: 'Dominican Republic',
      EC: 'Ecuador',
      EG: 'Egypt',
      SV: 'El Salvador',
      GQ: 'Equatorial Guinea',
      ER: 'Eritrea',
      EE: 'Estonia',
      ET: 'Ethiopia',
      FK: 'Falkland Islands',
      FO: 'Faroe Islands',
      FJ: 'Fiji',
      FI: 'Finland',
      FR: 'France',
      GF: 'French Guiana',
      PF: 'French Polynesia',
      TF: 'French Southern Territories',
      GA: 'Gabon',
      GM: 'Gambia',
      GE: 'Georgia',
      DE: 'Germany',
      GH: 'Ghana',
      GI: 'Gibraltar',
      GR: 'Greece',
      GL: 'Greenland',
      GD: 'Grenada',
      GP: 'Guadeloupe',
      GU: 'Guam',
      GT: 'Guatemala',
      GG: 'Guernsey',
      GN: 'Guinea',
      GW: 'Guinea-Bissau',
      GY: 'Guyana',
      HT: 'Haiti',
      HM: 'Heard and McDonald Islands',
      VA: 'Vatican City',
      HN: 'Honduras',
      HK: 'Hong Kong',
      HU: 'Hungary',
      IS: 'Iceland',
      IN: 'India',
      ID: 'Indonesia',
      IR: 'Iran',
      IQ: 'Iraq',
      IE: 'Ireland',
      IM: 'Isle of Man',
      IL: 'Israel',
      IT: 'Italy',
      JM: 'Jamaica',
      JP: 'Japan',
      JE: 'Jersey',
      JO: 'Jordan',
      KZ: 'Kazakhstan',
      KE: 'Kenya',
      KI: 'Kiribati',
      KP: 'North Korea',
      KR: 'South Korea',
      KW: 'Kuwait',
      KG: 'Kyrgyzstan',
      LA: 'Laos',
      LV: 'Latvia',
      LB: 'Lebanon',
      LS: 'Lesotho',
      LR: 'Liberia',
      LY: 'Libya',
      LI: 'Liechtenstein',
      LT: 'Lithuania',
      LU: 'Luxembourg',
      MO: 'Macao',
      MG: 'Madagascar',
      MW: 'Malawi',
      MY: 'Malaysia',
      MV: 'Maldives',
      ML: 'Mali',
      MT: 'Malta',
      MH: 'Marshall Islands',
      MQ: 'Martinique',
      MR: 'Mauritania',
      MU: 'Mauritius',
      YT: 'Mayotte',
      MX: 'Mexico',
      FM: 'Micronesia',
      MD: 'Moldova',
      MC: 'Monaco',
      MN: 'Mongolia',
      ME: 'Montenegro',
      MS: 'Montserrat',
      MA: 'Morocco',
      MZ: 'Mozambique',
      MM: 'Myanmar',
      NA: 'Namibia',
      NR: 'Nauru',
      NP: 'Nepal',
      NL: 'Netherlands',
      NC: 'New Caledonia',
      NZ: 'New Zealand',
      NI: 'Nicaragua',
      NE: 'Niger',
      NG: 'Nigeria',
      NU: 'Niue',
      NF: 'Norfolk Island',
      MK: 'North Macedonia',
      MP: 'Northern Mariana Islands',
      NO: 'Norway',
      OM: 'Oman',
      PK: 'Pakistan',
      PW: 'Palau',
      PS: 'Palestine',
      PA: 'Panama',
      PG: 'Papua New Guinea',
      PY: 'Paraguay',
      PE: 'Peru',
      PH: 'Philippines',
      PN: 'Pitcairn',
      PL: 'Poland',
      PT: 'Portugal',
      PR: 'Puerto Rico',
      QA: 'Qatar',
      RE: 'Réunion',
      RO: 'Romania',
      RU: 'Russia',
      RW: 'Rwanda',
      BL: 'Saint Barthélemy',
      SH: 'Saint Helena',
      KN: 'Saint Kitts and Nevis',
      LC: 'Saint Lucia',
      MF: 'Saint Martin',
      PM: 'Saint Pierre and Miquelon',
      VC: 'Saint Vincent and Grenadines',
      WS: 'Samoa',
      SM: 'San Marino',
      ST: 'Sao Tome and Principe',
      SA: 'Saudi Arabia',
      SN: 'Senegal',
      RS: 'Serbia',
      SC: 'Seychelles',
      SL: 'Sierra Leone',
      SG: 'Singapore',
      SX: 'Sint Maarten',
      SK: 'Slovakia',
      SI: 'Slovenia',
      SB: 'Solomon Islands',
      SO: 'Somalia',
      ZA: 'South Africa',
      GS: 'South Georgia and South Sandwich Islands',
      SS: 'South Sudan',
      ES: 'Spain',
      LK: 'Sri Lanka',
      SD: 'Sudan',
      SR: 'Suriname',
      SJ: 'Svalbard and Jan Mayen',
      SE: 'Sweden',
      CH: 'Switzerland',
      SY: 'Syria',
      TW: 'Taiwan',
      TJ: 'Tajikistan',
      TZ: 'Tanzania',
      TH: 'Thailand',
      TL: 'Timor-Leste',
      TG: 'Togo',
      TK: 'Tokelau',
      TO: 'Tonga',
      TT: 'Trinidad and Tobago',
      TN: 'Tunisia',
      TR: 'Turkey',
      TM: 'Turkmenistan',
      TC: 'Turks and Caicos Islands',
      TV: 'Tuvalu',
      UG: 'Uganda',
      UA: 'Ukraine',
      AE: 'United Arab Emirates',
      GB: 'United Kingdom',
      US: 'United States',
      UM: 'United States Minor Outlying Islands',
      UY: 'Uruguay',
      UZ: 'Uzbekistan',
      VU: 'Vanuatu',
      VE: 'Venezuela',
      VN: 'Vietnam',
      WF: 'Wallis and Futuna',
      EH: 'Western Sahara',
      YE: 'Yemen',
      ZM: 'Zambia',
      ZW: 'Zimbabwe'
   }
}

// ============================================
// State Management
// ============================================
const state = {
   proxyList: [],
   filteredProxyList: [],
   selectedProxy: null,
   currentPage: 1,
   selectedServerDomain: CONFIG.serverDomains[0]
}

// ============================================
// DOM Elements Cache
// ============================================
const DOM = {
   // Sections
   proxyListSection: document.getElementById('proxy-list-section'),
   accountCreationSection: document.getElementById('account-creation-section'),
   resultSection: document.getElementById('result-section'),

   // Proxy List
   loadingIndicator: document.getElementById('loading-indicator'),
   proxyListContainer: document.getElementById('proxy-list-container'),
   noProxiesMessage: document.getElementById('no-proxies-message'),
   customUrlInput: document.getElementById('custom-url-input'),
   proxyUrlInput: document.getElementById('proxy-url'),
   paginationContainer: document.getElementById('pagination-container'),
   proxyCountInfo: document.getElementById('proxy-count-info'),
   searchInput: document.getElementById('search-input'),

   // Buttons
   refreshBtn: document.getElementById('refresh-btn'),
   customUrlBtn: document.getElementById('custom-url-btn'),
   loadCustomUrlBtn: document.getElementById('load-custom-url'),
   backToListBtn: document.getElementById('back-to-list'),
   backToFormBtn: document.getElementById('back-to-form'),
   createNewBtn: document.getElementById('create-new'),
   backToListFromResultBtn: document.getElementById('back-to-list-from-result'),
   copyUrlBtn: document.getElementById('copy-url'),
   downloadQrBtn: document.getElementById('download-qr')
}

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
   initializeApp()
})

function initializeApp() {
   // Display fallback proxy list immediately
   displayFallbackProxyList()

   // Load actual proxy list
   loadProxyList(CONFIG.defaultProxyUrl)

   // Initialize components
   initializeEventListeners()
   initializeProtocolTabs()
   initializeFormHandlers()
   populateBugOptions()
   populateServerDomains()
}

function countryCodeToFlagEmoji(countryCode) {
   if (!countryCode) return ''
   // ubah ke huruf besar, lalu ubah jadi emoji unicode bendera
   const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt())
   return String.fromCodePoint(...codePoints)
}

// ============================================
// Event Listeners Setup
// ============================================
function initializeEventListeners() {
   // Proxy List Controls
   DOM.refreshBtn?.addEventListener('click', () => {
      showToast('Refreshing proxy list...', 'info')
      loadProxyList(CONFIG.defaultProxyUrl)
   })

   DOM.customUrlBtn?.addEventListener('click', () => {
      DOM.customUrlInput.classList.toggle('hidden')
   })

   DOM.loadCustomUrlBtn?.addEventListener('click', () => {
      const url = DOM.proxyUrlInput.value.trim()
      if (url) {
         loadProxyList(url)
      } else {
         showToast('Please enter a valid URL', 'warning')
      }
   })

   // Navigation
   DOM.backToListBtn?.addEventListener('click', showProxyListSection)
   DOM.backToListFromResultBtn?.addEventListener('click', showProxyListSection)

   DOM.backToFormBtn?.addEventListener('click', () => {
      DOM.resultSection.classList.add('hidden')
      DOM.accountCreationSection.classList.remove('hidden')
   })

   DOM.createNewBtn?.addEventListener('click', () => {
      DOM.resultSection.classList.add('hidden')
      DOM.accountCreationSection.classList.remove('hidden')
   })

   // Search with debounce
   const debouncedSearch = debounce(handleSearch, 300)
   DOM.searchInput?.addEventListener('input', debouncedSearch)

   // Result Actions
   DOM.copyUrlBtn?.addEventListener('click', handleCopyUrl)
   DOM.downloadQrBtn?.addEventListener('click', handleDownloadQr)
}

// ============================================
// Protocol Tabs Management
// ============================================
function initializeProtocolTabs() {
   const protocolTabs = document.querySelectorAll('.tab-btn')
   const protocolForms = document.querySelectorAll('.protocol-form')

   protocolTabs.forEach(tab => {
      tab.addEventListener('click', () => {
         const targetId = tab.getAttribute('data-target')
         activateTab(targetId, protocolTabs, protocolForms)
      })
   })
}

function activateTab(targetId, tabs, forms) {
   // Reset all tabs and forms
   tabs.forEach(t => t.classList.remove('active'))
   forms.forEach(f => f.classList.add('hidden'))

   // Activate selected tab
   const activeTab = document.querySelector(`.tab-btn[data-target="${targetId}"]`)
   if (activeTab) activeTab.classList.add('active')

   // Show selected form
   const targetForm = document.getElementById(targetId)
   if (targetForm) targetForm.classList.remove('hidden')

   // Reset bug and wildcard states
   resetBugAndWildcardStates()
}

function resetBugAndWildcardStates() {
   const protocols = ['vmess', 'vless', 'trojan', 'ss']

   protocols.forEach(protocol => {
      const bugSelect = document.getElementById(`${protocol}-bug`)
      const manualContainer = document.getElementById(`${protocol}-manual-bug-container`)
      const wildcardContainer = document.getElementById(`${protocol}-wildcard-container`)
      const wildcardCheckbox = document.getElementById(`${protocol}-wildcard`)

      if (manualContainer) manualContainer.classList.remove('show')
      if (wildcardContainer) wildcardContainer.classList.remove('show')
      if (wildcardCheckbox) {
         wildcardCheckbox.checked = false
         wildcardCheckbox.disabled = false
      }
   })
}

// ============================================
// Form Initialization
// ============================================
function populateBugOptions() {
   const protocols = ['vmess', 'vless', 'trojan', 'ss']

   protocols.forEach(protocol => {
      const select = document.getElementById(`${protocol}-bug`)
      if (!select) return

      // Bersihkan dulu option lama
      select.innerHTML = ''

      // Placeholder (tidak bisa dipilih)
      const placeholder = document.createElement('option')
      placeholder.value = ''
      placeholder.textContent = `Pilih bug untuk ${protocol.toUpperCase()}`
      placeholder.disabled = true
      placeholder.selected = true
      select.appendChild(placeholder)

      // Tambahkan option dari CONFIG.bugOptions
      CONFIG.bugOptions.forEach(option => {
         const optionElement = document.createElement('option')
         optionElement.value = option.value
         optionElement.textContent = option.label
         select.appendChild(optionElement)
      })

      // Listener untuk perubahan
      initializeBugSelectListener(protocol, select)
   })
}

function initializeBugSelectListener(protocol, select) {
   const manualContainer = document.getElementById(`${protocol}-manual-bug-container`)
   const manualInput = document.getElementById(`${protocol}-manual-bug`)
   const wildcardContainer = document.getElementById(`${protocol}-wildcard-container`)
   const wildcardCheckbox = document.getElementById(`${protocol}-wildcard`)

   // Periksa apakah elemen-elemen yang diperlukan ada
   if (!select || !manualContainer || !wildcardContainer || !wildcardCheckbox) {
      console.warn(`Elemen tidak lengkap untuk protokol ${protocol}`)
      return
   }

   // Tambahkan event listener untuk perubahan pada select
   select.addEventListener('change', function () {
      const selectedValue = this.value

      if (selectedValue === 'manual') {
         // Jika "manual" dipilih, tampilkan input manual, sembunyikan container wildcard
         manualContainer.classList.remove('hidden')
         wildcardContainer.classList.add('hidden')
         // Nonaktifkan dan hilangkan centang wildcard jika dipilih
         if (wildcardCheckbox.checked) {
            wildcardCheckbox.checked = false // Hilangkan centang jika ada
            // Anda mungkin ingin memicu event change di sini jika ada logika lain
            // wildcardCheckbox.dispatchEvent(new Event('change'));
         }
         wildcardCheckbox.disabled = true // Nonaktifkan checkbox
      } else if (selectedValue !== '') {
         // Jika opsi lain dipilih (bukan manual dan bukan kosong), sembunyikan input manual, tampilkan container wildcard
         manualContainer.classList.add('hidden')
         wildcardContainer.classList.remove('hidden')
         // Aktifkan kembali checkbox
         wildcardCheckbox.disabled = false
      } else {
         // selectedValue === ""
         // Jika tidak ada opsi dipilih (kembali ke default), sembunyikan keduanya
         manualContainer.classList.add('hidden')
         wildcardContainer.classList.add('hidden')
         // Reset checkbox: hilangkan centang dan aktifkan kembali
         wildcardCheckbox.checked = false
         wildcardCheckbox.disabled = false
      }
   })

   // Tambahkan event listener untuk input manual
   manualInput?.addEventListener('input', () => {
      // Jika user mulai mengetik di input manual, nonaktifkan checkbox wildcard
      if (wildcardCheckbox && !wildcardCheckbox.disabled) {
         wildcardCheckbox.disabled = true
         // Jika checkbox sedang dicentang, hilangkan centangnya
         if (wildcardCheckbox.checked) {
            wildcardCheckbox.checked = false
            // Anda mungkin ingin memicu event change di sini jika ada logika lain
            // wildcardCheckbox.dispatchEvent(new Event('change'));
         }
      }
   })

   // Tambahkan event listener untuk perubahan pada checkbox wildcard
   wildcardCheckbox.addEventListener('change', function () {
      if (this.checked) {
         // Pastikan input manual kosong dan tidak bisa diedit saat wildcard aktif
         if (manualInput) {
            manualInput.value = ''
            manualInput.disabled = true // Opsional: Nonaktifkan input saat wildcard aktif
         }
         // Pastikan select tidak dalam mode "manual"
         if (select.value === 'manual') {
            // Reset select ke default atau nilai lain jika diperlukan
            // select.value = ""; // Misalnya, reset ke default
         }
      } else {
         // Jika checkbox tidak dicentang, aktifkan kembali input manual (jika select memungkinkan)
         if (manualInput) {
            manualInput.disabled = false // Kembalikan status input manual sesuai select
            // Jika select saat ini adalah "manual", biarkan input aktif
            // Jika select bukan "manual", input tetap tersembunyi dan mungkin tidak perlu diaktifkan
         }
      }
   })

   // Opsional: Perbarui status awal berdasarkan nilai select saat fungsi dipanggil
   // Ini berguna jika select mungkin sudah memiliki nilai saat halaman dimuat.
   const initialValue = select.value
   if (initialValue === 'manual') {
      manualContainer.classList.remove('hidden')
      wildcardContainer.classList.add('hidden')
      wildcardCheckbox.disabled = true
   } else if (initialValue !== '') {
      manualContainer.classList.add('hidden')
      wildcardContainer.classList.remove('hidden')
      wildcardCheckbox.disabled = false
   } else {
      manualContainer.classList.add('hidden')
      wildcardContainer.classList.add('hidden')
      wildcardCheckbox.checked = false
      wildcardCheckbox.disabled = false
   }
}

function populateServerDomains() {
   const protocols = ['vmess', 'vless', 'trojan', 'ss']

   protocols.forEach(protocol => {
      const select = document.getElementById(`${protocol}-server-domain`)
      if (!select) return

      select.innerHTML = ''
      CONFIG.serverDomains.forEach(domain => {
         const option = document.createElement('option')
         option.value = domain
         option.textContent = domain
         select.appendChild(option)
      })

      select.addEventListener('change', function () {
         state.selectedServerDomain = this.value
      })
   })
}

// ============================================
// Form Submission Handlers
// ============================================
function initializeFormHandlers() {
   const protocols = ['vmess', 'vless', 'trojan', 'ss']

   protocols.forEach(protocol => {
      const form = document.getElementById(`${protocol}-account-form`)
      if (form) {
         form.addEventListener('submit', e => handleFormSubmit(e, protocol))
      }
   })
}

function handleFormSubmit(e, protocol) {
   e.preventDefault()

   const formData = new FormData(e.target)
   const connectionData = extractFormData(formData, protocol)
   const connectionUrl = generateConnectionUrl(protocol, connectionData)

   if (!connectionUrl) {
      showToast('Failed to generate connection URL', 'error')
      return
   }

   // Display result
   document.getElementById('connection-url').textContent = connectionUrl
   generateQRCode(connectionUrl)

   // Show result section
   DOM.accountCreationSection.classList.add('hidden')
   DOM.resultSection.classList.remove('hidden')

   showToast('Account created successfully!', 'success')
}

function extractFormData(formData, protocol) {
   let customBug = formData.get('bug')?.toString().trim() || ''
   // Handle manual bug input
   if (customBug === 'manual') {
      const manualBug = document.getElementById(`${protocol}-manual-bug`)?.value.trim()
      customBug = manualBug || ''
   }

   const useWildcard = formData.get('wildcard') === 'on'
   const selectedDomain = formData.get('server-domain') || state.selectedServerDomain
   const security = formData.get('security')

   // Determine server, host, and SNI
   let server = selectedDomain
   let host = selectedDomain
   let sni = selectedDomain

   if (customBug) {
      server = customBug
      if (useWildcard) {
         host = `${customBug}.${selectedDomain}`
         sni = `${customBug}.${selectedDomain}`
      }
   }

   return {
      name: formData.get('name'),
      uuid: formData.get('uuid'),
      password: formData.get('password'),
      path: formData.get('path'),
      security,
      port: security === 'tls' ? 443 : 80,
      server,
      host,
      sni
   }
}

function generateConnectionUrl(protocol, data) {
   switch (protocol) {
      case 'vmess':
         return generateVMessUrl(data)
      case 'vless':
         return generateVLESSUrl(data)
      case 'trojan':
         return generateTrojanUrl(data)
      case 'ss':
         return generateShadowsocksUrl(data)
      default:
         return null
   }
}

function generateVMessUrl(data) {
   const vmessConfig = {
      v: '2',
      ps: data.name,
      add: data.server,
      port: data.port,
      id: data.uuid,
      aid: '0',
      net: 'ws',
      type: 'none',
      host: data.host,
      path: data.path,
      tls: data.security === 'tls' ? 'tls' : '',
      sni: data.sni,
      scy: 'zero'
   }

   return 'vmess://' + safeBase64Encode(JSON.stringify(vmessConfig))
}

function generateVLESSUrl(data) {
   const uuid = data.uuid
   const path = encodeURIComponent(data.path)
   const name = encodeURIComponent(data.name)

   return `vless://${uuid}@${data.server}:${data.port}?encryption=none&security=${data.security}&type=ws&host=${data.host}&path=${path}&sni=${data.sni}#${name}`
}

function generateTrojanUrl(data) {
   const password = data.password
   const path = encodeURIComponent(data.path)
   const name = encodeURIComponent(data.name)

   return `trojan://${password}@${data.server}:${data.port}?security=${data.security}&type=ws&host=${data.host}&path=${path}&sni=${data.sni}#${name}`
}

function generateShadowsocksUrl(data) {
   const password = data.password
   const name = encodeURIComponent(data.name)
   const path = encodeURIComponent(data.path)
   const method = 'none'
   const userInfo = btoa(`${method}:${password}`)

   return `ss://${userInfo}@${data.server}:${data.port}?encryption=none&type=ws&host=${data.host}&path=${path}&security=${data.security}&sni=${data.sni}#${name}`
}

// ============================================
// QR Code Generation
// ============================================
function generateQRCode(text) {
   const qrcodeElement = document.getElementById('qrcode')
   if (!qrcodeElement) return

   qrcodeElement.innerHTML = ''

   try {
      window.QRCode.toCanvas(
         qrcodeElement,
         text,
         {
            width: 200,
            margin: 1,
            color: { dark: '#000000', light: '#FFFFFF' }
         },
         error => {
            if (error) {
               console.error('QR Code canvas error:', error)
               generateQRCodeFallback(text, qrcodeElement)
            }
         }
      )
   } catch (error) {
      console.error('QR Code generation error:', error)
      generateQRCodeFallback(text, qrcodeElement)
   }
}

function generateQRCodeFallback(text, container) {
   try {
      window.QRCode.toString(text, { type: 'svg', width: 200, margin: 1 }, (error, svg) => {
         if (error || !svg) {
            generateQRCodeLastResort(text, container)
         } else {
            container.innerHTML = svg
         }
      })
   } catch (error) {
      generateQRCodeLastResort(text, container)
   }
}

function generateQRCodeLastResort(text, container) {
   const encodedText = encodeURIComponent(text)
   const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`

   const img = document.createElement('img')
   img.src = qrApiUrl
   img.alt = 'QR Code'
   img.width = 200
   img.height = 200
   img.className = 'rounded-lg'
   img.onerror = () => {
      container.innerHTML = '<div class="text-center text-error">Failed to generate QR code</div>'
   }

   container.innerHTML = ''
   container.appendChild(img)
}

// ============================================
// Result Actions
// ============================================
async function handleCopyUrl() {
   const connectionUrl = document.getElementById('connection-url')?.textContent
   if (!connectionUrl) return

   const success = await copyToClipboard(connectionUrl)

   if (success) {
      DOM.copyUrlBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'
      showToast('Copied to clipboard!', 'success')

      setTimeout(() => {
         DOM.copyUrlBtn.innerHTML = '<i class="far fa-copy"></i> Copy'
      }, 2000)
   } else {
      showToast('Failed to copy', 'error')
   }
}

function handleDownloadQr() {
   const qrcodeElement = document.getElementById('qrcode')
   if (!qrcodeElement) return

   const canvas = qrcodeElement.querySelector('canvas')
   const img = qrcodeElement.querySelector('img')
   const svg = qrcodeElement.querySelector('svg')

   let imageUrl = null

   if (canvas) {
      try {
         imageUrl = canvas.toDataURL('image/png')
      } catch (e) {
         console.error('Canvas to data URL error:', e)
      }
   } else if (img) {
      imageUrl = img.src
   } else if (svg) {
      try {
         const svgData = new XMLSerializer().serializeToString(svg)
         const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8'
         })
         imageUrl = URL.createObjectURL(svgBlob)
      } catch (e) {
         console.error('SVG to data URL error:', e)
      }
   }

   if (imageUrl) {
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `qrcode-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      if (imageUrl.startsWith('blob:')) {
         URL.revokeObjectURL(imageUrl)
      }

      showToast('QR Code downloaded!', 'success')
   } else {
      showToast('Failed to download QR code', 'error')
   }
}

// ============================================
// Proxy List Management
// ============================================
function displayFallbackProxyList() {
   state.proxyList = [
      {
         ip: '103.6.207.108',
         port: '8080',
         country: 'ID',
         provider: 'PT Pusat Media Indonesia'
      }
   ]

   state.filteredProxyList = [...state.proxyList]
   renderProxyList()
}

async function loadProxyList(url) {
   DOM.loadingIndicator?.classList.remove('hidden')
   DOM.proxyListContainer.innerHTML = ''
   DOM.noProxiesMessage?.classList.add('hidden')

   const corsProxies = [
      () => fetch(url).then(r => (r.ok ? r.text() : Promise.reject('Direct fetch failed'))),
      () =>
         fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
            .then(r => r.json())
            .then(data => data.contents),
      () =>
         fetch(`https://cors.sh/${url}`, {
            headers: {
               'x-cors-api-key': `temp_${Math.random().toString(36).substring(2, 12)}`
            }
         }).then(r => (r.ok ? r.text() : Promise.reject('CORS.sh failed')))
   ]

   for (let i = 0; i < corsProxies.length; i++) {
      try {
         const text = await corsProxies[i]()
         processProxyData(text)
         DOM.loadingIndicator?.classList.add('hidden')
         showToast('Proxy list loaded successfully!', 'success')
         return
      } catch (error) {
         console.error(`Proxy method ${i + 1} failed:`, error)
      }
   }

   // All methods failed
   console.error('All proxy loading methods failed')
   DOM.loadingIndicator?.classList.add('hidden')
   DOM.noProxiesMessage?.classList.remove('hidden')
   showToast('Failed to load proxy list, using fallback', 'warning')
   displayFallbackProxyList()
}

function processProxyData(text) {
   const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')

   if (lines.length === 0) {
      DOM.noProxiesMessage?.classList.remove('hidden')
      return
   }

   // Detect delimiter
   const firstLine = lines[0]
   let delimiter = ','
   if (firstLine.includes('\t')) delimiter = '\t'
   else if (firstLine.includes('|')) delimiter = '|'
   else if (firstLine.includes(';')) delimiter = ';'

   // Parse proxies
   state.proxyList = lines
      .map(line => {
         const parts = line.split(delimiter)
         if (parts.length >= 2) {
            return {
               ip: parts[0].trim(),
               port: parts[1].trim(),
               country: parts[2]?.trim() || 'Unknown',
               provider: parts[3]?.trim() || 'Unknown Provider'
            }
         }
         return null
      })
      .filter(proxy => proxy && proxy.ip && proxy.port)

   if (state.proxyList.length === 0) {
      DOM.noProxiesMessage?.classList.remove('hidden')
      displayFallbackProxyList()
      return
   }

   state.currentPage = 1
   state.filteredProxyList = [...state.proxyList]
   renderProxyList()
}

function handleSearch(e) {
   const searchTerm = e.target.value.toLowerCase().trim()

   state.filteredProxyList =
      searchTerm === ''
         ? [...state.proxyList]
         : state.proxyList.filter(proxy => proxy.provider.toLowerCase().includes(searchTerm) || proxy.country.toLowerCase().includes(searchTerm))

   state.currentPage = 1
   renderProxyList()
}

function renderProxyList() {
   DOM.proxyListContainer.innerHTML = ''

   if (state.filteredProxyList.length === 0) {
      DOM.noProxiesMessage?.classList.remove('hidden')
      DOM.paginationContainer.innerHTML = ''
      DOM.proxyCountInfo.textContent = ''
      return
   }

   DOM.noProxiesMessage?.classList.add('hidden')

   // Pagination
   const totalPages = Math.ceil(state.filteredProxyList.length / CONFIG.itemsPerPage)
   const startIndex = (state.currentPage - 1) * CONFIG.itemsPerPage
   const endIndex = Math.min(startIndex + CONFIG.itemsPerPage, state.filteredProxyList.length)
   const currentItems = state.filteredProxyList.slice(startIndex, endIndex)

   // Render proxy cards
   currentItems.forEach((proxy, index) => {
      const actualIndex = startIndex + index
      const card = createProxyCard(proxy, actualIndex)
      DOM.proxyListContainer.appendChild(card)
      checkProxyStatusInList(proxy, card.querySelector('.proxy-status-badge'))
   })

   // Render pagination
   renderPagination(totalPages)

   // Update count info
   DOM.proxyCountInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${state.filteredProxyList.length} proxies`
}

function createProxyCard(proxy, index) {
   const card = document.createElement('div')
   card.className = 'proxy-card group'

   card.innerHTML = `
    <div class="flex justify-between items-center">
      <div class="flex-1 min-w-0 pr-2">
        <div class="flex items-center">
          <div class="font-medium text-sm truncate group-hover:text-purple-300 font-bold transition-colors">
            ${proxy.provider}
          </div>
          <span class="proxy-status-badge inline-block w-3 h-3 rounded-full bg-gray-500 ml-2 animate-pulse"
                title="Checking..."></span>
        </div>
        <div class="text-xs text-gray-400 mt-1 truncate group-hover:text-gray-300 transition-colors">
          ${countryCodeToFlagEmoji(proxy.country)} ${CONFIG.countries[proxy.country]} | ${proxy.ip}:${proxy.port}
        </div>
      </div>
      <div class="flex-shrink-0">
        <button class="btn btn-sm btn-neutral gap-1 hover:scale-105 transition-transform rounded-lg"
                data-index="${index}">
          <i class="fas fa-plus-circle text-xs"></i>
          Create
        </button>
      </div>
    </div>
  `

   // Add click listener to button
   const button = card.querySelector('button')
   button.addEventListener('click', () => {
      selectProxy(index)
      showAccountCreationSection()
   })

   return card
}

async function checkProxyStatusInList(proxy, statusBadge) {
   if (!statusBadge) return

   try {
      const response = await fetch(`${CONFIG.proxyStatusApi}/${proxy.ip}:${proxy.port}`)
      const data = await response.json()
      const proxyData = Array.isArray(data) ? data[0] : data

      if (proxyData?.proxyip === true) {
         statusBadge.className = 'inline-block w-3 h-3 rounded-full bg-emerald-500 ml-2'
         statusBadge.title = 'Active'
      } else {
         statusBadge.className = 'inline-block w-3 h-3 rounded-full bg-rose-500 ml-2'
         statusBadge.title = 'Dead'
      }
   } catch (error) {
      statusBadge.className = 'inline-block w-3 h-3 rounded-full bg-amber-500 ml-2'
      statusBadge.title = 'Unknown'
   }
}

function renderPagination(totalPages) {
   if (totalPages <= 1) {
      DOM.paginationContainer.innerHTML = ''
      return
   }

   const html = `
    <div class="join">
      <button class="join-item btn btn-sm" data-page="${state.currentPage - 1}"
              ${state.currentPage === 1 ? 'disabled' : ''}>
        «
      </button>
      <button class="join-item btn btn-sm btn-disabled">
        Page ${state.currentPage} of ${totalPages}
      </button>
      <button class="join-item btn btn-sm" data-page="${state.currentPage + 1}"
              ${state.currentPage === totalPages ? 'disabled' : ''}>
        »
      </button>
    </div>
  `

   DOM.paginationContainer.innerHTML = html

   // Add click listeners
   DOM.paginationContainer.querySelectorAll('button[data-page]').forEach(button => {
      if (!button.hasAttribute('disabled')) {
         button.addEventListener('click', () => {
            state.currentPage = parseInt(button.dataset.page, 10)
            renderProxyList()
         })
      }
   })
}

// ============================================
// Proxy Selection
// ============================================
async function selectProxy(index) {
   state.selectedProxy = state.filteredProxyList[index]

   // Update UI
   document.getElementById('selected-ip').textContent = state.selectedProxy.ip
   document.getElementById('selected-port').textContent = state.selectedProxy.port
   document.getElementById('selected-country').textContent = `${countryCodeToFlagEmoji(state.selectedProxy.country)} ${
      CONFIG.countries[state.selectedProxy.country]
   }`
   document.getElementById('selected-provider').textContent = state.selectedProxy.provider

   // Update form fields
   const baseAccountName = `${countryCodeToFlagEmoji(state.selectedProxy.country)} ${state.selectedProxy.country} | ${state.selectedProxy.provider}`
   const path = CONFIG.pathTemplate.replace('{ip}', state.selectedProxy.ip).replace('{port}', state.selectedProxy.port)

   // Set paths
   ;['vmess', 'vless', 'trojan', 'ss'].forEach(protocol => {
      document.getElementById(`${protocol}-path`).value = path
      updateAccountName(protocol, baseAccountName)
   })

   // Check proxy status
   checkProxyStatusInCreation(state.selectedProxy)
}

function updateAccountName(protocol, baseName) {
   const security = document.getElementById(`${protocol}-security`)?.value || 'tls'
   const tlsType = security === 'tls' ? 'TLS' : 'NTLS'
   const protocolName = protocol === 'ss' ? 'SS' : protocol.charAt(0).toUpperCase() + protocol.slice(1)

   const nameInput = document.getElementById(`${protocol}-name`)
   if (nameInput) {
      nameInput.value = `${baseName} [${protocolName}-${tlsType}]`
   }

   // Add listener for security changes
   const securitySelect = document.getElementById(`${protocol}-security`)
   if (securitySelect) {
      securitySelect.addEventListener('change', function () {
         const newTlsType = this.value === 'tls' ? 'TLS' : 'NTLS'
         nameInput.value = `${baseName} [${protocolName}-${newTlsType}]`
      })
   }
}

async function checkProxyStatusInCreation(proxy) {
   const statusContainer = document.getElementById('proxy-status-container')
   const statusLoading = document.getElementById('proxy-status-loading')
   const statusActive = document.getElementById('proxy-status-active')
   const statusDead = document.getElementById('proxy-status-dead')
   const statusUnknown = document.getElementById('proxy-status-unknown')
   const latencyElement = document.getElementById('proxy-latency')

   // Show loading
   statusContainer?.classList.remove('hidden')
   statusLoading?.classList.remove('hidden')
   statusActive?.classList.add('hidden')
   statusDead?.classList.add('hidden')
   statusUnknown?.classList.add('hidden')

   const startTime = performance.now()

   try {
      const response = await fetch(`${CONFIG.proxyStatusApi}/${proxy.ip}:${proxy.port}`)
      const data = await response.json()
      const proxyData = Array.isArray(data) ? data[0] : data

      const latency = Math.floor(performance.now() - startTime)

      statusLoading?.classList.add('hidden')

      if (proxyData?.proxyip === true) {
         statusActive?.classList.remove('hidden')
         if (latencyElement) latencyElement.textContent = `${latency}ms`
      } else {
         statusDead?.classList.remove('hidden')
      }
   } catch (error) {
      console.error('Proxy status check error:', error)
      statusLoading?.classList.add('hidden')
      statusUnknown?.classList.remove('hidden')
   }
}

// ============================================
// Section Navigation
// ============================================
function showProxyListSection() {
   DOM.proxyListSection?.classList.remove('hidden')
   DOM.accountCreationSection?.classList.add('hidden')
   DOM.resultSection?.classList.add('hidden')
}

function showAccountCreationSection() {
   DOM.proxyListSection?.classList.add('hidden')
   DOM.accountCreationSection?.classList.remove('hidden')
   DOM.resultSection?.classList.add('hidden')
}
