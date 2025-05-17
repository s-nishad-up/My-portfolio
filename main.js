// Loading Animation
document.addEventListener('DOMContentLoaded', function() {
    // Loading animation
    const letters = document.querySelectorAll('.loading-letter');
    letters.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.1}s`;
    });
    
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 2000);
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Header Scroll Effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const scrollTopBtn = document.querySelector('.scroll-top');
        
        header.classList.toggle('scrolled', window.scrollY > 50);
        scrollTopBtn.classList.toggle('active', window.scrollY > 300);
    });

    // Scroll to Top
    document.querySelector('.scroll-top').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Floating Elements
    function createFloatingElements() {
        const container = document.querySelector('.floating-hearts');
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (Math.random() * 10 + 5) + 's';
            heart.style.animationDelay = (Math.random() * 5) + 's';
            container.appendChild(heart);
        }

        const binaryContainer = document.querySelector('.binary-rain');
        for (let i = 0; i < 100; i++) {
            const binary = document.createElement('div');
            binary.classList.add('binary-digit');
            binary.textContent = Math.random() > 0.5 ? '1' : '0';
            binary.style.left = Math.random() * 100 + 'vw';
            binary.style.animationDuration = (Math.random() * 5 + 5) + 's';
            binary.style.animationDelay = (Math.random() * 5) + 's';
            binary.style.fontSize = (Math.random() * 10 + 12) + 'px';
            binaryContainer.appendChild(binary);
        }
    }
    createFloatingElements();

    // Animate elements when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                } else if (entry.target.id === 'projects') {
                    animateProjectCards();
                    setupProjectSlider();
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Mobile Project Slider
    function setupProjectSlider() {
        const projectsContainer = document.querySelector('.projects-grid');
        const projectCards = document.querySelectorAll('.project-card');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (!projectsContainer || !projectCards.length) return;
        
        let currentIndex = 0;
        const cardWidth = projectCards[0].offsetWidth + 30;
        
        function updateSlider() {
            projectsContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            if (prevBtn && nextBtn) {
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= projectCards.length - 1;
            }
        }
        
        if (window.innerWidth <= 768) {
            projectsContainer.style.display = 'flex';
            projectsContainer.style.transition = 'transform 0.5s ease';
            projectsContainer.style.overflowX = 'auto';
            projectsContainer.style.scrollSnapType = 'x mandatory';
            
            let slideInterval = setInterval(() => {
                currentIndex = currentIndex < projectCards.length - 1 ? currentIndex + 1 : 0;
                updateSlider();
            }, 3000);

            if (prevBtn && nextBtn) {
                const resetInterval = () => {
                    clearInterval(slideInterval);
                    slideInterval = setInterval(() => {
                        currentIndex = currentIndex < projectCards.length - 1 ? currentIndex + 1 : 0;
                        updateSlider();
                    }, 3000);
                };
                
                prevBtn.addEventListener('click', () => {
                    if (currentIndex > 0) currentIndex--;
                    updateSlider();
                    resetInterval();
                });
                
                nextBtn.addEventListener('click', () => {
                    if (currentIndex < projectCards.length - 1) currentIndex++;
                    updateSlider();
                    resetInterval();
                });
            }
            
            updateSlider();
        }
    }

    // Web3Forms Submission with Error Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const form = this;
            const submitBtn = form.querySelector('button[type="submit"]');
            const resultDiv = document.getElementById('formResult');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>SENDING...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = 'Please wait...';
            resultDiv.className = 'form-response';
            
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                const json = await response.json();
                
                if (response.status === 200) {
                    resultDiv.innerHTML = 'Form submitted successfully! Redirecting...';
                    resultDiv.className = 'form-response success-message';
                    setTimeout(() => {
                        window.location.href = 'thankyou.html';
                    }, 1500);
                } else {
                    throw new Error(json.message || 'Form submission failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                resultDiv.innerHTML = `
                    <strong>Error sending message:</strong> ${error.message}<br><br>
                    Please try again or contact me directly via:<br>
                    <div class="error-contact-options">
                        <a href="mailto:sn198nishad@gmail.com" class="error-contact-link">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                        <a href="https://wa.me/918726370198" class="error-contact-link whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                `;
                resultDiv.className = 'form-response error-message';
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const projectsContainer = document.querySelector('.projects-grid');
        if (projectsContainer) {
            if (window.innerWidth > 768) {
                projectsContainer.style.transform = 'none';
                projectsContainer.style.display = 'grid';
            } else {
                setupProjectSlider();
            }
        }
    });

    // Helper functions
    function animateSkillBars() {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.width = bar.getAttribute('data-level') + '%';
        });
    }

    function animateProjectCards() {
        document.querySelectorAll('.project-card').forEach((card, index) => {
            setTimeout(() => card.classList.add('show'), index * 200);
        });
    }
});