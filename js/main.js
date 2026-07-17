// ============================================
// SYSTÈME JAVASCRIPT MODERNE ARGPK - V2.0
// Architecture modulaire et performante
// ============================================

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const config = {
        mobileBreakpoint: 768,
        tabletBreakpoint: 1024,
        animationDelay: 100,
        scrollOffset: 100,
    };

    // ===== ÉLÉMENTS DOM =====
    const elements = {
        body: document.body,
        html: document.documentElement,
        mobileMenu: null,
        mobileMenuBackdrop: null,
        openMenuBtn: null,
        closeMenuBtn: null,
        backToTopBtn: null,
        navLinks: null,
        currentYear: null,
        mobileDropdown: null,
        mobileDropdownArrow: null,
        mobileDropdownMenu: null,
    };

    // ===== ÉTAT DE L'APPLICATION =====
    let state = {
        isMobileMenuOpen: false,
        lastScrollPosition: 0,
        isScrolling: false,
        scrollDirection: 'down',
    };

    // ===== INITIALISATION =====
    function init() {
        cacheElements();
        initMobileMenu();
        initScrollManager();
        initMobileDropdown();
        updateCurrentYear();
    }

    // ===== CACHE LES ÉLÉMENTS DOM =====
    function cacheElements() {
        elements.mobileMenu = document.querySelector('.mobile-menu');
        elements.mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
        elements.openMenuBtn = document.getElementById('open-menu');
        elements.closeMenuBtn = document.getElementById('close-menu');
        elements.backToTopBtn = document.getElementById('back-to-top');
        elements.navLinks = document.querySelectorAll('nav a');
        elements.currentYear = document.getElementById('current-year');
        elements.mobileDropdown = document.querySelector('.mobile-dropdown');
        elements.mobileDropdownArrow = document.getElementById('mobile-dropdown-arrow');
        elements.mobileDropdownMenu = document.getElementById('mobile-about-menu');
    }

    // ===== GESTION DU MENU MOBILE =====
    function initMobileMenu() {
        if (!elements.openMenuBtn || !elements.closeMenuBtn || !elements.mobileMenu) {
            console.warn('Éléments du menu mobile non trouvés');
            return;
        }

        // Ouvrir le menu
        elements.openMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openMobileMenu();
        });

        // Fermer le menu
        elements.closeMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });

        // Fermer le menu en cliquant sur le backdrop
        if (elements.mobileMenuBackdrop) {
            elements.mobileMenuBackdrop.addEventListener('click', function(e) {
                e.preventDefault();
                closeMobileMenu();
            });
        }

        // Fermer le menu en appuyant sur Escape
        document.addEventListener('keydown', function(e) {
            if (state.isMobileMenuOpen && e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Fermer le menu lors de la navigation sur un lien
        const mobileNavLinks = elements.mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (state.isMobileMenuOpen) {
                    closeMobileMenu();
                }
            });
        });

        // Ajouter classe active aux liens de navigation
        initMobileNavHighlights();
    }

    function initMobileNavHighlights() {
        const currentPath = window.location.pathname;
        const mobileNavLinks = elements.mobileMenu.querySelectorAll('.nav-link-mobile, .nav-link-mobile-sub');
        
        mobileNavLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            
            // Vérifier si le lien correspond à la page actuelle
            if (href && currentPath.endsWith(href)) {
                link.classList.add('active');
            }
        });
    }

    function openMobileMenu() {
        if (!elements.mobileMenu) return;
        
        elements.mobileMenu.classList.add('active');
        elements.mobileMenu.classList.remove('translate-x-full');
        elements.mobileMenu.style.right = '0';
        
        if (elements.mobileMenuBackdrop) {
            elements.mobileMenuBackdrop.classList.add('active');
            elements.mobileMenuBackdrop.style.opacity = '1';
            elements.mobileMenuBackdrop.style.visibility = 'visible';
        }
        
        elements.body.style.overflow = 'hidden';
        state.isMobileMenuOpen = true;
        
        if (elements.openMenuBtn) {
            elements.openMenuBtn.setAttribute('aria-expanded', 'true');
        }
    }

    function closeMobileMenu() {
        if (!elements.mobileMenu) return;
        
        elements.mobileMenu.classList.remove('active');
        elements.mobileMenu.classList.add('translate-x-full');
        elements.mobileMenu.style.right = '-100%';
        
        if (elements.mobileMenuBackdrop) {
            elements.mobileMenuBackdrop.classList.remove('active');
            elements.mobileMenuBackdrop.style.opacity = '';
            elements.mobileMenuBackdrop.style.visibility = '';
        }
        
        elements.body.style.overflow = '';
        state.isMobileMenuOpen = false;
        
        if (elements.openMenuBtn) {
            elements.openMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    function toggleMobileMenu() {
        if (state.isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // ===== GESTION DU MENU DÉRÉLANT MOBILE =====
    function initMobileDropdown() {
        if (!elements.mobileDropdown || !elements.mobileDropdownArrow || !elements.mobileDropdownMenu) {
            return;
        }

        const dropdownButton = elements.mobileDropdown.querySelector('button');
        if (!dropdownButton) return;

        dropdownButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileDropdown();
        });
    }

    function toggleMobileDropdown() {
        const isOpen = !elements.mobileDropdownMenu.classList.contains('hidden');
        
        if (isOpen) {
            elements.mobileDropdownMenu.classList.add('hidden');
            elements.mobileDropdownArrow.classList.remove('rotate-180');
        } else {
            elements.mobileDropdownMenu.classList.remove('hidden');
            elements.mobileDropdownArrow.classList.add('rotate-180');
        }
    }

    // ===== GESTION DU SCROLL =====
    function initScrollManager() {
        handleScroll();
        initBackToTop();
        initSmoothScroll();

        window.addEventListener('scroll', throttle(handleScroll, 100));
    }

    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Déterminer la direction du scroll
        state.scrollDirection = currentScroll > state.lastScrollPosition ? 'down' : 'up';
        state.lastScrollPosition = currentScroll <= 0 ? 0 : currentScroll;
        
        // Gérer l'affichage du bouton retour en haut
        toggleBackToTop(currentScroll);
        
        // Gérer l'en-tête sticky
        handleStickyHeader(currentScroll);
    }

    function initBackToTop() {
        if (!elements.backToTopBtn) return;
        
        elements.backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function toggleBackToTop(scrollPosition) {
        if (!elements.backToTopBtn) return;
        
        if (scrollPosition > 500) {
            elements.backToTopBtn.classList.add('visible');
            elements.backToTopBtn.style.opacity = '1';
            elements.backToTopBtn.style.transform = 'translateY(0)';
        } else {
            elements.backToTopBtn.classList.remove('visible');
            elements.backToTopBtn.style.opacity = '';
            elements.backToTopBtn.style.transform = '';
        }
    }

    function handleStickyHeader(scrollPosition) {
        const header = document.querySelector('header');
        if (!header) return;
        
        if (scrollPosition > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function initSmoothScroll() {
        // Navigation interne avec ancres
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignorer les liens vides ou vers d'autres pages
                if (href === '#' || href.includes('.html')) return;
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + 
                                          window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Fermer le menu mobile si ouvert
                    if (state.isMobileMenuOpen) {
                        closeMobileMenu();
                    }
                }
            });
        });
    }

    // ===== UTILITAIRES =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const args = arguments;
            const context = this;
            const later = function() {
                clearTimeout(timeout);
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() { inThrottle = false; }, limit);
            }
        };
    }

    function updateCurrentYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }
    }

    // ===== DÉMARRAGE =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();