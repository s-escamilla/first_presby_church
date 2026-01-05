// Hero Scroll Navigation
document.addEventListener('DOMContentLoaded', function() {
    const scrollNav = document.querySelector('.hero-scroll-nav');
    
    if (!scrollNav) return;
    
    const navItems = scrollNav.querySelectorAll('.scroll-nav-item');
    
    // Smooth scroll to sections
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = scrollNav.offsetHeight;
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const offset = navHeight + headerHeight;
                
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active state on scroll
    function updateActiveNav() {
        const scrollNav = document.querySelector('.hero-scroll-nav');
        if (!scrollNav) return;
        
        const navHeight = scrollNav.offsetHeight;
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const offset = navHeight + headerHeight + 100;
        
        const sections = document.querySelectorAll('[id^="section-"]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= (sectionTop - offset)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + currentSection) {
                item.classList.add('active');
            }
        });
    }
    
    // Throttle scroll event
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(updateActiveNav);
    });
    
    // Initial check
    updateActiveNav();
});
