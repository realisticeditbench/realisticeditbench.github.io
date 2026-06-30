// Leaderboard page logic
let currentTab = '20';
let currentData = [];
let originalData = [];
let sortColumn = 'resolvedRate';
let sortDirection = 'desc';
let searchQuery = '';
let orgFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    initializeLeaderboardNav();
    initializeTabs();
    initializeFilters();
    initializeSearch();
    initializeSorting();
    loadData();
});

function initializeLeaderboardNav() {
    const nav = document.getElementById('siteNav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!nav || !toggle || !links) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    });

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    links.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    loadData();
}

function loadData() {
    originalData = [...(leaderboardData[currentTab] || [])];
    sortColumn = 'resolvedRate';
    sortDirection = 'desc';
    updateSortIcons();
    applyFilters();
    renderTable();
    updateOrgFilter();
}

function initializeFilters() {
    const select = document.getElementById('orgFilter');
    if (!select) return;
    select.addEventListener('change', (e) => {
        orgFilter = e.target.value;
        applyFilters();
        renderTable();
    });
}

function updateOrgFilter() {
    const select = document.getElementById('orgFilter');
    if (!select) return;

    const orgs = [...new Set(originalData.map(item => item.organization))].sort();
    select.innerHTML = '<option value="all">All Organizations</option>';
    orgs.forEach(org => {
        const option = document.createElement('option');
        option.value = org;
        option.textContent = org;
        select.appendChild(option);
    });
    select.value = orgFilter;
}

function applyFilters() {
    let filtered = [...originalData];

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
            item.model.toLowerCase().includes(query) ||
            item.organization.toLowerCase().includes(query)
        );
    }

    if (orgFilter !== 'all') {
        filtered = filtered.filter(item => item.organization === orgFilter);
    }

    filtered.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    filtered.forEach((item, index) => {
        item.displayRank = index + 1;
    });

    currentData = filtered;
}

function initializeSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    let timeout;
    input.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            searchQuery = e.target.value;
            applyFilters();
            renderTable();
        }, 300);
    });
}

function initializeSorting() {
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;

            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = column === 'resolvedRate' ? 'desc' : 'asc';
            }

            updateSortIcons();
            applyFilters();
            renderTable();
        });
    });
}

function updateSortIcons() {
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.classList.remove('asc', 'desc');
    });

    const active = document.querySelector(`[data-sort="${sortColumn}"] .sort-icon`);
    if (active) {
        active.classList.add(sortDirection);
    }
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    if (currentData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <p>No results found. Try adjusting your search or filters.</p>
                </td>
            </tr>
        `;
        return;
    }

    const bestRate = Math.max(...currentData.map(d => d.resolvedRate));
    const secondBestRate = currentData
        .map(d => d.resolvedRate)
        .filter(v => v < bestRate)
        .sort((a, b) => b - a)[0];

    tbody.innerHTML = currentData.map(item => {
        const rank = item.displayRank || item.rank;
        const modelClass = item.isBest ? 'best' : (item.isSecondBest ? 'second-best' : '');
        const rateClass = item.resolvedRate === bestRate ? 'best' :
            (item.resolvedRate === secondBestRate ? 'second-best' : '');

        return `
            <tr>
                <td class="rank-cell">${getRankCell(rank)}</td>
                <td><span class="model-name ${modelClass}">${escapeHtml(item.model)}</span></td>
                <td><span class="${rateClass}">${item.resolvedRate.toFixed(2)}</span></td>
                <td>
                    <div class="org-logo">
                        <span class="org-icon ${item.orgType}">${getOrgInitial(item.organization)}</span>
                        <span>${escapeHtml(item.organization)}</span>
                    </div>
                </td>
                <td>${item.date}</td>
                <td><a href="${item.details}" class="details-link" target="_blank" rel="noopener">Details →</a></td>
            </tr>
        `;
    }).join('');
}

function getRankCell(rank) {
    if (rank === 1) return '<span class="rank-medal">🥇</span>' + rank;
    if (rank === 2) return '<span class="rank-medal">🥈</span>' + rank;
    if (rank === 3) return '<span class="rank-medal">🥉</span>' + rank;
    return rank;
}

function getOrgInitial(org) {
    const words = org.split(' ');
    if (words.length > 1) return words[0][0] + words[1][0];
    return org.substring(0, 2).toUpperCase();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

updateSortIcons();
