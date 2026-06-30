// Shared site navigation (index.html)
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
});

function initializeNavigation() {
    const nav = document.getElementById('siteNav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!nav || !toggle || !links) return;

    const navAnchors = links.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        updateActiveNavLink();
    });

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            if (!anchor.getAttribute('href')?.startsWith('#')) return;
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.querySelectorAll('details.detail-panel').forEach(panel => {
        panel.addEventListener('toggle', () => {
            if (panel.open && panel.id) {
                history.replaceState(null, '', '#' + panel.id);
            }
        });
    });

    openPanelFromHash();
    window.addEventListener('hashchange', openPanelFromHash);
}

function openPanelFromHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    const panel = target.closest('details') || (target.tagName === 'DETAILS' ? target : null);
    if (panel) {
        panel.open = true;
    }

    requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], details[id], figure[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    let current = '';

    sections.forEach(section => {
        const top = section.getBoundingClientRect().top;
        if (top <= 120) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href').slice(1);
        link.classList.toggle('active', href === current || (href === 'related-work-table' && current === 'related-work'));
    });
}
