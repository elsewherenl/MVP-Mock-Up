/* projects/artists/artists.js  – builds the list from the master data
   ---------------------------------------------------------------   */
import { ARTISTS } from '../data/artists.js';

/* DOM refs */
const grid    = document.getElementById('artists-grid');
const preview = document.querySelector('.hover-preview');
const imgBox  = preview.querySelector('.preview-image');
const nameBox = preview.querySelector('.preview-name');
const bioBox  = preview.querySelector('.preview-bio');

/* ---------- build grid ---------- */
ARTISTS.forEach(a => {
  const link = document.createElement('a');
  link.href = `${a.slug}.html`;
  link.className = 'artist-item';
  link.dataset.slug = a.slug;
  link.dataset.image = a.image;
  link.dataset.bio  = a.bio  || '';
  link.dataset.name = a.name;

  /* label */
  link.innerHTML = `
    <span class="artist-name">${a.name}</span>
    <span class="artist-works">${a.works} ${a.works === 1 ? 'work' : 'works'}</span>
  `;

  grid.appendChild(link);
});

/* ---------- desktop hover preview (fixed panel) ---------- */
if (window.innerWidth > 768) {
  grid.addEventListener('mouseover', e => {
    const item = e.target.closest('.artist-item');
    if (!item) return;

    /* highlight current name */
    grid.querySelectorAll('.artist-item')
        .forEach(el => el.classList.toggle('active', el === item));

    /* populate panel */
    imgBox.src          = item.dataset.image;
    nameBox.textContent = item.dataset.name;
    bioBox.textContent  = item.dataset.bio;

    preview.classList.add('active');
  });

  grid.addEventListener('mouseleave', () => {
    grid.querySelectorAll('.artist-item').forEach(el => el.classList.remove('active'));
    preview.classList.remove('active');
  });
}
