/* ===========================
   PARTICLE SYSTEM
   =========================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.06 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/* ===========================
   CUSTOM CURSOR
   =========================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
});

function animateFollower() {
    followerX += (cursorX - followerX) * 0.12;
    followerY += (cursorY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

/* ===========================
   TYPEWRITER
   =========================== */
const phrases = [
    "Energy Systems Enthusiast",
    "Machine Learning Explorer",
    "Data Science Learner",
    "IIT Bombay Undergrad"
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typeEl = document.getElementById('typewriter');

function typewrite() {
    const current = phrases[phraseIndex];
    if (deleting) {
        typeEl.textContent = current.substring(0, charIndex--);
    } else {
        typeEl.textContent = current.substring(0, charIndex++);
    }

    let speed = deleting ? 30 : 70;

    if (!deleting && charIndex > current.length) {
        speed = 2000;
        deleting = true;
    } else if (deleting && charIndex < 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
    }
    setTimeout(typewrite, speed);
}
setTimeout(typewrite, 1200);

/* ===========================
   NAVBAR SCROLL EFFECT
   =========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===========================
   SMOOTH SCROLL
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
        }
    });
});

/* ===========================
   SCROLL REVEAL
   =========================== */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger siblings
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            let delay = 0;
            siblings.forEach((sib) => {
                if (sib === entry.target) return;
            });
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Array.from(siblings).indexOf(entry.target) * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

/* ===========================
   ANIMATED COUNTERS
   =========================== */
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            const isInt = el.dataset.isInt === 'true';
            const duration = 2000;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const val = target * ease;

                if (isInt) {
                    el.textContent = Math.floor(val).toLocaleString();
                } else if (target < 1) {
                    el.textContent = val.toFixed(3);
                } else if (target < 100) {
                    el.textContent = val.toFixed(1);
                } else {
                    el.textContent = Math.floor(val).toLocaleString();
                }

                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* ===========================
   DRAG-TO-SCROLL PROJECTS
   =========================== */
const track = document.getElementById('project-track');
let isDown = false;
let startX;
let scrollLeft;

track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.parentElement.scrollLeft;
});

track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });

track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 2;
    track.parentElement.scrollLeft = scrollLeft - walk;
});

/* ===========================
   CONTACT MODAL
   =========================== */
const contactBtn = document.getElementById('contact-btn');
const modal = document.getElementById('contact-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const copyBtn = document.getElementById('copy-btn');
const emailText = document.getElementById('email-text');

contactBtn.addEventListener('click', () => modal.classList.add('active'));
modalClose.addEventListener('click', () => modal.classList.remove('active'));
modalBackdrop.addEventListener('click', () => modal.classList.remove('active'));

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText.textContent).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    });
});
