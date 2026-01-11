// CUCU API Docs - Floating Cart CTA
// This script creates a persistent cart button that follows users

(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingCart);
  } else {
    initFloatingCart();
  }

  function initFloatingCart() {
    // Create floating cart container
    const floatingCart = document.createElement('div');
    floatingCart.className = 'floating-cart';
    floatingCart.innerHTML = `
      <div class="floating-cart-tooltip">
        <strong>Empieza a facturar hoy</strong><br/>
        Plan API desde <strong>Bs. 280/mes</strong>
      </div>
      <a href="https://app.cucu.bo/checkout?plan=senior&billing=monthly" class="floating-cart-btn" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        Comprar Ahora
      </a>
      <a href="https://cucu.bo/pricing" class="floating-cart-link" target="_blank">
        Ver todos los precios →
      </a>
    `;

    document.body.appendChild(floatingCart);

    // Hide tooltip after 5 seconds on first load
    const tooltip = floatingCart.querySelector('.floating-cart-tooltip');
    setTimeout(() => {
      if (tooltip) {
        tooltip.style.animation = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(10px)';
        tooltip.style.transition = 'all 0.3s ease';
      }
    }, 8000);

    // Show tooltip on hover
    const btn = floatingCart.querySelector('.floating-cart-btn');
    btn.addEventListener('mouseenter', () => {
      if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(10px)';
      }
    });

    // Track scroll and show/hide based on position
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Keep cart visible but can add scroll-based animations here
          const scrollDiff = window.scrollY - lastScrollY;

          // Subtle animation on scroll direction change
          if (Math.abs(scrollDiff) > 50) {
            btn.style.transform = scrollDiff > 0 ? 'scale(0.95)' : 'scale(1.05)';
            setTimeout(() => {
              btn.style.transform = '';
            }, 150);
          }

          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();
