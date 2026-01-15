// js/main.js - Enhanced with animations and mobile menu
const auth = {
    login: (username, password) => {
        if((username === 'student' && password === 'student123') || (username === 'admin' && password === 'admin123')){
            sessionStorage.setItem('univ_user', username);
            return true;
        }
        return false;
    },
    
    logout: () => {
        sessionStorage.removeItem('univ_user');
        window.location.href = 'index.html';
    },
    
    currentUser: () => sessionStorage.getItem('univ_user')
};

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.navlinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Parallax effect for hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Animate stats counter
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 20);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Protect dashboard
    if(path === 'dashboard.html') {
        if(!auth.currentUser()) {
            window.location.href = 'login.html?redirect=dashboard.html';
        } else {
            const nameEl = document.getElementById('welcomeName');
            if(nameEl) nameEl.textContent = auth.currentUser();
        }
    }
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if(loginForm){
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value.trim();
            const p = document.getElementById('password').value.trim();
            if(auth.login(u,p)){
                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect') || 'dashboard.html';
                // Add loading animation
                const btn = loginForm.querySelector('.btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
                btn.disabled = true;
                
                setTimeout(() => {
                    window.location.href = redirect;
                }, 1000);
            } else {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert';
                alertDiv.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Invalid credentials. Try student/student123 or admin/admin123</span>
                    <button class="alert-close"><i class="fas fa-times"></i></button>
                `;
                alertDiv.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #ef4444;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: slideInRight 0.3s ease;
                    z-index: 10000;
                `;
                
                document.body.appendChild(alertDiv);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    alertDiv.style.animation = 'slideInRight 0.3s ease reverse';
                    setTimeout(() => alertDiv.remove(), 300);
                }, 5000);
                
                // Close button
                alertDiv.querySelector('.alert-close').addEventListener('click', () => {
                    alertDiv.remove();
                });
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
    });
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if(contactForm){
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cname').value.trim();
            const email = document.getElementById('cemail').value.trim();
            const msg = document.getElementById('cmessage').value.trim();
            
            if(!name || !email || !msg){ 
                alert('Please fill all fields'); 
                return; 
            }
            
            // Add sending animation
            const btn = contactForm.querySelector('.btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            
            setTimeout(() => {
                const subj = encodeURIComponent('Website Contact from ' + name);
                const body = encodeURIComponent('Message:\\n' + msg + '\n\\nContact email: ' + email);
                window.location.href = `mailto:info@university.edu?subject=${subj}&body=${body}`;
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});