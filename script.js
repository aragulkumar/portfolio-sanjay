document.addEventListener('DOMContentLoaded', () => {
    // 1. Cursor Trail
    const cursorTrail = document.getElementById('cursorTrail');
    
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            // Add a small lag for the trail effect using requestAnimationFrame
            requestAnimationFrame(() => {
                cursorTrail.style.left = e.clientX + 'px';
                cursorTrail.style.top = e.clientY + 'px';
            });
        });
    }

    // 2. Scroll Progress Bar & Navbar Shrink & Back to Top
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        // Scroll Progress
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';

        // Navbar Shrink
        if (scrollTop > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to Top Button
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // 3. Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Typewriter Effect
    const texts = [
        "AI & Data Science Student",
        "Machine Learning Enthusiast",
        "Data Analyst & Problem Solver"
    ];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');

    function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        typewriterElement.textContent = letter;

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2; // Delete faster
        }

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2500; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typewriter
    setTimeout(type, 1000);

    // 5. Particle Background Canvas
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray;

    // Set canvas to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // Particle class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseOpacity = Math.random() * 0.5 + 0.1;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.baseOpacity})`;
            ctx.fill();
        }

        // Update particle movement
        update() {
            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    // Create particle array
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = 25; // As per specification

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            
            // Random very slow movement
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            let color = '#00d4ff';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Animation loop
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    initParticles();
    animateParticles();

    // 6. Copy to Clipboard Functionality
    const copyBtn = document.getElementById('copy-email');
    const emailLink = document.getElementById('email-link');

    if (copyBtn && emailLink) {
        copyBtn.addEventListener('click', () => {
            const email = emailLink.textContent;
            navigator.clipboard.writeText(email).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // 7. Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
