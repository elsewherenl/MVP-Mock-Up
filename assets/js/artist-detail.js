// assets/js/artist-detail.js
import { ARTISTS } from '../data/artists.js';

function renderArtistPage() {
// Derive slug from data attribute on the gallery container
const galleryEl = document.querySelector('.artist-gallery');
const slug = galleryEl?.dataset.artistSlug || null;
if (!slug) {
  console.warn('No slug found on artist-gallery element');
  return;
}

  const artist = ARTISTS.find(a => a.slug === slug);
  if (!artist) {
    console.error('Artist not found:', slug);
    return;
  }

  // 1) BIO COLUMN
  const bioCol = document.querySelector('.bio-col');
  const scrollNode = document.querySelector('.h-scroll');
  const dotsNode   = document.querySelector('.carousel-indicators');
  if (!bioCol || !scrollNode || !dotsNode) return;

 bioCol.innerHTML = `
  <h1 class="artist-name">${artist.name}</h1>
  <p class="artist-vitals">(b. ${artist.birth}, ${artist.location})</p>
  <hr class="divider-gold" />
  <h2 class="section-header">BIOGRAPHY</h2>
  ${artist.fullBio ? `<p class="artist-bio">${artist.fullBio}</p>` : ''}
  ${artist.quote ? `
    <blockquote class="pull-quote">
      ${artist.quote}
    </blockquote>
  ` : ''}
  ${artist.statement ? `
    <p class="artist-bio">${artist.statement}</p>
  ` : ''}
`;

  // 2) GALLERY SLIDES
  scrollNode.innerHTML = '';
  dotsNode.innerHTML   = '';

  (artist.worksList || []).forEach((work, idx) => {
    // Normalize image path for correct loading
    const imgSrc = work.img; 

    // Create slide
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
      <img src="${imgSrc}" alt="${work.title}" class="slide-image">
      <div class="slide-info">
        <p class="slide-title">${work.title}</p>
        <p class="slide-meta">${work.year} • ${work.edition}</p>
      </div>
    `;
    scrollNode.appendChild(slide);
    
    // Add click handler for modal
    slide.addEventListener('click', () => {
        openModal(work, artist);
    });

    // Create nav dot
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      scrollNode.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
      // toggle active class
      dotsNode.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
    dotsNode.appendChild(dot);
  });

  // If only one work, hide indicators and center the slide
  if ((artist.worksList || []).length <= 1) {
    dotsNode.style.display = 'none';
    scrollNode.style.justifyContent = 'center';
    scrollNode.style.overflowX = 'hidden';
  }

  // Sync active dot on scroll
  scrollNode.addEventListener('scroll', () => {
    const slides = Array.from(scrollNode.children);
    const dots   = Array.from(dotsNode.children);
    const center = scrollNode.offsetWidth / 2;
    slides.forEach((slide, idx) => {
      const slideCenter = slide.offsetLeft - scrollNode.scrollLeft + slide.offsetWidth / 2;
      if (Math.abs(slideCenter - center) < slide.offsetWidth / 2) {
        dots.forEach(d => d.classList.remove('active'));
        dots[idx].classList.add('active');
      }
    });
  });
}

function openModal(work, artist) {
    const modal = document.getElementById('artworkModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalArtist = document.getElementById('modalArtist');
    const modalDetails = document.getElementById('modalDetails');
    const modalStatus = document.getElementById('modalStatus');

    modalImage.style.backgroundImage = `url('${work.img}')`;
    modalTitle.textContent = work.title;
    modalArtist.textContent = artist.name;
    modalDetails.innerHTML = `${work.year} • ${work.medium}<br>${work.dimensions}<br>${work.edition}`;
    modalStatus.textContent = work.availability || 'Available';
    modalStatus.className = `modal-status ${work.availability ? work.availability.toLowerCase() : 'available'}`;

    modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    renderArtistPage();
    
    const modal = document.getElementById('artworkModal');
    const closeBtn = document.getElementById('modalClose');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
// iOS Safari Layout Recalculation Fix
// Add this to your existing artist-detail.js file or create a separate script

// Method 1: Force carousel slides recalculation
function fixiOSSafariLayout() {
  const slides = document.querySelectorAll('.carousel-slide');
  
  if (slides.length > 0) {
    slides.forEach(slide => {
      // Force display recalculation
      slide.style.display = 'none';
      slide.offsetHeight; // Force browser reflow
      slide.style.display = '';
      
      // Also force width recalculation
      const currentWidth = slide.style.width;
      slide.style.width = '99.9%';
      slide.offsetWidth; // Force reflow
      slide.style.width = currentWidth || '';
    });
  }
}

// Method 2: Alternative - force container recalculation
function fixContainerLayout() {
  const container = document.querySelector('.h-scroll');
  const workCol = document.querySelector('.work-col');
  
  if (container) {
    container.style.display = 'none';
    container.offsetHeight; // Force reflow
    container.style.display = 'flex';
  }
  
  if (workCol) {
    workCol.style.width = '99.9%';
    workCol.offsetWidth; // Force reflow
    workCol.style.width = '';
  }
}

// Run the fix after page load
window.addEventListener('load', () => {
  // Small delay to ensure everything is rendered
  setTimeout(() => {
    fixiOSSafariLayout();
    fixContainerLayout();
  }, 100);
  
  // Also run after a longer delay as backup
  setTimeout(() => {
    fixiOSSafariLayout();
  }, 500);
});

// Also run after orientation change
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    fixiOSSafariLayout();
    fixContainerLayout();
  }, 200);
});

// Run after window resize (covers other layout changes)
window.addEventListener('resize', () => {
  setTimeout(() => {
    fixiOSSafariLayout();
  }, 100);
});

// Optional: Run when images load (if carousel depends on images)
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.carousel-slide img');
  let loadedImages = 0;
  
  if (images.length > 0) {
    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.addEventListener('load', () => {
          loadedImages++;
          if (loadedImages === images.length) {
            // All images loaded, recalculate layout
            setTimeout(fixiOSSafariLayout, 50);
          }
        });
      }
    });
    
    // If all images were already loaded
    if (loadedImages === images.length) {
      setTimeout(fixiOSSafariLayout, 50);
    }
  }
});
