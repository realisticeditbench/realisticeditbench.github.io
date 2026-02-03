// Leaderboard functionality
let currentTab = '20';
let currentData = [];
let originalData = []; // Store original unfiltered data
let sortColumn = 'resolvedRate';
let sortDirection = 'desc';
let searchQuery = '';
let orgFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeFilters();
    initializeSearch();
    initializeSorting();
    loadData();
});

// Tab switching
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Reload data
    loadData();
}

// Load and display data
function loadData() {
    originalData = [...(leaderboardData[currentTab] || [])];
    // Reset to default sorting by resolvedRate
    sortColumn = 'resolvedRate';
    sortDirection = 'desc';
    updateSortIcons();
    applyFilters();
    renderTable();
    updateOrgFilter();
}

// Filter functionality
function initializeFilters() {
    const orgFilterSelect = document.getElementById('orgFilter');
    orgFilterSelect.addEventListener('change', (e) => {
        orgFilter = e.target.value;
        applyFilters();
        renderTable();
    });
}

function updateOrgFilter() {
    const orgFilterSelect = document.getElementById('orgFilter');
    // Use originalData to get all available organizations
    const orgs = [...new Set(originalData.map(item => item.organization))].sort();
    
    // Clear existing options except "All"
    orgFilterSelect.innerHTML = '<option value="all">All Organizations</option>';
    
    // Add organization options
    orgs.forEach(org => {
        const option = document.createElement('option');
        option.value = org;
        option.textContent = org;
        orgFilterSelect.appendChild(option);
    });
    
    orgFilterSelect.value = orgFilter;
}

function applyFilters() {
    // Always start from originalData, not currentData
    let filtered = [...originalData];
    
    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
            item.model.toLowerCase().includes(query) ||
            item.organization.toLowerCase().includes(query)
        );
    }
    
    // Apply organization filter
    if (orgFilter !== 'all') {
        filtered = filtered.filter(item => item.organization === orgFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });
    
    // Update ranks after filtering/sorting
    filtered.forEach((item, index) => {
        item.displayRank = index + 1;
    });
    
    // Update currentData with filtered results
    currentData = filtered;
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value;
            applyFilters();
            renderTable();
        }, 300);
    });
}

// Sorting functionality
function initializeSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                // Default to desc for resolvedRate, asc for others
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
    
    const activeHeader = document.querySelector(`[data-sort="${sortColumn}"] .sort-icon`);
    if (activeHeader) {
        activeHeader.classList.add(sortDirection);
    }
}

// Render table
function renderTable() {
    const tbody = document.getElementById('tableBody');
    
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
    
    // Find best and second best values for highlighting
    const bestResolvedRate = Math.max(...currentData.map(d => d.resolvedRate));
    const secondBestResolvedRate = currentData
        .map(d => d.resolvedRate)
        .filter(v => v < bestResolvedRate)
        .sort((a, b) => b - a)[0];
    
    tbody.innerHTML = currentData.map(item => {
        const rank = item.displayRank || item.rank;
        const rankCell = getRankCell(rank, false);
        const modelClass = item.isBest ? 'best' : (item.isSecondBest ? 'second-best' : '');
        const resolvedRateClass = item.resolvedRate === bestResolvedRate ? 'best' : 
                                  (item.resolvedRate === secondBestResolvedRate ? 'second-best' : '');
        
        return `
            <tr>
                <td class="rank-cell">${rankCell}</td>
                <td><span class="model-name ${modelClass}">${escapeHtml(item.model)}</span></td>
                <td><span class="${resolvedRateClass}">${item.resolvedRate.toFixed(2)}</span></td>
                <td>
                    <div class="org-logo">
                        <span class="org-icon ${item.orgType}">${getOrgInitial(item.organization)}</span>
                        <span>${escapeHtml(item.organization)}</span>
                    </div>
                </td>
                <td>${item.date}</td>
                <td><a href="${item.details}" class="details-link" target="_blank">Details →</a></td>
            </tr>
        `;
    }).join('');
}

function getRankCell(rank, verified) {
    let cell = '';
    
    if (rank === 1) {
        cell += '<span class="rank-medal gold">🥇</span>';
    } else if (rank === 2) {
        cell += '<span class="rank-medal silver">🥈</span>';
    } else if (rank === 3) {
        cell += '<span class="rank-medal bronze">🥉</span>';
    }
    
    cell += rank;
    
    return cell;
}

function getOrgInitial(org) {
    const words = org.split(' ');
    if (words.length > 1) {
        return words[0][0] + words[1][0];
    }
    return org.substring(0, 2).toUpperCase();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize sort icons on load
updateSortIcons();
