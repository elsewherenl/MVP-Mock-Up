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
    const imgSrc = work.img.replace('../assets/img/', '/assets/img/');

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
// Add this new line:
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

document.addEventListener('DOMContentLoaded', renderArtistPage);

document.addEventListener('DOMContentLoaded', () => {
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
document.addEventListener('DOMContentLoaded', renderArtistPage);

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