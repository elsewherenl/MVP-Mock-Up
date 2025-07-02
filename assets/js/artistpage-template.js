// artistpage-template.js

import { ARTISTS } from '../data/artists.js';

document.addEventListener('DOMContentLoaded', () => {
  // Get the slug from the filename (e.g. sarah-chen.html)
  const slug = window.location.pathname.split('/').pop().replace('.html', '');
  if (!slug) {
    document.body.innerHTML = "<p style='padding:2rem;font-family:sans-serif;'>Artist not found (no slug in URL).</p>";
    return;
  }

  // Find artist in the data
  const artist = ARTISTS.find(a => a.slug === slug);
  if (!artist) {
    document.body.innerHTML = `<p style='padding:2rem;font-family:sans-serif;'>Artist not found: ${slug}</p>`;
    return;
  }

  // Fill in the hero image
  const heroImg = document.querySelector('.artist-hero-img');
  heroImg.src = artist.images[0];
  heroImg.alt = artist.headline || artist.name;

  // Fill text
  document.querySelector('.artist-name').textContent = artist.name;
  document.querySelector('.artist-headline').textContent = artist.headline || '';
  document.querySelector('.artist-caption').textContent = artist.caption || '';

  // Bio/About
  document.querySelector('.artist-bio').textContent = artist.bio || '';

  // Works
  const grid = document.querySelector('.works-grid');
  if (artist.works && artist.works.length) {
    artist.works.forEach(w => {
      const fig = document.createElement('figure');
      fig.innerHTML = `
        <img src="${w.img}" alt="${w.title}">
        <figcaption>${w.title}</figcaption>
      `;
      grid.appendChild(fig);
    });
  } else {
    grid.innerHTML = '<div style="color:#888;">No works to display.</div>';
  }
});