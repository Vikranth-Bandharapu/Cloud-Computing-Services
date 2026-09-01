/*
   Stackly Portal Dashboard Functionality (dashboard.js)
   Enables sidebar panel switching, interactive layouts, server databases search,
   real-time graphs updates, and the splitscreen Email Center.
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if we are on a dashboard page
    const isDashboard = document.querySelector('.dashboard-wrapper');
    if (!isDashboard) return;

    initDashboardNavigation();
    initDashboardCollapse();
    initServerManagement();
    initStorageManagement();
    initDeploymentsTab();
    initMonitoringTab();
    initSecurityTab();
    initReportsTab();
    initSettingsTab();
    initEmailCenter();
});

/* --- Global Dashboard Sidebar & Tab Switcher Functions --- */
window.toggleDashboardSidebar = function() {
    const sidebar = document.getElementById('dashboard-sidebar') || document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    sidebar.classList.toggle('active');
    sidebar.classList.toggle('mobile-sidebar-open');
};

window.switchTab = function(evt, tabId) {
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    // Hide all tabs
    const tabPanels = document.querySelectorAll('.dashboard-tab');
    tabPanels.forEach(panel => {
        panel.classList.add('hidden');
        panel.classList.remove('active');
        panel.style.display = 'none';
    });

    // Show target tab
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.remove('hidden');
        targetTab.classList.add('active');
        targetTab.style.display = 'block';
    }

    // Highlight sidebar link
    const navLinks = document.querySelectorAll('#dashboard-sidebar a');
    navLinks.forEach(link => {
        link.classList.remove('active', 'bg-white/10', 'text-white');
    });

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active', 'bg-white/10', 'text-white');
    }

    // Auto close drawer on mobile after selection
    const sidebar = document.getElementById('dashboard-sidebar');
    if (sidebar) {
        sidebar.classList.remove('active', 'mobile-sidebar-open');
    }
};

/* --- 2. Desktop & Mobile Sidebar Toggling --- */
function initDashboardCollapse() {
    const toggleBtn = document.querySelector('.header-toggle-btn');
    const closeBtn = document.querySelector('.close-sidebar-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const main = document.querySelector('.dashboard-main');

    if (toggleBtn && sidebar && main) {
        toggleBtn.addEventListener('click', () => {
            // Check if screen is small
            if (window.innerWidth <= 992) {
                sidebar.classList.add('active');
            } else {
                sidebar.classList.toggle('collapsed');
                main.classList.toggle('expanded');
            }
        });
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
}

/* --- 3. Dynamic Server Management Tab --- */
const DUMMY_SERVERS = [
    { id: 'SVR-101', name: 'US-East Production Database', status: 'online', type: 'db.m5.xlarge', cpu: 42, ram: 58, region: 'us-east-1', uptime: '14 days' },
    { id: 'SVR-102', name: 'EU-West Container Cache Gateway', status: 'online', type: 'c5.2xlarge', cpu: 78, ram: 45, region: 'eu-west-1', uptime: '8 days' },
    { id: 'SVR-103', name: 'AP-South Backup Storage Sync', status: 'online', type: 's3.glacier.sync', cpu: 15, ram: 92, region: 'ap-south-1', uptime: '29 days' },
    { id: 'SVR-104', name: 'US-West Testing Sandbox', status: 'offline', type: 't3.micro', cpu: 0, ram: 0, region: 'us-west-2', uptime: '0 days' }
];

function initServerManagement() {
    const searchInput = document.getElementById('server-search');
    const regionFilter = document.getElementById('server-region-filter');
    const container = document.getElementById('server-cards-container');

    if (!container) return;

    function renderServers() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const region = regionFilter ? regionFilter.value : 'all';

        container.innerHTML = '';

        const filtered = DUMMY_SERVERS.filter(svr => {
            const matchesQuery = svr.name.toLowerCase().includes(query) || svr.id.toLowerCase().includes(query);
            const matchesRegion = region === 'all' || svr.region === region;
            return matchesQuery && matchesRegion;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="col-12 text-center text-muted py-5">No cloud server resources match your filters.</div>`;
            return;
        }

        filtered.forEach(svr => {
            const card = document.createElement('div');
            card.className = 'col-md-6 mb-4';
            card.innerHTML = `
                <div class="server-card-v3">
                    <div class="server-card-header">
                        <div>
                            <h4 class="mb-0 text-white font-weight-700">${svr.name}</h4>
                            <small class="text-muted">${svr.id} &bull; ${svr.type}</small>
                        </div>
                        <span class="server-status-dot ${svr.status}"></span>
                    </div>
                    <div class="server-metrics-row">
                        <div class="d-flex justify-content-between text-muted font-size-0.85">
                            <span>CPU Capacity</span>
                            <span>${svr.cpu}%</span>
                        </div>
                        <div class="progress-bar-stackly">
                            <div class="progress-bar-fill" style="width: ${svr.cpu}%; background-color: ${svr.cpu > 75 ? 'var(--error-red)' : 'var(--cyan-accent)'}"></div>
                        </div>
                        <div class="d-flex justify-content-between text-muted font-size-0.85 mt-2">
                            <span>Memory (RAM)</span>
                            <span>${svr.ram}%</span>
                        </div>
                        <div class="progress-bar-stackly">
                            <div class="progress-bar-fill" style="width: ${svr.ram}%;"></div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-muted font-size-0.85 border-top border-secondary pt-3 mt-3">
                        <span><i class="fas fa-map-marker-alt mr-2 text-primary"></i> ${svr.region}</span>
                        <span><i class="fas fa-clock mr-2 text-warning"></i> Uptime: ${svr.uptime}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    if (searchInput) searchInput.addEventListener('input', renderServers);
    if (regionFilter) regionFilter.addEventListener('change', renderServers);

    // Initial load
    renderServers();
}

/* --- 4. Storage Management --- */
function initStorageManagement() {
    // Add dynamic storage stats display if exists
}

/* --- 5. Deployments History Tab --- */
function initDeploymentsTab() {
    // Standard triggers for deployment items list if page contains it
}

/* --- 6. Monitoring Charts Rendering --- */
function initMonitoringTab() {
    // Run real-time monitoring updating triggers if panel exists
}

/* --- 7. Security Status Tab --- */
function initSecurityTab() {
    // Load firewall threat logs
}

/* --- 8. Reports Tab --- */
function initReportsTab() {
    // Load usage and bill reports list
}

/* --- 9. Profile & Settings Form --- */
function initSettingsTab() {
    // Settings logic
}

/* --- 10. Dynamic Splitscreen Email Center --- */
const MOCK_EMAILS = [
    { id: 'mail-1', sender: 'SecOps Threat Alert Command', subject: 'Automated Shield Mitigated SQL Injection Probe', body: 'This is an official security dispatch. The Stackly Intrusion Defense Firewall successfully blocked and blacklisted IP 103.22.41.9 after detecting consecutive query injections targeted at the AP-South db cluster. No data exposure occurred.', date: 'Aug 31', time: '13:10 UTC', unread: true, priority: 'high' },
    { id: 'mail-2', sender: 'Billing Department Registrar', subject: 'August 2026 Cloud Invoice Settled', body: 'Greetings Client, your Stackly Cloud Enterprise invoice for the billing cycle ending August 31, 2026, has been paid in full via automatic clearing house. A PDF receipt has been archived in your Documents folder.', date: 'Aug 30', time: '09:15 UTC', unread: false, priority: 'normal' },
    { id: 'mail-3', sender: 'DevOps Scheduler Agent', subject: 'Scheduled Maintenance: EU-West-1 Datacenter Node-04', body: 'Please note: Cloud computing hosts deployed on EU-West-1 Node-04 will experience short latency periods on Sept 3rd, 02:00-03:00 UTC due to critical diagnostic patching and database caching updates.', date: 'Aug 29', time: '18:40 UTC', unread: true, priority: 'normal' },
    { id: 'mail-4', sender: 'CTO Office Rodriguez', subject: 'Platform Authorization Grant Approved', body: 'The Stackly Executive board has audited and authorized your request for Sandboxed Developer Nodes credentials. You can now instantiate micro instances inside the us-west region.', date: 'Aug 27', time: '14:22 UTC', unread: false, priority: 'high' }
];

function initEmailCenter() {
    const listPane = document.getElementById('email-rows-container');
    const searchInput = document.getElementById('email-search');
    const layout = document.querySelector('.email-center-layout');

    if (!listPane) return;

    function renderEmailList() {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        listPane.innerHTML = '';

        const filtered = MOCK_EMAILS.filter(email => 
            email.sender.toLowerCase().includes(query) || email.subject.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            listPane.innerHTML = `<div class="text-center text-muted p-4">No emails found.</div>`;
            return;
        }

        filtered.forEach(email => {
            const row = document.createElement('div');
            row.className = `email-row-item ${email.unread ? 'unread' : ''} ${email.priority === 'high' ? 'border-right border-danger' : ''}`;
            row.setAttribute('data-id', email.id);
            row.innerHTML = `
                <div class="email-item-header">
                    <span>${email.sender}</span>
                    <span>${email.date}</span>
                </div>
                <div class="email-item-subject text-white">${email.subject}</div>
                <div class="email-item-preview text-muted">${email.body}</div>
            `;

            row.addEventListener('click', () => {
                // Highlight clicked row
                document.querySelectorAll('.email-row-item').forEach(r => r.classList.remove('active'));
                row.classList.add('active');

                // Mark as read
                email.unread = false;
                row.classList.remove('unread');

                // Display detailed email pane
                displayEmailDetail(email);

                // For mobile responsive view
                if (layout) {
                    layout.classList.add('viewing-detail');
                }
            });

            listPane.appendChild(row);
        });
    }

    function displayEmailDetail(email) {
        const detailPane = document.getElementById('email-detail-pane');
        if (!detailPane) return;

        detailPane.innerHTML = `
            <div class="email-detail-header">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <button class="btn btn-sm btn-outline-light d-lg-none" id="back-to-inbox-btn">
                        <i class="fas fa-arrow-left mr-2"></i> Back to Inbox
                    </button>
                    <span class="badge ${email.priority === 'high' ? 'bg-danger' : 'bg-primary'}">${email.priority.toUpperCase()} PRIORITY</span>
                </div>
                <h2 class="email-detail-title text-white mb-2">${email.subject}</h2>
                <div class="email-detail-sender">
                    <strong>From: ${email.sender}</strong>
                    <span>${email.date} &bull; ${email.time}</span>
                </div>
            </div>
            <div class="email-detail-body">
                <p>${email.body}</p>
                <p class="mt-4 text-muted">Stackly Cloud Operations Security Authority &bull; Gateway Log Verified</p>
            </div>
        `;

        // Mobile back button
        const backBtn = document.getElementById('back-to-inbox-btn');
        if (backBtn && layout) {
            backBtn.addEventListener('click', () => {
                layout.classList.remove('viewing-detail');
            });
        }
    }

    if (searchInput) searchInput.addEventListener('input', renderEmailList);

    // Initial render
    renderEmailList();

    // Select the first email automatically on desktop
    if (window.innerWidth > 992 && MOCK_EMAILS.length > 0) {
        setTimeout(() => {
            const firstRow = listPane.querySelector('.email-row-item');
            if (firstRow) firstRow.click();
        }, 100);
    }
}

/* Global Dashboard Action Redirection to 404.html */
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, input[type="submit"], input[type="button"], a.btn, .btn');
    if (!btn) return;

    // Exclude tab switchers, sidebar toggle, close drawer, and logout
    if (
        btn.classList.contains('logout-trigger-btn') ||
        btn.classList.contains('header-toggle-btn') ||
        btn.classList.contains('theme-btn') ||
        btn.id === 'close-sidebar-btn' ||
        (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('switchTab')) ||
        (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('logout')) ||
        (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('toggleDashboardSidebar'))
    ) {
        return;
    }

    // If inside a dashboard view, redirect to 404.html
    if (document.querySelector('.dashboard-tab') || document.getElementById('dashboard-sidebar')) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '404.html';
    }
}, true);

document.addEventListener('submit', (e) => {
    if (document.querySelector('.dashboard-tab') || document.getElementById('dashboard-sidebar')) {
        e.preventDefault();
        window.location.href = '404.html';
    }
}, true);
