// Import artists data
import { ARTISTS } from '../data/artists.js';

class MagazineGallery {
    constructor() {
        this.artworks = [];
        this.filteredArtworks = [];
        this.currentFilter = { artist: 'all', medium: 'all' };
        this.sidebarVisible = true;
        this.init();
    }

    init() {
        this.generateArtworksList();
        this.generateFilters();
        this.renderGallery();
        this.setupEventListeners();
        this.updateStats();
        this.setupSidebarToggle();
        this.setupModal();
    }

    setupModal() {
        const modal = document.getElementById('artworkModal');
        const closeBtn = document.getElementById('modalClose');
        
        // Close modal when clicking close button
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Close modal when clicking overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    showArtworkModal(artwork) {
        console.log('Opening modal for:', artwork.title); // Debug log
        const modal = document.getElementById('artworkModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalArtist = document.getElementById('modalArtist');
        const modalDetails = document.getElementById('modalDetails');
        const modalStatus = document.getElementById('modalStatus');
        
        // Populate modal content
        modalImage.style.backgroundImage = `url('${artwork.image}')`;
        modalTitle.textContent = artwork.title;
        modalArtist.textContent = artwork.artist;
        modalDetails.innerHTML = `
            ${artwork.year} • ${artwork.medium}<br>
            ${artwork.dimensions}<br>
            ${artwork.edition}
        `;
        
        const statusClass = artwork.status === 'available' ? 'available' : 
                          artwork.status === 'sold' ? 'sold' : 'reserved';
        const statusText = artwork.status === 'available' ? 'Available' :
                         artwork.status === 'sold' ? 'Sold' : 'Reserved';
        
        modalStatus.className = `modal-status ${statusClass}`;
        modalStatus.textContent = statusText;
        
        // Show modal
        modal.classList.add('active');
    }

    generateArtworksList() {
        this.artworks = [];
        
        ARTISTS.forEach(artist => {
            if (artist.worksList && artist.worksList.length > 0) {
                artist.worksList.forEach((work, index) => {
                    this.artworks.push({
                        id: `${artist.slug}-${index}`,
                        title: work.title,
                        artist: artist.name,
                        artistSlug: artist.slug,
                        year: work.year,
                        edition: work.edition,
                        medium: this.detectMedium(work.title, artist.bio),
                        image: work.img,
                        dimensions: this.generateDimensions(),
                        status: this.generateStatus()
                    });
                });
            }
        });

        this.filteredArtworks = [...this.artworks];
    }

    detectMedium(title, bio) {
        // Simple medium detection based on content
        const lowerTitle = title.toLowerCase();
        const lowerBio = bio.toLowerCase();
        
        if (lowerBio.includes('photograph') || lowerTitle.includes('urban')) {
            return 'Photography';
        } else if (lowerBio.includes('paint') || lowerTitle.includes('abstract')) {
            return 'Painting';
        } else if (lowerBio.includes('digital') || lowerTitle.includes('digital')) {
            return 'Digital Art';
        } else {
            return 'Mixed Media';
        }
    }

    generateDimensions() {
        const sizes = [
            "40 × 30 inches", "36 × 24 inches", "48 × 36 inches",
            "32 × 24 inches", "44 × 32 inches", "30 × 22 inches"
        ];
        return sizes[Math.floor(Math.random() * sizes.length)];
    }

    generateStatus() {
        const statuses = ['available', 'available', 'available', 'sold', 'reserved'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    generateFilters() {
        // Artist filters
        const artists = [...new Set(this.artworks.map(work => work.artist))];
        const artistFilters = document.getElementById('artist-filters');
        
        // Clear existing filters
        artistFilters.innerHTML = '';
        
        // Add "All Artists" option first
        const allArtistsFilter = document.createElement('a');
        allArtistsFilter.href = '#';
        allArtistsFilter.className = 'filter-item active'; // Make it active by default
        allArtistsFilter.textContent = 'All Artists';
        allArtistsFilter.dataset.filter = 'all';
        artistFilters.appendChild(allArtistsFilter);
        
        // Add individual artists
        artists.forEach(artist => {
            const filterItem = document.createElement('a');
            filterItem.href = '#';
            filterItem.className = 'filter-item';
            filterItem.textContent = artist;
            filterItem.dataset.filter = artist.toLowerCase().replace(/\s+/g, '-');
            artistFilters.appendChild(filterItem);
        });

        // Medium filters
        const media = [...new Set(this.artworks.map(work => work.medium))];
        const mediumFilters = document.getElementById('medium-filters');
        
        // Clear existing filters
        mediumFilters.innerHTML = '';
        
        // Add "All Media" option first
        const allMediaFilter = document.createElement('a');
        allMediaFilter.href = '#';
        allMediaFilter.className = 'filter-item active'; // Make it active by default
        allMediaFilter.textContent = 'All Media';
        allMediaFilter.dataset.filter = 'all';
        mediumFilters.appendChild(allMediaFilter);
        
        // Add individual media types
        media.forEach(medium => {
            const filterItem = document.createElement('a');
            filterItem.href = '#';
            filterItem.className = 'filter-item';
            filterItem.textContent = medium;
            filterItem.dataset.filter = medium.toLowerCase().replace(/\s+/g, '-');
            mediumFilters.appendChild(filterItem);
        });
    }

    renderGallery() {
        const magazine = document.getElementById('gallery-magazine');
        magazine.innerHTML = '';

        // Limit to 12 pieces for the magazine layout
        const displayArtworks = this.filteredArtworks.slice(0, 12);

        if (displayArtworks.length === 0) {
            magazine.innerHTML = '<div class="loading">No artworks match your filters</div>';
            return;
        }

        displayArtworks.forEach((artwork, index) => {
            const piece = document.createElement('div');
            piece.className = `artwork-piece piece-${index + 1}`;
            piece.onclick = () => this.showArtworkModal(artwork);  // ✅ CORRECT - opens modal

            const statusClass = artwork.status === 'available' ? 'available' : 
                              artwork.status === 'sold' ? 'sold' : 'reserved';
            
            const statusText = artwork.status === 'available' ? 'Available' :
                             artwork.status === 'sold' ? 'Sold' : 'Reserved';

            piece.innerHTML = `
                <div class="artwork-image" style="background-image: url('${artwork.image}')"></div>
                <div class="artwork-info">
                    <div class="artwork-title">${artwork.title}</div>
                    <div class="artwork-artist">${artwork.artist}</div>
                    <div class="artwork-details">
                        ${artwork.year} • ${artwork.medium}<br>
                        ${artwork.dimensions} • ${artwork.edition}
                    </div>
                    <div class="availability ${statusClass}">${statusText}</div>
                </div>
            `;

            magazine.appendChild(piece);
        });
    }

    setupEventListeners() {
        // Filter event listeners
        ['artist', 'medium'].forEach(filterType => {
            const filterContainer = document.getElementById(`${filterType}-filters`);
            if (filterContainer) {
                filterContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('filter-item')) {
                        e.preventDefault();
                        console.log(`Filter clicked: ${filterType} - ${e.target.dataset.filter}`); // Debug log
                        this.setActiveFilter(e.target, filterType);
                        this.applyFilters();
                    }
                });
            }
        });
    }

    setupSidebarToggle() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContainer = document.getElementById('collectionMain');

        if (toggle && sidebar && mainContainer) {
            toggle.addEventListener('click', () => {
                this.sidebarVisible = !this.sidebarVisible;
                
                if (this.sidebarVisible) {
                    sidebar.classList.remove('hidden');
                    mainContainer.classList.remove('sidebar-hidden');
                } else {
                    sidebar.classList.add('hidden');
                    mainContainer.classList.add('sidebar-hidden');
                }
            });
        }
    }

    setActiveFilter(element, type) {
        // Remove active class from all filters in this category
        element.parentElement.querySelectorAll('.filter-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked filter
        element.classList.add('active');
        
        // Update current filter state
        this.currentFilter[type] = element.dataset.filter;
        
        console.log('Current filters:', this.currentFilter); // Debug log
    }

    applyFilters() {
        console.log('Applying filters:', this.currentFilter); // Debug log
        
        this.filteredArtworks = this.artworks.filter(artwork => {
            const artistMatch = this.currentFilter.artist === 'all' || 
                              artwork.artist.toLowerCase().replace(/\s+/g, '-') === this.currentFilter.artist;
            
            const mediumMatch = this.currentFilter.medium === 'all' || 
                               artwork.medium.toLowerCase().replace(/\s+/g, '-') === this.currentFilter.medium;
            
            return artistMatch && mediumMatch;
        });

        console.log('Filtered artworks count:', this.filteredArtworks.length); // Debug log
        
        this.renderGallery();
        this.updateStats();
    }

    updateStats() {
        const countElement = document.getElementById('artwork-count');
        if (countElement) {
            countElement.textContent = this.filteredArtworks.length;
        }
    }

    openArtwork(artwork) {
        window.location.href = `../artists/${artwork.artistSlug}.html`;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MagazineGallery();
});