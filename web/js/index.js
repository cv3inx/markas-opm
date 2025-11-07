/**
 * JavaScript for the index page
 */

document.addEventListener('DOMContentLoaded', async () => {
   // Mobile menu toggle
   const mobileMenuBtn = document.getElementById('mobile-menu-btn')
   const mainNav = document.getElementById('main-nav')

   if (mobileMenuBtn && mainNav) {
      mobileMenuBtn.addEventListener('click', () => {
         mainNav.classList.toggle('active')
         mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>'
      })
   }

   // Smooth scrolling for anchor links
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
         e.preventDefault()

         const targetId = this.getAttribute('href')
         if (targetId === '#') return

         const targetElement = document.querySelector(targetId)
         if (targetElement) {
            targetElement.scrollIntoView({
               behavior: 'smooth'
            })

            // Close mobile menu if open
            if (mainNav && mainNav.classList.contains('active')) {
               mainNav.classList.remove('active')
               mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
            }
         }
      })
   })

   // Particle effect
   const particlesContainer = document.getElementById('particles')
   if (particlesContainer) {
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
         const particle = document.createElement('div')
         particle.classList.add('particle')

         // Random position
         const posX = Math.random() * 100
         const posY = Math.random() * 100 + 100 // Start below the viewport

         // Random size
         const size = Math.random() * 4 + 1

         // Random opacity
         const opacity = Math.random() * 0.6 + 0.1

         // Random animation duration
         const duration = Math.random() * 20 + 10

         // Random animation delay
         const delay = Math.random() * 10

         // Random color
         const colors = ['#6a11cb', '#2575fc', '#a0a0ff', '#ffffff']
         const color = colors[Math.floor(Math.random() * colors.length)]

         // Apply styles
         particle.style.left = `${posX}%`
         particle.style.top = `${posY}%`
         particle.style.width = `${size}px`
         particle.style.height = `${size}px`
         particle.style.opacity = opacity
         particle.style.background = color
         particle.style.boxShadow = `0 0 ${size * 2}px ${color}`
         particle.style.animationDuration = `${duration}s`
         particle.style.animationDelay = `${delay}s`

         particlesContainer.appendChild(particle)
      }
   }

   // Add data-text attribute for text shadow effect
   const profileName = document.querySelector('.profile-name')
   if (profileName) {
      profileName.setAttribute('data-text', 'MARKASOPM')
   }
})
