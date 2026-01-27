/**
 * main.js - Dra. Daniela Fajardo Web
 * Arquitectura modular para escalabilidad
 */

document.addEventListener('DOMContentLoaded', () => {
    initLocationSlider();
    initScrollSpy();
    initMobileMenu();
    initAnchorScroll();
    initServicesSlider();
    handleWhatsappSticky();
});

/**
 * Configuración del Carrusel de Sedes (Swiper.js)
 */
function initLocationSlider() {
    const swiper = new Swiper('.ubicacion-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            pauseOnMouseEnter: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // Esto permite que el usuario use el dedo en móvil
        breakpoints: {
            320: { allowTouchMove: true },
            768: { allowTouchMove: false }
        }
    });
}
/**
 * Lógica de Scroll Spy para el Navbar
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('header, section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id') || 'inicio';
                updateActiveNavLink(id, navLinks);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.tagName === 'HEADER') section.id = 'inicio';
        observer.observe(section);
    });
}

/**
 * Helper: Actualiza las clases visuales del menú
 */
function updateActiveNavLink(activeId, links) {
    const activeClass = ['text-brand-secondary', 'border-b-2', 'border-brand-secondary'];
    const inactiveClass = 'text-slate-600';

    links.forEach(link => {
        const href = link.getAttribute('href');
        const isCurrent = (href === `#${activeId}`) || (activeId === 'inicio' && href === '#');

        if (isCurrent) {
            link.classList.add(...activeClass);
            link.classList.remove(inactiveClass);
        } else {
            link.classList.remove(...activeClass);
            link.classList.add(inactiveClass);
        }
    });
}

/**
 * Asegura que al hacer click en un enlace de ancla la sección quede pegada
 * al tope de la pantalla teniendo en cuenta la altura del `nav` (útil en móvil).
 */
function initAnchorScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    const nav = document.querySelector('nav');

    if (!anchors || anchors.length === 0) return;

    anchors.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            // Evita el salto por defecto del anchor
            e.preventDefault();

            // Calcula la posición objetivo restando la altura del header
            const headerHeight = nav ? nav.offsetHeight : 0;

            // Si se quiere un pequeño espacio adicional, ajustar aquí
            const extraGap = 8; // px

            const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraGap;

            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

            // Actualiza la URL sin provocar el salto instantáneo
            history.pushState(null, '', href);
        });
    });
}

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    const iconPath = document.getElementById('menu-icon');
    const links = document.querySelectorAll('.nav-link-mobile');
    // Seleccionamos específicamente las secciones por ID
    const sections = document.querySelectorAll('#inicio, #servicios, #ubicacion, #sobre-mi');

    if (!btn || !menu || !iconPath) return;

    const burgerPath = "M4 6h16M4 12h16M4 18h16";
    const xPath = "M6 18L18 6M6 6l12 12";
    let isMenuChanging = false;

    const toggleMenu = (show) => {
        isMenuChanging = true;
        if (show) {
            menu.classList.remove('max-h-0', 'opacity-0', 'invisible');
            menu.classList.add('max-h-[500px]', 'opacity-100', 'visible');
            iconPath.setAttribute('d', xPath);
        } else {
            menu.classList.add('max-h-0', 'opacity-0', 'invisible');
            menu.classList.remove('max-h-[500px]', 'opacity-100', 'visible');
            iconPath.setAttribute('d', burgerPath);
        }
        setTimeout(() => { isMenuChanging = false; }, 500);
    };

    // --- LÓGICA DE RESALTADO ULTRA-SENSIBLE ---
    const observerOptions = {
        root: null,
        // Bajamos el umbral al 10%. Con que asome un poco la sección, ya la detecta.
        threshold: 0.1,
        // Creamos una "zona de captura" estrecha en el centro de la pantalla
        rootMargin: "-40% 0px -40% 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');

                links.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');

                    if (href === activeId) {
                        link.classList.add('text-brand-primary', 'font-bold');
                        link.classList.remove('text-slate-600');
                    } else {
                        link.classList.remove('text-brand-primary', 'font-bold');
                        link.classList.add('text-slate-600');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Eventos de click y scroll (Se mantienen igual)
    btn.addEventListener('click', () => toggleMenu(menu.classList.contains('invisible')));
    links.forEach(link => link.addEventListener('click', () => toggleMenu(false)));


    window.addEventListener('scroll', () => {
        if (!menu.classList.contains('invisible') && !isMenuChanging) {
            toggleMenu(false);
        }
    }, { passive: true });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target) && !isMenuChanging) {
            toggleMenu(false);
        }
    });

    links.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
}

// Añade esto a tu initServicesSlider en main.js
function initServicesSlider() {
    const sliderSelector = '.servicios-swiper';
    if (!document.querySelector(sliderSelector)) return;

    const swiper = new Swiper(sliderSelector, {
        loop: true,
        spaceBetween: 30,
        speed: 1000,
        autoplay: {
            delay: 5000, // Cambia cada 5 segundos
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // Se detiene al poner el mouse encima (PC)
        },
        navigation: {
            nextEl: '.swiper-button-next-servicios',
            prevEl: '.swiper-button-prev-servicios',
        },
        pagination: {
            el: '.swiper-pagination-servicios',
            clickable: true,
        },
        // Lógica de Movimiento
        breakpoints: {
            // Móvil
            320: {
                allowTouchMove: true, // Permite mover con los dedos
            },
            // Escritorio
            768: {
                allowTouchMove: false, // Bloquea arrastre con mouse para usar flechas
            }
        }
    });
}

function handleWhatsappSticky() {
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const footer = document.querySelector('footer');

    if (!whatsappBtn || !footer) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si el footer es visible, calculamos cuánto espacio ocupa
                window.addEventListener('scroll', updatePosition);
            } else {
                // Si el footer no es visible, volvemos a la posición original
                window.removeEventListener('scroll', updatePosition);
                whatsappBtn.style.bottom = '40px'; // 40px es el bottom-10 de Tailwind
            }
        });
    }, { threshold: 0 });

    function updatePosition() {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Si el tope del footer es menor que la altura de la pantalla
        if (footerRect.top < viewportHeight) {
            const overlap = viewportHeight - footerRect.top;
            // Empujamos el botón: 40px iniciales + el tamaño del footer visible
            whatsappBtn.style.bottom = (40 + overlap) + 'px';
        } else {
            whatsappBtn.style.bottom = '40px';
        }
    }

    observer.observe(footer);
}
