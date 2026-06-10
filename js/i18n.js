// Internationalization System (i18n)

let currentLanguage = localStorage.getItem('language') || 'en';
let translations = {};
let translationsLoaded = false;

// Load translations
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        translations = await response.json();
        translationsLoaded = true;
        setLanguage(currentLanguage);
    } catch (error) {
        console.error('Error loading translations:', error);
        translationsLoaded = false;
    }
}

// Set language
function setLanguage(lang) {
    if (!translationsLoaded) {
        console.warn('Translations not loaded yet');
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = getTranslation(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
    
    // Update language button active state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Reload gallery to update product text
    if (typeof loadProducts === 'function') {
        loadProducts();
    }
}

// Get translation by key (supports nested keys like "nav.gallery")
function getTranslation(key) {
    if (!translationsLoaded) {
        return key;
    }
    
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    return value || key;
}

// Language button listeners
window.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
    
    // Wait a bit for translations to load
    setTimeout(() => {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                setLanguage(lang);
            });
        });
    }, 100);
});

// Also load translations immediately if DOM is already ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTranslations);
} else {
    loadTranslations();
}
