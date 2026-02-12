/**
 * NovaSight Solutions - Main JavaScript File
 * Author: Sadeek Khan
 * Version: 1.0
 */

// ============================================
// 1. BUSINESS DATA - DEFAULT VALUES
// ============================================
let businessData = {
    business: {
        name: "NovaSight Solutions",
        owner: "Sadeek Khan",
        address: "Karani Mandir Lane, Ward No. 60, Sureshiya, Hanumangarh Junction, Rajasthan -335512",
        mobile: "+91 77105 25823",
        email: "novasightsolutionsindia@gmail.com",
        latitude: "29.6345765",
        longitude: "74.2944615",
        established: "2018"
    },
    stats: {
        rating: "4.9",
        reviews: "350",
        cameras: "1500",
        clients: "220",
        happy_households: "520",
        business_clients: "180"
    },
    services: [
        {
            id: 1,
            icon: "fa-camera-retro",
            title: "CCTV Systems",
            description: "HD, IP, PTZ, and thermal cameras. Tailored for home & business. Night vision & remote access."
        },
        {
            id: 2,
            icon: "fa-bell",
            title: "Alarm & Sensors",
            description: "Intrusion detection, motion sensors, glass break alarms, monitored response."
        },
        {
            id: 3,
            icon: "fa-lock",
            title: "Access Control",
            description: "Biometric, RFID, smart locks & gate automation. Total entry management."
        },
        {
            id: 4,
            icon: "fa-wifi",
            title: "Smart Security",
            description: "Video doorbells, remote monitoring, mobile alerts & cloud storage."
        }
    ],
    customers: [
        { id: 1, name: "Hanumangarh Junction Mall", type: "Business", rating: "5.0" },
        { id: 2, name: "Sureshiya Hospital", type: "Healthcare", rating: "4.9" },
        { id: 3, name: "Karani Mandir Trust", type: "Trust", rating: "5.0" },
        { id: 4, name: "Ward No.60 Co-op", type: "Cooperative", rating: "4.8" },
        { id: 5, name: "Nova Jewellers", type: "Retail", rating: "5.0" },
        { id: 6, name: "R.S. Gas & Agro", type: "Agriculture", rating: "4.9" }
    ],
    testimonial: "Fast installation, crystal clear footage, and polite staff – Sadeek bhai is very professional.",
    about: {
        description1: "Founded by Sadeek Khan, we've been securing Hanumangarh since 2018.",
        description2: "NovaSight Solutions delivers high-end security integration – from single CCTV setup to complete building automation. We believe in proactive service and transparent pricing. Every installation comes with warranty and lifetime support guidance."
    }
};

// ============================================
// 2. LOAD BUSINESS DATA FROM LOCALSTORAGE
// ============================================
function loadBusinessData() {
    try {
        // Try to load from localStorage first
        const savedData = localStorage.getItem('novasight_business');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            businessData = { ...businessData, ...parsedData };
            console.log('Business data loaded from localStorage');
        }
        
        // Try to load services from localStorage
        const savedServices = localStorage.getItem('novasight_services');
        if (savedServices) {
            businessData.services = JSON.parse(savedServices);
        }
        
        // Try to load customers from localStorage
        const savedCustomers = localStorage.getItem('novasight_customers');
        if (savedCustomers) {
            businessData.customers = JSON.parse(savedCustomers);
        }
        
        // Try to load testimonial from localStorage
        const savedTestimonial = localStorage.getItem('novasight_testimonial');
        if (savedTestimonial) {
            businessData.testimonial = savedTestimonial;
        }
    } catch (error) {
        console.error('Error loading business data:', error);
    }
    
    // Render all sections
    renderAllSections();
}

// ============================================
// 3. RENDER ALL SECTIONS
// ============================================
function renderAllSections() {
    renderHeroSection();
    renderServices();
    renderStats();
    renderCustomers();
    renderAbout();
    renderContact();
    renderFooter();
}

// ============================================
// 4. RENDER HERO SECTION
// ============================================
function renderHeroSection() {
    // Rating Badge
    const ratingBadge = document.getElementById('rating-badge');
    if (ratingBadge) {
        ratingBadge.innerHTML = `
            <span class="stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
            </span>
            <span style="font-weight:600; color:var(--primary);">
                ${businessData.stats.rating} ★ (${businessData.stats.reviews}+ reviews)
            </span>
        `;
    }
    
    // Hero Description
    const heroDescription = document.getElementById('hero-description');
    if (heroDescription) {
        heroDescription.textContent = `End-to-end CCTV, alarm systems & smart security solutions. Rated #1 in Hanumangarh Junction for rapid installation and 24/7 support.`;
    }
    
    // Mini Stats
    const miniStats = document.getElementById('mini-stats');
    if (miniStats) {
        miniStats.innerHTML = `
            <span>
                <i class="fas fa-shield-alt"></i> 
                ${businessData.stats.cameras}+ cameras installed
            </span>
            <span>
                <i class="fas fa-building"></i> 
                ${businessData.stats.clients}+ clients
            </span>
        `;
    }
}

// ============================================
// 5. RENDER SERVICES
// ============================================
function renderServices() {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;
    
    let html = '';
    
    businessData.services.forEach(service => {
        html += `
            <div class="service-card">
                <i class="fas ${service.icon} service-icon"></i>
                <h3>${escapeHtml(service.title)}</h3>
                <p>${escapeHtml(service.description)}</p>
            </div>
        `;
    });
    
    servicesContainer.innerHTML = html;
}

// ============================================
// 6. RENDER STATS
// ============================================
function renderStats() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
        <div class="stats-flex">
            <div class="stat-item">
                <h2>${businessData.stats.happy_households}+</h2>
                <p>Happy Households</p>
            </div>
            <div class="stat-item">
                <h2>${businessData.stats.business_clients}+</h2>
                <p>Business Clients</p>
            </div>
            <div class="stat-item">
                <h2>24/7</h2>
                <p>Support Active</p>
            </div>
            <div class="stat-item">
                <h2>${businessData.stats.rating}★</h2>
                <p>Google Rating</p>
            </div>
        </div>
    `;
}

// ============================================
// 7. RENDER CUSTOMERS
// ============================================
function renderCustomers() {
    const customersContainer = document.getElementById('customers-container');
    if (!customersContainer) return;
    
    let html = '';
    
    businessData.customers.forEach(customer => {
        html += `
            <span class="customer-item">
                <i class="fa-regular fa-circle-check"></i> 
                ${escapeHtml(customer.name)}
            </span>
        `;
    });
    
    customersContainer.innerHTML = html;
    
    // Testimonial
    const testimonial = document.getElementById('testimonial');
    if (testimonial) {
        testimonial.innerHTML = `
            ⭐ ⭐ ⭐ ⭐ ⭐ "${escapeHtml(businessData.testimonial)}" — 50+ more reviews
        `;
    }
}

// ============================================
// 8. RENDER ABOUT SECTION
// ============================================
function renderAbout() {
    // About Description 1
    const desc1 = document.getElementById('about-description1');
    if (desc1) {
        desc1.innerHTML = `<strong>${escapeHtml(businessData.about.description1)}</strong>`;
    }
    
    // About Description 2
    const desc2 = document.getElementById('about-description2');
    if (desc2) {
        desc2.textContent = businessData.about.description2;
    }
    
    // Owner Card
    const ownerCard = document.getElementById('owner-card');
    if (ownerCard) {
        ownerCard.innerHTML = `
            <i class="fas fa-user-shield"></i>
            <h3>${escapeHtml(businessData.business.owner)}</h3>
            <p>Proprietor & Security Consultant</p>
            <p class="owner-contact">
                <i class="fas fa-phone-alt"></i> 
                ${escapeHtml(businessData.business.mobile)} (Quick Response)
            </p>
        `;
    }
}

// ============================================
// 9. RENDER CONTACT INFO
// ============================================
function renderContact() {
    const contactInfo = document.getElementById('contact-info');
    if (!contactInfo) return;
    
    contactInfo.innerHTML = `
        <div class="info-item">
            <i class="fas fa-map-pin"></i>
            <div>
                <strong>${escapeHtml(businessData.business.name)}</strong><br>
                ${escapeHtml(businessData.business.address)}
            </div>
        </div>
        <div class="info-item">
            <i class="fas fa-mobile-alt"></i>
            <div>
                <strong>${escapeHtml(businessData.business.mobile)}</strong><br>
                (Sadeek Khan - Quick Response)
            </div>
        </div>
        <div class="info-item">
            <i class="fas fa-envelope"></i>
            <div>
                <strong>${escapeHtml(businessData.business.email)}</strong>
            </div>
        </div>
        <div class="info-item">
            <i class="fas fa-clock"></i>
            <div>
                <strong>Mon-Sat:</strong> 9:00 AM – 8:00 PM<br>
                <strong>Sunday:</strong> Emergency Only
            </div>
        </div>
    `;
    
    // Coordinates Text
    const coordinatesText = document.getElementById('coordinates-text');
    if (coordinatesText) {
        coordinatesText.textContent = `${businessData.business.latitude}, ${businessData.business.longitude} – Karani Mandir Lane (Exact Location)`;
    }
}

// ============================================
// 10. RENDER FOOTER
// ============================================
function renderFooter() {
    const copyright = document.getElementById('copyright');
    if (copyright) {
        copyright.textContent = `© ${new Date().getFullYear()} – Security you can rely. ${businessData.business.owner}, Hanumangarh Junction. All rights reserved.`;
    }
}

// ============================================
// 11. ESCAPE HTML TO PREVENT XSS
// ============================================
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================
// 12. MOBILE NAVIGATION
// ============================================
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('main-nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close nav when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileToggle.contains(event.target)) {
                nav.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
}

// ============================================
// 13. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#!' && href !== '#booking-form') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile nav after click
                    const nav = document.getElementById('main-nav');
                    const mobileToggle = document.getElementById('mobile-toggle');
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        const icon = mobileToggle.querySelector('i');
                        if (icon) {
                            icon.className = 'fas fa-bars';
                        }
                    }
                }
            }
        });
    });
}

// ============================================
// 14. ACTIVE NAVIGATION HIGHLIGHT
// ============================================
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    
    function setActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('load', setActiveLink);
}

// ============================================
// 15. INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Load all business data
    loadBusinessData();
    
    // Initialize navigation
    initMobileNav();
    initSmoothScroll();
    initActiveNav();
    
    console.log('NovaSight Solutions website initialized successfully!');

});



