const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');
const lightbox = document.getElementById('imageLightbox');
const expandedImage = document.getElementById('imagenAmpliada');
const statsSection = document.querySelector('.stats');
const animationDuration = 4500;

if (window.AOS) {
    AOS.init({ duration: 900, once: true });
}

function closeMenu() {
    hamburgerBtn?.classList.remove('active');
    mainNav?.classList.remove('open');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function openLightbox(imgElement) {
    if (!lightbox || !expandedImage || !imgElement) return;

    lightbox.style.display = 'block';
    expandedImage.src = imgElement.currentSrc || imgElement.src;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox || !expandedImage) return;

    lightbox.style.display = 'none';
    expandedImage.src = '';
    document.body.style.overflow = '';
}

function animateCounters() {
    document.querySelectorAll('.number').forEach((counter) => {
        const target = Number(counter.dataset.target || 0);

        counter.innerText = '0';

        if (!target) return;

        const delay = Math.max(animationDuration / target, 10);

        function updateCount() {
            const current = Number(counter.innerText.replace('+', ''));

            if (current < target) {
                counter.innerText = Math.ceil(current + 1);
                setTimeout(updateCount, delay);
            } else {
                counter.innerText = `+${target}`;
            }
        }

        updateCount();
    });
}

hamburgerBtn?.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    mainNav?.classList.toggle('open');
});

mainNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
});

document.querySelector('[data-scroll-top]')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
});

document.querySelectorAll('[data-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
        const fallback = image.dataset.fallback;

        if (fallback && image.src !== fallback) {
            image.src = fallback;
        }
    });
});

document.querySelectorAll('[data-modal-target]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.modalTarget));
});

document.querySelectorAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.dataset.modalClose));
});

document.querySelectorAll('.modal-image img').forEach((img) => {
    img.addEventListener('click', (event) => {
        event.stopPropagation();
        openLightbox(img);
    });
});

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.querySelector('.lightbox-close-btn')?.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach((modal) => {
            modal.style.display = 'none';
        });

        closeLightbox();
        document.body.style.overflow = '';
    }
});

if (statsSection) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounters();
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}
