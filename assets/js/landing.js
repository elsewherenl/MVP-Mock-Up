// ========== UNIFIED MOBILE-DESKTOP LANDING PAGE SYSTEM ========== 

// 🎯 SINGLE SOURCE OF TRUTH - Update images and content here
const CONTENT_DATA = {
    // Hero/Stories content - same data used for both desktop and mobile
    stories: [
        {
            id: 1,
            title: "New Voices, Celebrated Perspectives",
            project: "Fragments of Memory",
            artist: "Sarah Chen",
            edition: "Edition of 25 • 2023 • Recently Added",
            curatorial: "Chen captures the delicate intersection between memory and place, finding poetry in urban solitude.",
            cta: "See the Series",
            ctaLink: "../collection/",
            // 📸 CHANGE IMAGES HERE - works for both desktop and mobile
            backgroundImage: "url('../assets/img/sarah-chen-2.jpg')",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" // Fallback if no image
        },
        {
            id: 2,
            title: "New Voices, Celebrated Perspectives", 
            project: "Urban Solitude",
            artist: "Marcus Wright",
            edition: "Edition of 30 • 2023",
            curatorial: "Wright transforms industrial decay into meditation on resilience and renewal.",
            cta: "Explore Collection",
            ctaLink: "../collection/",
            // 📸 CHANGE IMAGES HERE
            backgroundImage: "url('../assets/img/marcus-wright.jpg')",
            gradient: "linear-gradient(135deg, #a8a8a8 0%, #6a6a6a 100%)"
        },
        {
            id: 3,
            title: "New Voices, Celebrated Perspectives",
            project: "Between Worlds", 
            artist: "Elena Rossi",
            edition: "Edition of 20 • 2024 • New",
            curatorial: "Rossi finds intimacy in the urban rush, capturing quiet moments of human connection.",
            cta: "About This Artist",
            ctaLink: "../artists/",
            // 📸 CHANGE IMAGES HERE
            backgroundImage: "url('../assets/img/elena-rossi.jpg')",
            gradient: "linear-gradient(135deg, #8b7355 0%, #5d4e37 100%)"
        }
    ],
    
    // About section content
    about: {
        text: "Elsewhere Collective champions new voices and celebrated perspectives in contemporary photography. We curate limited editions from photographers with something distinctive to say."
    },
    
    // Featured artists data
    featured: [
        {
            title: "Urban Solitude",
            artist: "Marcus Wright", 
            bio: "London-based visual artist exploring industrial landscapes and their evolving relationship with nature. His work captures beauty in decay and resilience in regeneration.",
            // 📸 CHANGE FEATURED IMAGES HERE
            image: "url('../assets/img/marcus-wright.jpg')",
            size: "large"
        },
        {
            title: "Between Worlds",
            artist: "Elena Rossi",
            bio: "Captures the quiet intimacy of urban life through her distinctive street photography approach.",
            image: "url('../assets/img/elena-rossi.jpg')",
            size: "regular"
        },
        {
            title: "Silent Streets", 
            artist: "Kai Tanaka",
            bio: "Minimalist approach to urban photography, finding silence and space within bustling cityscapes.",
            image: "url('../assets/img/kai-tanaka.jpg')",
            size: "regular"
        },
        {
            title: "Ocean Breeze",
            artist: "Tom Rivers", 
            bio: "Documents the changing relationship between human settlements and coastal environments.",
            image: "url('../assets/img/tom-rivers.jpg')",
            size: "regular"
        },
        {
            title: "Golden Hour",
            artist: "Nina Sol",
            bio: "Explores the interplay of natural light and urban architecture during transitional moments.", 
            image: "url('../assets/img/nina-sol.jpg')",
            size: "regular"
        }
    ],
    
    // CTA section
    cta: {
        title: "Discover the Collection",
        text: "Explore our carefully curated selection of contemporary photography from emerging artists across Europe.",
        buttonText: "View Full Collection",
        buttonLink: "../collection/"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== GLOBAL VARIABLES ==========
    let currentDesktopSlide = 0;
    let desktopCarouselInterval;
    let currentMobileStory = 0;
    let mobileStoryInterval;
    let mobileProgressInterval;
    
    // 🎯 INITIALIZE CONTENT FROM SINGLE DATA SOURCE
    initializeContent();
    
    // Initialize scroll progress
    initializeScrollProgress();
    
    // Initialize desktop hero carousel
    initializeDesktopCarousel();
    
    // Initialize mobile stories
    initializeMobileStories();
    
    // Initialize animations
    initializeAnimations();
    
    // ========== CONTENT INITIALIZATION ==========
    function initializeContent() {
        // About section
        document.getElementById('aboutText').textContent = CONTENT_DATA.about.text;
        
        // Desktop hero slides
        const heroContainer = document.getElementById('heroSlidesContainer');
        CONTENT_DATA.stories.forEach((story, index) => {
            const slide = createDesktopSlide(story, index === 0);
            heroContainer.appendChild(slide);
        });
        
        // Mobile stories - only show the FIRST story
        const mobileContainer = document.getElementById('mobileStoriesContainer');
        // Only create the first story for mobile
        const firstStory = createMobileStory(CONTENT_DATA.stories[0], true);
        mobileContainer.appendChild(firstStory);
        
        // Mobile dots - NEVER show dots (we only have one story on mobile)
        const dotsContainer = document.getElementById('mobileNavDots');
        const progressContainer = document.getElementById('mobileProgressContainer');
        
        // Always hide dots and progress for mobile since we only show one story
        dotsContainer.style.display = 'none';
        progressContainer.style.display = 'none';
        
        // Featured grid
        const featuredGrid = document.getElementById('featuredGrid');
        CONTENT_DATA.featured.forEach(item => {
            const card = createFeaturedCard(item);
            featuredGrid.appendChild(card);
        });
        
        // Add CTA section
        const ctaSection = createCTASection();
        featuredGrid.appendChild(ctaSection);
        
        // Update counters
        document.getElementById('total-slides').textContent = CONTENT_DATA.stories.length;
    }
    
    // ========== DESKTOP SLIDE CREATION ==========
    function createDesktopSlide(story, isActive) {
        const slide = document.createElement('div');
        slide.className = `hero-slide ${isActive ? 'active' : ''}`;
        slide.style.backgroundImage = story.backgroundImage;
        slide.style.background = story.backgroundImage ? story.backgroundImage : story.gradient;
        
        slide.innerHTML = `
            <div class="hero-overlay">
                <div class="hero-content">
                    <h1 class="hero-title">${story.title}</h1>
                    <p class="hero-artist">${story.project} • ${story.artist}</p>
                    <p class="hero-edition">${story.edition}</p>
                    <p class="curatorial-note">"${story.curatorial}"</p>
                    <a href="${story.ctaLink}" class="hero-cta">${story.cta}</a>
                </div>
            </div>
        `;
        
        return slide;
    }
    
    // ========== MOBILE STORY CREATION ==========
    function createMobileStory(story, isActive) {
        const mobileStory = document.createElement('div');
        mobileStory.className = `mobile-story ${isActive ? 'active' : ''}`;
        mobileStory.style.backgroundImage = story.backgroundImage;
        mobileStory.style.background = story.backgroundImage ? story.backgroundImage : story.gradient;
        
        mobileStory.innerHTML = `
            <div class="mobile-story-overlay">
                <h1 class="mobile-story-title">${story.project}</h1>
                <p class="mobile-story-artist">${story.artist}</p>
                <p class="mobile-story-edition">${story.edition.split(' • ')[0]}</p>
                <a href="${story.ctaLink}" class="mobile-story-cta">${story.cta}</a>
            </div>
        `;
        
        return mobileStory;
    }
    
    // ========== FEATURED CARD CREATION ==========
    function createFeaturedCard(item) {
        const card = document.createElement('div');
        card.className = `featured-card ${item.size}`;
        
        card.innerHTML = `
            <div class="card-image" style="background-image: ${item.image};"></div>
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-artist">${item.artist}</p>
                <p class="card-bio">${item.bio}</p>
            </div>
        `;
        
        return card;
    }
    
    // ========== CTA SECTION CREATION ==========
    function createCTASection() {
        const ctaSection = document.createElement('div');
        ctaSection.className = 'cta-section';
        
        ctaSection.innerHTML = `
            <div class="cta-content">
                <h2 class="cta-title">${CONTENT_DATA.cta.title}</h2>
                <p class="cta-text">${CONTENT_DATA.cta.text}</p>
                <a href="${CONTENT_DATA.cta.buttonLink}" class="cta-button">${CONTENT_DATA.cta.buttonText}</a>
            </div>
        `;
        
        return ctaSection;
    }
    
    // ========== SCROLL PROGRESS ==========
    function initializeScrollProgress() {
        const scrollProgressBar = document.getElementById('scrollProgressBar');
        
        if (scrollProgressBar) {
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / scrollHeight) * 100;
                
                const adjustedPercent = 15 + (scrollPercent * 0.85);
                scrollProgressBar.style.height = adjustedPercent + '%';
            });
        }
    }
    
    // ========== DESKTOP CAROUSEL ==========
    function initializeDesktopCarousel() {
        // Auto-advance every 5 seconds
        desktopCarouselInterval = setInterval(() => {
            nextDesktopSlide();
        }, 5000);
        
        // Pause on hover
        const heroCarousel = document.querySelector('.hero-carousel');
        if (heroCarousel) {
            heroCarousel.addEventListener('mouseenter', () => {
                clearInterval(desktopCarouselInterval);
            });
            
            heroCarousel.addEventListener('mouseleave', () => {
                desktopCarouselInterval = setInterval(() => {
                    nextDesktopSlide();
                }, 5000);
            });
        }
    }
    
    function nextDesktopSlide() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return; // Safety check
        
        slides[currentDesktopSlide].classList.remove('active');
        
        currentDesktopSlide = (currentDesktopSlide + 1) % CONTENT_DATA.stories.length;
        slides[currentDesktopSlide].classList.add('active');
        
        const currentSlideElement = document.getElementById('current-slide');
        if (currentSlideElement) {
            currentSlideElement.textContent = currentDesktopSlide + 1;
        }
    }
    
    // ========== MOBILE STORIES ==========
    function initializeMobileStories() {
        // Mobile only shows one story - no need for any navigation
        // No touch gestures, no auto-advance, no swipe functionality
        return;
    }
    
    function switchMobileStory(index) {
        const stories = document.querySelectorAll('.mobile-story');
        const dots = document.querySelectorAll('.mobile-dot');
        
        if (stories.length === 0) return; // Safety check
        
        stories[currentMobileStory].classList.remove('active');
        dots[currentMobileStory].classList.remove('active');
        
        currentMobileStory = index;
        
        stories[currentMobileStory].classList.add('active');
        dots[currentMobileStory].classList.add('active');
        
        // Update counter
        const counter = document.querySelector('.mobile-story-counter');
        if (counter) {
            counter.textContent = `${currentMobileStory + 1} / ${CONTENT_DATA.stories.length}`;
        }
        
        // Restart progress
        startMobileStoryProgress();
    }
    
    function nextMobileStory() {
        const nextIndex = (currentMobileStory + 1) % CONTENT_DATA.stories.length;
        switchMobileStory(nextIndex);
    }
    
    function previousMobileStory() {
        const prevIndex = currentMobileStory === 0 ? CONTENT_DATA.stories.length - 1 : currentMobileStory - 1;
        switchMobileStory(prevIndex);
    }
    
    function startMobileStoryProgress() {
        clearInterval(mobileStoryInterval);
        clearInterval(mobileProgressInterval);
        
        const progressBar = document.getElementById('mobileProgressBar');
        if (!progressBar) return; // Safety check
        
        let progress = 0;
        
        mobileProgressInterval = setInterval(() => {
            progress += 2; // 2% every 100ms = 5 seconds total
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                nextMobileStory();
            }
        }, 100);
    }
    
    function pauseMobileStory() {
        clearInterval(mobileProgressInterval);
    }
    
    function resumeMobileStory() {
        // Continue from current progress
        const progressBar = document.getElementById('mobileProgressBar');
        if (!progressBar) return; // Safety check
        
        let currentProgress = parseFloat(progressBar.style.width) || 0;
        
        mobileProgressInterval = setInterval(() => {
            currentProgress += 2;
            progressBar.style.width = currentProgress + '%';
            
            if (currentProgress >= 100) {
                nextMobileStory();
            }
        }, 100);
    }
    
    // ========== ANIMATIONS ==========
    function initializeAnimations() {
        // Featured title fade in
        const featuredTitle = document.querySelector('.section-subtitle');
        if (featuredTitle) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(featuredTitle);
        }
        
        // Featured cards animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        const featuredCards = document.querySelectorAll('.featured-card');
        featuredCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    }
});