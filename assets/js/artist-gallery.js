// assets/js/artist-gallery.js
import { ARTISTS } from '../data/artists.js';

function initArtistGalleries() {
  const galleries = document.querySelectorAll('.artist-gallery');
  galleries.forEach(gallery => {
    const slug = gallery.dataset.artistSlug;
    console.log('Initializing gallery for:', slug);
    const artist = ARTISTS.find(a => a.slug === slug) || {};
    const works = artist.worksList 
      || artist.images?.map((img, i) => ({ title: `Work ${i+1}`, img })) 
      || [];
    if (!works.length) {
      console.warn(`No works found for artist "${slug}"`);
      return;
    }

    const scrollEl = gallery.querySelector('.h-scroll');
    const dotsEl   = gallery.querySelector('.carousel-indicators');

    works.forEach((work, idx) => {
      // Normalize image path (strip leading ../ and make root-relative)
      // Strip any "../" prefixes and ensure the URL starts with "/assets/img/"
const imgSrc = work.img.replace(/^(\.\.\/)+/, '/');

      // Create slide
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.innerHTML = `
  <div class="slide-image" style="background-image: url('${imgSrc}')"></div>
  <div class="slide-info">
    <p class="slide-title">${work.title}</p>
    <p class="slide-meta">
      ${work.year || artist.year || ''} ${work.year || artist.year ? '•' : ''} ${work.edition || artist.edition || ''}
    </p>
  </div>
`;
      scrollEl.append(slide);

      // Create dot indicator
      const dot = document.createElement('span');
      dot.className = 'dot';
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        scrollEl.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
      });
      dotsEl.append(dot);
    });

    // Sync active dot on scroll
    scrollEl.addEventListener('scroll', () => {
      const slides = Array.from(scrollEl.children);
      const dots   = Array.from(dotsEl.children);
      const center = scrollEl.offsetWidth / 2;
      slides.forEach((slide, idx) => {
        const slideCenter = slide.offsetLeft - scrollEl.scrollLeft + slide.offsetWidth / 2;
        if (Math.abs(slideCenter - center) < slide.offsetWidth / 2) {
          dots.forEach(d => d.classList.remove('active'));
          dots[idx].classList.add('active');
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initArtistGalleries);