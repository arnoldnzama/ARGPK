// Configuration Tailwind
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#003366',
                secondary: '#FFCC00'
            },
            borderRadius: {
                'none': '0px',
                'sm': '4px',
                DEFAULT: '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '20px',
                '2xl': '24px',
                '3xl': '32px',
                'full': '9999px',
                'button': '8px'
            }
        }
    }
};

// Fonction pour gérer le menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const openMenuBtn = document.getElementById('open-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    openMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
            mobileMenu.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    });
    
    closeMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
        document.body.style.overflow = '';
    });
});

// Gestion du bouton retour en haut
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.add('opacity-0', 'invisible');
            backToTopButton.classList.remove('opacity-100', 'visible');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});