// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Initialize variables
    let currentPage = 0;
    const totalPages = 5;
    let isTransitioning = false;

    // Get DOM elements
    const loadingScreen = document.getElementById('loadingScreen');
    const bookContainer = document.getElementById('bookContainer');
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const closeMenu = document.getElementById('closeMenu');
    const pages = document.querySelectorAll('.page');
    const pageDots = document.querySelectorAll('.page-dot');
    const navLinks = document.querySelectorAll('.nav-menu nav a');

    // Debug: Log initial setup
    console.log('🔧 Debugging page navigation setup:');
    console.log('Total pages found:', pages.length);
    console.log('Total page dots found:', pageDots.length);
    console.log('Total nav links found:', navLinks.length);
    console.log('Expected total pages:', totalPages);

    // Verify all pages are properly structured
    pages.forEach((page, index) => {
        const pageNum = page.getAttribute('data-page');
        console.log(`Page ${index}: data-page="${pageNum}", class="${page.className}"`);
    });

    // Typing animation texts
    const typingTexts = [
        'Building the future with code...',
        'Solving problems, one algorithm at a time...',
        'Passionate about clean, efficient code...',
        'Always learning, always growing...'
    ];

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    // Enhanced Touch/swipe variables for mobile optimization
    let startY = 0;
    let startX = 0;
    let endY = 0;
    let endX = 0;
    let isScrolling = false;
    let isSwiping = false;
    let swipeStartTime = 0;
    let touchStarted = false;
    let lastTouchTime = 0;
    const swipeThreshold = 50; // Minimum distance for swipe
    const swipeTimeThreshold = 300; // Maximum time for swipe gesture
    const doubleTapThreshold = 300; // Time window for double tap
    let lastTapTime = 0;

    // Enhanced sound effects references
    const tapSound = document.getElementById('tapSound');
    const sliceSound = document.getElementById('sliceSound');
    const hoverSound = document.getElementById('hoverSound');
    const successSound = document.getElementById('successSound');
    const errorSound = document.getElementById('errorSound');
    const whooshSound = document.getElementById('whooshSound');
    const swooshSound = document.getElementById('swooshSound');
    const popSound = document.getElementById('popSound');

    // Sound settings optimized for mobile
    let soundEnabled = true;
    let soundVolume = 0.4;
    let lastSoundTime = 0;
    const soundCooldown = 100; // Minimum time between sounds in ms

    // Enhanced sound playback function for mobile compatibility
    function playSound(audioElement, volume = soundVolume, force = false) {
        if (!soundEnabled || !audioElement) return;
        
        const now = Date.now();
        if (!force && now - lastSoundTime < soundCooldown) return;
        
        try {
            audioElement.volume = Math.min(volume, 0.8);
            audioElement.currentTime = 0;
            
            // Create promise-based playback for better mobile support
            const playPromise = audioElement.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    lastSoundTime = now;
                }).catch(error => {
                    console.log('Sound play prevented:', error);
                    // Auto-enable on first user interaction
                    if (error.name === 'NotAllowedError') {
                        document.addEventListener('touchstart', enableSounds, { once: true });
                        document.addEventListener('click', enableSounds, { once: true });
                    }
                });
            }
        } catch (error) {
            console.log('Sound error:', error);
        }
    }

    // Auto-enable sounds after first user interaction
    function enableSounds() {
        soundEnabled = true;
        console.log('🔊 Sounds enabled for mobile!');
        
        // Pre-load all sounds
        [tapSound, sliceSound, hoverSound, successSound, errorSound, whooshSound, swooshSound, popSound].forEach(audio => {
            if (audio) {
                audio.volume = 0.01;
                audio.play().then(() => audio.pause()).catch(() => {});
            }
        });
    }

    // Enhanced sound variety for different interactions
    function playRandomTapSound() {
        const sounds = [tapSound, popSound];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        playSound(randomSound, 0.3);
    }

    function playTransitionSound() {
        const sounds = [sliceSound, whooshSound, swooshSound];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        playSound(randomSound, 0.5, true);
    }

    // Add ripple effect for touch feedback
    function createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        ripple.className = 'page-transition-effect';
        
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Initialize the app
    function init() {
        // Hide loading screen after a short delay
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);

        // Start typing animation
        setTimeout(typeWriter, 2000);

        // Add event listeners
        setupEventListeners();

        // Initialize first page
        showPage(0);

        console.log('🚀 Mobile portfolio loaded successfully!');
        console.log('💚 Built with love by Manoranjan Pradhan');
        console.log('📱 Optimized for mobile devices with page transitions!');
        
        // Debug: Test navigation to all pages
        console.log('🧪 Testing navigation to all pages...');
        
        // Add a test function to verify all pages work
        window.testAllPages = function() {
            console.log('🔬 Testing navigation to all pages:');
            for (let i = 0; i < totalPages; i++) {
                setTimeout(() => {
                    console.log(`Testing page ${i}...`);
                    goToPage(i);
                }, i * 2000);
            }
        };
        
        // Add a direct navigation function for debugging
        window.goToPageDebug = function(pageNum) {
            console.log(`🎯 Manual navigation to page ${pageNum}`);
            goToPage(pageNum);
        };
        
        // Add a force navigation function that bypasses transition checks
        window.forceNavigateTo = function(pageNum) {
            console.log(`🚀 Force navigating to page ${pageNum}`);
            isTransitioning = false; // Reset transition flag
            if (pageNum >= 0 && pageNum < totalPages) {
                currentPage = pageNum;
                showPage(pageNum);
            }
        };
        
        // Add safety mechanism to reset stuck transitions
        setInterval(() => {
            if (isTransitioning) {
                console.warn('⚠️ Transition stuck, resetting...');
                isTransitioning = false;
            }
        }, 5000);
        
        console.log('💡 Debug commands available:');
        console.log('- testAllPages() - Test navigation to all pages');
        console.log('- goToPageDebug(n) - Navigate directly to page n');
        console.log('- forceNavigateTo(n) - Force navigate to page n');
        console.log('- Press keys 1-5 to navigate to pages 0-4');
        
        // Immediate test of problematic pages
        setTimeout(() => {
            console.log('🔍 Testing access to pages 3 and 4...');
            if (pages[3]) {
                console.log('✅ Page 3 element found:', pages[3]);
            } else {
                console.error('❌ Page 3 element not found!');
            }
            if (pages[4]) {
                console.log('✅ Page 4 element found:', pages[4]);
            } else {
                console.error('❌ Page 4 element not found!');
            }
        }, 1000);
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Menu functionality
        menuBtn.addEventListener('click', toggleMenu);
        closeMenu.addEventListener('click', closeMenuHandler);

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenuHandler();
            }
        });

        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = parseInt(this.getAttribute('data-page'));
                console.log('📋 Navigation menu link clicked, navigating to:', targetPage);
                goToPage(targetPage);
                closeMenuHandler();
            });
        });

        // Page dots
        pageDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const targetPage = parseInt(this.getAttribute('data-page'));
                console.log('🔘 Page dot clicked, navigating to:', targetPage);
                goToPage(targetPage);
            });
        });

        // Navigation arrows
        document.addEventListener('click', function(e) {
            if (e.target.closest('.nav-arrow.prev')) {
                console.log('⬅️ Previous arrow clicked, navigating to:', currentPage - 1);
                goToPage(currentPage - 1);
            } else if (e.target.closest('.nav-arrow.next')) {
                console.log('➡️ Next arrow clicked, navigating to:', currentPage + 1);
                goToPage(currentPage + 1);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Touch events for swipe gestures
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });

        // Mouse wheel for desktop
        document.addEventListener('wheel', handleWheel, { passive: false });

        // Prevent default scroll behavior
        document.body.addEventListener('touchmove', function(e) {
            if (!isScrolling) {
                e.preventDefault();
            }
        }, { passive: false });

        // Contact form submission
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Enhanced interaction sounds for mobile and desktop
        document.addEventListener('pointerdown', (e) => {
            // Don't play sound for text selection or input elements
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            playRandomTapSound();
        });

        // Enhanced hover sound on interactive elements
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.skill-item, .project-card, .social-link, .page-dot, .nav-arrow, .fact-card, .tech-tag')) {
                playSound(hoverSound, 0.2);
            }
        });

        // Add sound effects to specific interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.social-link')) {
                playSound(successSound, 0.4);
            } else if (e.target.closest('.project-link')) {
                playSound(whooshSound, 0.3);
            }
        });

        // Enable auto-play after first user interaction
        document.addEventListener('touchstart', enableSounds, { once: true, passive: true });
        document.addEventListener('click', enableSounds, { once: true });

        // Add visual ripple effects for better mobile feedback
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.page-dot, .nav-arrow, .skill-item, .fact-card')) {
                createRippleEffect(e.target.closest('.page-dot, .nav-arrow, .skill-item, .fact-card'), e.touches[0]);
            }
        }, { passive: true });
    }

    // Menu functions
    function toggleMenu() {
        navMenu.classList.toggle('active');
        menuBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            menuBtn.style.transform = 'scale(1)';
        }, 150);
    }

    function closeMenuHandler() {
        navMenu.classList.remove('active');
    }

    // Update arrow visibility
    function updateArrows() {
        const prevArrow = document.getElementById('prevArrow');
        const nextArrow = document.getElementById('nextArrow');
        
        if (prevArrow && nextArrow) {
            prevArrow.disabled = currentPage === 0;
            nextArrow.disabled = currentPage === totalPages - 1;
            
            prevArrow.style.opacity = currentPage === 0 ? '0.3' : '0.7';
            nextArrow.style.opacity = currentPage === totalPages - 1 ? '0.3' : '0.7';
        }
    }

    // Page navigation with enhanced animations
    function goToPage(pageIndex) {
        console.log(`🔍 goToPage called with pageIndex: ${pageIndex}`);
        console.log(`Current state - currentPage: ${currentPage}, totalPages: ${totalPages}, isTransitioning: ${isTransitioning}`);
        
        if (isTransitioning || pageIndex === currentPage || pageIndex < 0 || pageIndex >= totalPages) {
            console.log(`❌ Navigation blocked - isTransitioning: ${isTransitioning}, pageIndex === currentPage: ${pageIndex === currentPage}, pageIndex < 0: ${pageIndex < 0}, pageIndex >= totalPages: ${pageIndex >= totalPages}`);
            return;
        }

        console.log(`✅ Navigation allowed to page ${pageIndex}`);

        // Play enhanced transition sound effect
        playTransitionSound();

        isTransitioning = true;
        const direction = pageIndex > currentPage ? 1 : -1;
        const currentPageEl = pages[currentPage];
        const nextPageEl = pages[pageIndex];

        // Debug: Verify page elements exist
        console.log(`Current page element (${currentPage}):`, currentPageEl);
        console.log(`Next page element (${pageIndex}):`, nextPageEl);
        
        if (!currentPageEl || !nextPageEl) {
            console.error('❌ Page elements not found!');
            isTransitioning = false;
            return;
        }

        // Remove active class from current page
        currentPageEl.classList.remove('active');
        pageDots[currentPage].classList.remove('active');

        // Add beautiful transition effects
        currentPageEl.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        nextPageEl.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        if (direction > 0) {
            // Moving forward - page turn left
            currentPageEl.style.transform = 'translateX(-100%) rotateY(-35deg) scale(0.95)';
            currentPageEl.style.opacity = '0.5';
            nextPageEl.style.transform = 'translateX(100%) rotateY(35deg) scale(1.05)';
            nextPageEl.style.opacity = '0';
        } else {
            // Moving backward - page turn right
            currentPageEl.style.transform = 'translateX(100%) rotateY(35deg) scale(0.95)';
            currentPageEl.style.opacity = '0.5';
            nextPageEl.style.transform = 'translateX(-100%) rotateY(-35deg) scale(1.05)';
            nextPageEl.style.opacity = '0';
        }

        setTimeout(() => {
            // Animate next page into view
            nextPageEl.style.transform = 'translateX(0) rotateY(0deg) scale(1)';
            nextPageEl.style.opacity = '1';
            nextPageEl.classList.add('active');
            
            // Update current page
            currentPage = pageIndex;
            pageDots[currentPage].classList.add('active');

            // Clean up all pages
            pages.forEach((page, index) => {
                if (index !== currentPage) {
                    page.classList.remove('active', 'prev');
                    page.style.transform = index < currentPage ? 'translateX(-100%) scale(0.95)' : 'translateX(100%) scale(0.95)';
                    page.style.opacity = '0';
                }
            });

            // Update arrow visibility
            updateArrows();

            // Trigger page-specific animations
            setTimeout(() => animatePage(currentPage), 300);

            setTimeout(() => {
                isTransitioning = false;
                console.log(`✅ Navigation to page ${pageIndex} completed successfully`);
            }, 100);
        }, 100);
    }

    function showPage(pageIndex) {
        currentPage = pageIndex;

        // Hide all pages
        pages.forEach((page, index) => {
            page.classList.remove('active', 'prev');
            if (index === pageIndex) {
                page.classList.add('active');
                page.style.transform = 'translateX(0)';
            } else {
                page.style.transform = index < pageIndex ? 'translateX(-100%)' : 'translateX(100%)';
            }
        });

        // Update page dots
        pageDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === pageIndex);
        });

        // Update arrow visibility
        updateArrows();

        // Trigger page animations
        setTimeout(() => animatePage(pageIndex), 100);
    }

    // Keyboard navigation
    function handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                goToPage(currentPage - 1);
                break;
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                goToPage(currentPage + 1);
                break;
            case 'Home':
                e.preventDefault();
                goToPage(0);
                break;
            case 'End':
                e.preventDefault();
                goToPage(totalPages - 1);
                break;
            case 'Escape':
                e.preventDefault();
                closeMenuHandler();
                break;
            // Debug: Direct page navigation with number keys
            case '1':
                e.preventDefault();
                console.log('🔢 Key 1 pressed - navigating to page 0');
                goToPage(0);
                break;
            case '2':
                e.preventDefault();
                console.log('🔢 Key 2 pressed - navigating to page 1');
                goToPage(1);
                break;
            case '3':
                e.preventDefault();
                console.log('🔢 Key 3 pressed - navigating to page 2');
                goToPage(2);
                break;
            case '4':
                e.preventDefault();
                console.log('🔢 Key 4 pressed - navigating to page 3');
                goToPage(3);
                break;
            case '5':
                e.preventDefault();
                console.log('🔢 Key 5 pressed - navigating to page 4');
                goToPage(4);
                break;
        }
    }

    // Enhanced touch/swipe handlers for mobile
    function handleTouchStart(e) {
        if (e.touches.length > 1) return; // Ignore multi-touch
        
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        swipeStartTime = Date.now();
        touchStarted = true;
        isSwiping = false;
        isScrolling = false;

        // Check if we're in a scrollable content area
        const scrollableElements = [
            '.about-text', '.skills-container', '.project-content', 
            '.connect-content', '.facts-grid', '.projects-container'
        ];
        
        const isInScrollableArea = scrollableElements.some(selector => 
            e.target.closest(selector)
        );

        // Allow scrolling in content areas, but prioritize horizontal swipes for navigation
        if (isInScrollableArea && !e.target.closest('.nav-arrow') && 
            !e.target.closest('.page-dot') && !e.target.closest('.menu-btn')) {
            isScrolling = true;
        }

        // Always allow navigation on header, hero image, and navigation elements
        if (e.target.closest('.nav-arrow') || e.target.closest('.page-dot') || 
            e.target.closest('.menu-btn') || e.target.closest('.profile-section-top') ||
            e.target.closest('.welcome-content-bottom') || e.target.closest('.page-title')) {
            isScrolling = false;
        }

        // Add visual feedback for touch
        const target = e.target.closest('.page');
        if (target) {
            target.style.transition = 'transform 0.1s ease';
        }
    }

    function handleTouchMove(e) {
        if (!touchStarted || e.touches.length > 1) return;
        
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const deltaY = startY - currentY;
        const deltaX = startX - currentX;
        const absDeltaY = Math.abs(deltaY);
        const absDeltaX = Math.abs(deltaX);

        // Determine if this is a swipe gesture
        if (absDeltaX > 15 || absDeltaY > 15) {
            isSwiping = true;
        }

        // Handle horizontal swipes for navigation (prioritize over vertical scrolling)
        if (absDeltaX > absDeltaY && absDeltaX > 20) {
            e.preventDefault(); // Prevent page scroll
            isScrolling = false;
            
            // Visual feedback during swipe
            const target = e.target.closest('.page');
            if (target && absDeltaX > 30) {
                const progress = Math.min(absDeltaX / 100, 0.3);
                const direction = deltaX > 0 ? 1 : -1;
                target.style.transform = `translateX(${-direction * progress * 20}px) scale(${1 - progress * 0.1})`;
                target.style.opacity = 1 - progress * 0.2;
            }
            return;
        }

        // Allow vertical scrolling in content areas only if not swiping horizontally
        if (isScrolling && absDeltaY > absDeltaX && absDeltaY > 15) {
            return; // Allow normal scrolling
        }

        // Prevent default for navigation gestures
        if (absDeltaX > 10) {
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!touchStarted) return;
        
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - swipeStartTime;
        
        endY = e.changedTouches[0].clientY;
        endX = e.changedTouches[0].clientX;

        const deltaY = startY - endY;
        const deltaX = startX - endX;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Reset visual feedback
        const target = e.target.closest('.page');
        if (target) {
            target.style.transition = 'all 0.3s ease';
            target.style.transform = '';
            target.style.opacity = '';
        }

        // Handle swipe navigation
        if (!isScrolling && isSwiping && touchDuration < swipeTimeThreshold) {
            // Check for horizontal swipe
            if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY * 0.7) {
                e.preventDefault();
                
                // Play sound effect for swipe
                playRandomTapSound();
                
                // Determine swipe direction and navigate
                if (deltaX > 0 && absDeltaX > swipeThreshold) {
                    // Swipe left - next page
                    console.log('📱 Swipe left detected - next page');
                    goToPage(currentPage + 1);
                } else if (deltaX < 0 && absDeltaX > swipeThreshold) {
                    // Swipe right - previous page
                    console.log('📱 Swipe right detected - previous page');
                    goToPage(currentPage - 1);
                }
            }
        }

        // Handle tap/click
        if (!isSwiping && touchDuration < 200 && absDeltaX < 10 && absDeltaY < 10) {
            const currentTime = Date.now();
            
            // Check for double tap
            if (currentTime - lastTapTime < doubleTapThreshold) {
                console.log('📱 Double tap detected');
                // Double tap could toggle menu or fullscreen
                if (e.target.closest('.profile-image')) {
                    // Toggle fullscreen for profile image or some action
                    playSound(successSound, 0.4);
                }
            } else {
                // Single tap
                playRandomTapSound();
                
                // Handle tap on navigation elements
                if (e.target.closest('.nav-arrow') || e.target.closest('.page-dot')) {
                    // Navigation elements handle their own click events
                    return;
                }
            }
            
            lastTapTime = currentTime;
        }
        
        // Reset all state
        touchStarted = false;
        isSwiping = false;
        isScrolling = false;
        lastTouchTime = touchEndTime;
    }

    // Mouse wheel handler
    function handleWheel(e) {
        e.preventDefault();

        if (isTransitioning) return;

        const delta = e.deltaY;
        const threshold = 50;

        if (Math.abs(delta) > threshold) {
            if (delta > 0) {
                goToPage(currentPage + 1);
            } else {
                goToPage(currentPage - 1);
            }
        }
    }

    // Typing animation
    function typeWriter() {
        const typedTextElement = document.querySelector('.typed-text');
        if (!typedTextElement) return;

        const currentText = typingTexts[currentTextIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;

            if (currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
            }
        } else {
            typedTextElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;

            if (currentCharIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeWriter, 2000);
                return;
            }
        }

        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeWriter, typingSpeed);
    }

    // Enhanced page-specific animations with text effects
    function animatePage(pageIndex) {
        const page = pages[pageIndex];
        
        // Add staggered text animations to all text elements
        addTextAnimations(page);
        
        switch(pageIndex) {
            case 0: // Welcome page
                animateWelcomePage(page);
                break;
            case 1: // About page
                animateAboutPage(page);
                break;
            case 2: // Skills page
                animateSkillsPage(page);
                break;
            case 3: // Projects page
                animateProjectsPage(page);
                break;
            case 4: // Connect page
                animateConnectPage(page);
                break;
        }
    }

    function addTextAnimations(page) {
        // Animate headings and paragraphs with staggered timing
        const textElements = page.querySelectorAll('h1, h2, h3, h4, p, .fact-card, .skill-item, .project-card');
        
        textElements.forEach((element, index) => {
            // Reset element state
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            // Animate with staggered delay
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }

    function animateWelcomePage(page) {
        const profileImage = page.querySelector('.profile-image');
        const greeting = page.querySelector('.greeting');
        const name = page.querySelector('.name');
        const title = page.querySelector('.title');
        const swipeHint = page.querySelector('.swipe-hint');

        if (profileImage) {
            profileImage.style.opacity = '0';
            profileImage.style.transform = 'scale(0.8)';
            setTimeout(() => {
                profileImage.style.transition = 'all 0.8s ease';
                profileImage.style.opacity = '1';
                profileImage.style.transform = 'scale(1)';
            }, 200);
        }

        const elements = [greeting, name, title];
        elements.forEach((el, index) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    el.style.transition = 'all 0.6s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 400 + (index * 200));
            }
        });

        if (swipeHint) {
            swipeHint.style.opacity = '0';
            setTimeout(() => {
                swipeHint.style.transition = 'opacity 0.8s ease';
                swipeHint.style.opacity = '1';
            }, 1200);
        }
    }

    function animateAboutPage(page) {
        const title = page.querySelector('.page-title');
        const aboutText = page.querySelector('.about-text');
        const factCards = page.querySelectorAll('.fact-card');
        const motto = page.querySelector('.motto');

        if (title) {
            title.classList.add('fade-in');
        }

        if (aboutText) {
            setTimeout(() => {
                aboutText.classList.add('slide-up');
            }, 200);
        }

        factCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('scale-in');
            }, 400 + (index * 100));
        });

        if (motto) {
            setTimeout(() => {
                motto.classList.add('fade-in');
            }, 800);
        }
    }

    function animateSkillsPage(page) {
        const title = page.querySelector('.page-title');
        const skillCategories = page.querySelectorAll('.skill-category');

        if (title) {
            title.classList.add('fade-in');
        }

        skillCategories.forEach((category, index) => {
            setTimeout(() => {
                const skillItems = category.querySelectorAll('.skill-item');
                skillItems.forEach((item, itemIndex) => {
                    setTimeout(() => {
                        item.classList.add('scale-in');
                    }, itemIndex * 50);
                });
            }, 200 + (index * 300));
        });
    }

    function animateProjectsPage(page) {
        const title = page.querySelector('.page-title');
        const projectCards = page.querySelectorAll('.project-card');

        if (title) {
            title.classList.add('fade-in');
        }

        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('slide-up');
            }, 200 + (index * 150));
        });
    }

    function animateConnectPage(page) {
        const title = page.querySelector('.page-title');
        const connectIntro = page.querySelector('.connect-intro');
        const socialLinks = page.querySelectorAll('.social-link');
        const contactForm = page.querySelector('.contact-form');

        if (title) {
            title.classList.add('fade-in');
        }

        if (connectIntro) {
            setTimeout(() => {
                connectIntro.classList.add('slide-up');
            }, 200);
        }

        socialLinks.forEach((link, index) => {
            setTimeout(() => {
                link.classList.add('scale-in');
            }, 400 + (index * 100));
        });

        if (contactForm) {
            setTimeout(() => {
                contactForm.classList.add('slide-up');
            }, 800);
        }
    }

    // Contact form handler
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual implementation)
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                e.target.reset();
            }, 2000);
        }, 2000);
    }

    // Smooth scrolling for page content
    function smoothScrollTo(element, target, duration) {
        const start = element.scrollTop;
        const change = target - start;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            element.scrollTop = start + (change * ease);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fact-card, .skill-item, .project-card, .social-link');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Performance optimization
    function optimizePerformance() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Handle resize optimizations
                updateArrows();
            }, 250);
        });
    }

    // Initialize everything
    init();
    setupScrollAnimations();
    optimizePerformance();

    // Add some easter eggs for developers
    console.log('%c🎉 Welcome to Manoranjan\'s Portfolio! 🎉', 'color: #ffffff; font-size: 20px; font-weight: bold;');
    console.log('%cThanks for checking out the code! 💻', 'color: #cccccc; font-size: 14px;');
    console.log('%cBuilt with ❤️ using vanilla JavaScript, HTML5, and CSS3', 'color: #888888; font-size: 12px;');
});
