// Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Phone Number for SMS
const PHONE_NUMBER = '+1-502-322-5761';

// Load Products
async function loadProducts() {
    try {
        // Wait for translations to load
        if (!translationsLoaded) {
            await new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    if (translationsLoaded) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50);
                setTimeout(() => clearInterval(checkInterval), 5000); // Timeout after 5s
            });
        }
        
        const response = await fetch('products.json');
        const products = await response.json();
        renderGallery(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('galleryGrid').innerHTML = '<p>Error loading gallery</p>';
    }
}

function renderGallery(products) {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const statusClass = product.status === 'sold' ? 'sold' : 'available';
        const statusText = product.status === 'sold' 
            ? getTranslation('product.sold')
            : getTranslation('product.available');

        const buttonText = getTranslation('product.interested_btn');

        card.innerHTML = `
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-card-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-status ${statusClass}">${statusText}</p>
                <button class="product-btn" data-product-id="${product.id}" data-product-name="${product.name}">
                    ${buttonText}
                </button>
            </div>
        `;

        const btn = card.querySelector('.product-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(product);
        });

        galleryGrid.appendChild(card);
    });
}

// Modal Functions
const modal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const modalImage = document.getElementById('modalImage');

function openModal(product) {
    const statusClass = product.status === 'sold' ? 'sold' : 'available';
    const statusText = product.status === 'sold' 
        ? getTranslation('product.sold')
        : getTranslation('product.available');
    
    const interestedText = getTranslation('modal.inquiry_title') || 'Inquiry about';
    const emailBtnText = getTranslation('contact.send_email') || 'Send Email';
    const whatsappBtnText = getTranslation('contact.whatsapp_btn') || 'Contact via WhatsApp';
    const messagePrefix = getTranslation('modal.message_prefix') || 'I am interested in';
    
    // Set image
    modalImage.src = product.image;
    modalImage.alt = product.name;
    
    // Create message for email and SMS
    const emailMessage = `${messagePrefix}\n\n"${product.name}"\n\nPlease provide more information about this piece.`;
    const smsMessage = `${messagePrefix} "${product.name}"`;
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">
                <h2>${product.name}</h2>
            </div>
            <span class="modal-status ${statusClass}">${statusText}</span>
        </div>
        
        <p class="modal-description">${product.description}</p>
        
        <div class="modal-divider"></div>
        
        <p class="modal-contact-title">${interestedText} "${product.name}"?</p>
        
        <div class="modal-buttons">
            <a href="mailto:inasnakao@hotmail.com?subject=Inquiry: ${encodeURIComponent(product.name)}&body=${encodeURIComponent(emailMessage)}" class="modal-btn modal-btn-primary">
                <span>📧</span> ${emailBtnText || 'Send Email'}
            </a>
            <a href="sms:${PHONE_NUMBER}?body=${encodeURIComponent(smsMessage)}" class="modal-btn modal-btn-secondary">
                <span>💬</span> ${getTranslation('modal.sms_btn') || 'Send via SMS'}
            </a>
        </div>
    `;
    
    modal.classList.add('active');
}

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.classList.remove('active');
    }
});

// Contact Form
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Create mailto link
    const mailtoLink = `mailto:inasnakao@hotmail.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    window.location.href = mailtoLink;
    
    // Reset form
    contactForm.reset();
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe gallery items when they load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Observe section headers
    document.querySelectorAll('.section-header').forEach(el => {
        observer.observe(el);
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
