import { ARTISTS } from '../data/artists.js';
function goToProduct(productId) {
    console.log('Navigate to product:', slug);
    // window.location.href = `/collection/${slug}`;
}

function goToHome() {
    console.log('Go to home page');
    // This will eventually reload/navigate to the landing page
    // window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', function() {
    const scrollingArtworks = document.querySelector('.scrolling-artworks');
    /* ------- build marquee from the master data ------- */
    scrollingArtworks.innerHTML = '';           // clear any hard‑coded markup

    ARTISTS
      .filter(a => a.hero)                      // only hero images
      .forEach(a => {
        const div = document.createElement('div');
        div.className = `artwork-item ${a.heroSetClass}`;
        div.dataset.title   = a.title;
        div.dataset.artist  = a.name;
        div.dataset.edition = a.edition;
        div.style.backgroundImage = `url(${a.image})`;
        div.onclick = () => goToProduct(a.slug);
        scrollingArtworks.appendChild(div);
      });

    /* duplicate twice for seamless scroll */
    scrollingArtworks.innerHTML += scrollingArtworks.innerHTML + scrollingArtworks.innerHTML;
    
    // Desktop hover pause with smooth transition
    if (window.innerWidth > 768) {
        scrollingArtworks.addEventListener('mouseenter', () => {
            scrollingArtworks.style.animationPlayState = 'paused';
        });
        scrollingArtworks.addEventListener('mouseleave', () => {
            scrollingArtworks.style.animationPlayState = 'running';
        });
    } else {
        // Mobile: Start animation on first touch
        let hasInteracted = false;
        scrollingArtworks.addEventListener('touchstart', () => {
            if (!hasInteracted) {
                scrollingArtworks.classList.add('animate');
                hasInteracted = true;
            }
        }, { passive: true });
    }
    
    // Add loading class to images
    const artworkItems = document.querySelectorAll('.artwork-item');
    artworkItems.forEach(item => {
        item.classList.add('loading');
        
        // Create image object to detect when background image loads
        const bgImage = window.getComputedStyle(item).backgroundImage;
        const imageUrl = bgImage.match(/url\(["']?(.+?)["']?\)/)[1];
        const img = new Image();
        img.onload = () => {
            item.classList.remove('loading');
        };
        img.src = imageUrl;
    });
    });
// Mobile menu toggle
function toggleMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const menuOverlay = document.getElementById('mobileMenu');
    
    menuButton.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

// Close menu when clicking a link
document.querySelectorAll('.mobile-menu-overlay .nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.mobile-menu-button').classList.remove('active');
        document.getElementById('mobileMenu').classList.remove('active');
    });
});