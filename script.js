document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. CINEMATIC OPENING SEQUENCE
    // ==========================================
    const openingScreen = document.getElementById('opening-screen');
    const openingText1 = document.querySelector('.opening-text-1');
    const openingText2 = document.querySelector('.opening-text-2');
    const openingBtn = document.getElementById('btn-open-surprise');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    // ==========================================
    // FUNGSI PEMUTAR MUSIK OTOMATIS & HANDLER
    // ==========================================
    function playMusic() {
        if (!bgMusic) return;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (musicToggle) {
                    musicToggle.classList.add('playing');
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                }
            }).catch(e => {
                // Kebijakan browser modern memblokir audio sebelum interaksi pengguna
                console.log("Menunggu interaksi pertama untuk memulai audio:", e);
            });
        }
    }

    // Coba putar langsung saat halaman dibuka
    playMusic();

    // Jika diblokir oleh browser, putar segera pada sentuhan/klik pertama di layar
    function startAudioOnFirstTouch() {
        playMusic();
        document.removeEventListener('click', startAudioOnFirstTouch);
        document.removeEventListener('touchstart', startAudioOnFirstTouch);
        document.removeEventListener('keydown', startAudioOnFirstTouch);
    }
    document.addEventListener('click', startAudioOnFirstTouch);
    document.addEventListener('touchstart', startAudioOnFirstTouch);
    document.addEventListener('keydown', startAudioOnFirstTouch);

    // Staged text appearance timing
    setTimeout(() => {
        if (openingText1) openingText1.classList.add('show');
    }, 1200);

    setTimeout(() => {
        if (openingText2) openingText2.classList.add('show');
    }, 2800);

    setTimeout(() => {
        if (openingBtn) openingBtn.classList.add('show');
    }, 4200);

    // Open button click transition
    if (openingBtn) {
        openingBtn.addEventListener('click', () => {
            // Putar musik saat membuka kejutan
            playMusic();

            // Cinematic exit animation
            if (openingScreen) {
                openingScreen.classList.add('cinematic-exit');
            }

            // Burst initial petals for celebratory feel
            burstPetals(12);

            setTimeout(() => {
                if (openingScreen) openingScreen.classList.add('hidden');
                if (mainContent) {
                    mainContent.classList.remove('hidden');
                    void mainContent.offsetWidth; // Reflow
                }
                initCinematicScrollObserver();
            }, 1200);
        });
    }

    // ==========================================
    // 2. KONTROL MANUAL TOMBOL MUSIK
    // ==========================================
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Jangan ganggu trigger lain
            if (bgMusic.paused) {
                playMusic();
            } else {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            }
        });
    }

    // ==========================================
    // 3. SCRAPBOOK FULLSCREEN LIGHTBOX
    // ==========================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const scrapbookItems = document.querySelectorAll('.scrapbook-item');

    scrapbookItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && lightboxModal && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || "Memory photo";
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // ==========================================
    // 4. FLOATING PARTICLES: LIGHT DUST EMBERS
    // ==========================================
    function initLightDust() {
        const dustContainer = document.getElementById('dust-container');
        if (!dustContainer) return;

        function createDustParticle() {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const size = Math.random() * 3.5 + 1.5; // 1.5px - 5px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}%`;
            
            const duration = Math.random() * 8 + 7; // 7s - 15s
            particle.style.animationDuration = `${duration}s`;
            
            dustContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        }

        setInterval(createDustParticle, 400);

        for (let i = 0; i < 15; i++) {
            setTimeout(createDustParticle, i * 200);
        }
    }

    // ==========================================
    // 5. FALLING LILY PETALS
    // ==========================================
    function initFallingPetals() {
        const petalsContainer = document.getElementById('petals-container');
        if (!petalsContainer) return;

        function createPetal() {
            const petal = document.createElement('div');
            petal.className = 'falling-petal';
            petal.style.backgroundImage = "url('assets/lily-petal.png')";

            const width = Math.random() * 22 + 22; // 22px - 44px
            const height = width * 1.55;
            petal.style.width = `${width}px`;
            petal.style.height = `${height}px`;

            const left = Math.random() * 96 + 2;
            petal.style.left = `${left}%`;

            const duration = Math.random() * 6 + 7; // 7s - 13s
            petal.style.animation = `petalDrift ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

            if (Math.random() > 0.6) {
                petal.style.filter = `blur(${Math.random() * 1.5 + 0.5}px) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.8))`;
            }

            petalsContainer.appendChild(petal);

            setTimeout(() => {
                petal.remove();
            }, duration * 1000);
        }

        setInterval(createPetal, 850);
        for (let i = 0; i < 5; i++) {
            setTimeout(createPetal, i * 350);
        }
    }

    function burstPetals(count = 10) {
        const petalsContainer = document.getElementById('petals-container');
        if (!petalsContainer) return;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const petal = document.createElement('div');
                petal.className = 'falling-petal';
                petal.style.backgroundImage = "url('assets/lily-petal.png')";
                const width = Math.random() * 26 + 24;
                petal.style.width = `${width}px`;
                petal.style.height = `${width * 1.55}px`;
                petal.style.left = `${Math.random() * 90 + 5}%`;
                const duration = Math.random() * 4 + 5;
                petal.style.animation = `petalDrift ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
                petalsContainer.appendChild(petal);
                setTimeout(() => petal.remove(), duration * 1000);
            }, i * 120);
        }
    }

    // ==========================================
    // 6. SPARKLE PARTICLES
    // ==========================================
    function initSparkles() {
        const sparklesContainer = document.getElementById('sparkles-container');
        if (!sparklesContainer) return;

        function createSparkle() {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-star';
            
            const x = Math.random() * 96 + 2;
            const y = Math.random() * 96 + 2;
            sparkle.style.left = `${x}%`;
            sparkle.style.top = `${y}%`;

            const size = Math.random() * 4 + 3;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;

            const duration = Math.random() * 1.5 + 2;
            sparkle.style.animationDuration = `${duration}s`;

            sparklesContainer.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, duration * 1000);
        }

        setInterval(createSparkle, 600);
    }

    // ==========================================
    // 7. CINEMATIC SCROLL REVEAL & STAGED ENDING
    // ==========================================
    function initCinematicScrollObserver() {
        const reveals = document.querySelectorAll('.cinematic-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(r => observer.observe(r));

        // Staged ending observer
        const endingSection = document.getElementById('ending-section');
        if (endingSection) {
            const endingObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const risingLilies = endingSection.querySelectorAll('.rising-lily');
                        risingLilies.forEach((lily, idx) => {
                            setTimeout(() => {
                                lily.classList.add('active');
                            }, idx * 250);
                        });

                        const line1 = endingSection.querySelector('.ending-line-1');
                        const line2 = endingSection.querySelector('.ending-line-2');
                        const line3 = endingSection.querySelector('.ending-line-3');

                        setTimeout(() => { if (line1) line1.classList.add('active'); }, 600);
                        setTimeout(() => { if (line2) line2.classList.add('active'); }, 2000);
                        setTimeout(() => { if (line3) line3.classList.add('active'); }, 3400);
                        
                        endingObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });

            endingObserver.observe(endingSection);
        }
    }

    // Run ambient background particle systems immediately
    initLightDust();
    initFallingPetals();
    initSparkles();

});
