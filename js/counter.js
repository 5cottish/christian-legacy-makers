// js/counter.js - Statistics Counter Animation

class Counter {
    constructor(element, options = {}) {
        this.element = element;
        this.target = parseInt(element.getAttribute('data-count')) || 0;
        this.duration = options.duration || 2000;
        this.suffix = options.suffix || '';
        this.prefix = options.prefix || '';
        this.started = false;
    }
    
    start() {
        if (this.started) return;
        this.started = true;
        
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * this.target);
            
            this.element.textContent = this.prefix + current + this.suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.element.textContent = this.prefix + this.target + this.suffix;
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Initialize counters when they come into view
document.addEventListener('DOMContentLoaded', function() {
    const counters = [];
    
    document.querySelectorAll('[data-count]').forEach(el => {
        const counter = new Counter(el, {
            suffix: el.textContent.includes('+') ? '+' : ''
        });
        counters.push({ element: el, counter: counter });
    });
    
    // Use intersection observer to trigger counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterObj = counters.find(c => c.element === entry.target);
                if (counterObj) {
                    counterObj.counter.start();
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(({ element }) => observer.observe(element));
});