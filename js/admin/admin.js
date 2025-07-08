import { supabase } from '../supabase-client.js';

document.addEventListener('DOMContentLoaded', async function () {
    // 1. Authenticate and Guard
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData || userData.id !== '4dba45ee-33a6-41cd-b0da-af7c1f7d9870') {
        window.location.href = '../pages/signin.html';
        return;
    }

    // 2. Initialize UI Components
    initializeLogout();
    await updateStatCards();

    // 3. Tab Management
    const tabs = {
        stats: {
            element: document.querySelector('#stats-tab'),
            pane: document.querySelector('#stats-tab-pane'),
            module: './stats-tab.js',
            loaded: false
        },
        registrations: {
            element: document.querySelector('#registrations-tab'),
            pane: document.querySelector('#registrations-tab-pane'),
            module: './registrations-tab.js',
            loaded: false
        }
    };

    async function loadTab(tabKey) {
        const tab = tabs[tabKey];
        if (tab && !tab.loaded) {
            try {
                const { init } = await import(tab.module);
                await init();
                tab.loaded = true;
            } catch (error) {
                console.error(`Failed to load module for ${tabKey}:`, error);
                tab.pane.innerHTML = `<div class="alert alert-danger">فشل تحميل محتوى هذا القسم.</div>`;
            }
        }
    }

    // Load the default active tab
    await loadTab('stats');

    // Add event listeners for tab clicks
    Object.keys(tabs).forEach(key => {
        const tabElement = tabs[key].element;
        if (tabElement) {
            tabElement.addEventListener('show.bs.tab', () => loadTab(key));
        }
    });
});

async function updateStatCards() {
    try {
        const supabaseClient = await supabase();

        // Fetch counts from stats_review_2025
        const { data: statsData, error: statsError } = await supabaseClient
            .from('stats_review_2025')
            .select('payment_status', { count: 'exact' });

        if (statsError) throw statsError;

        const statsCounts = {
            pending: statsData.filter(s => s.payment_status === 'pending').length,
            under_review: statsData.filter(s => s.payment_status === 'under_review').length,
            accepted: statsData.filter(s => s.payment_status === 'accepted').length,
            total: statsData.length
        };

        // Fetch count from registrations_2025_2026
        const { count: registrationsCount, error: regsError } = await supabaseClient
            .from('registrations_2025_2026')
            .select('*', { count: 'exact', head: true });

        if (regsError) throw regsError;

        // Update card values
        document.getElementById('totalStudents').textContent = (statsCounts.total || 0) + (registrationsCount || 0);
        document.getElementById('pendingPayments').textContent = statsCounts.pending || 0;
        document.getElementById('underReview').textContent = statsCounts.under_review || 0;
        document.getElementById('acceptedPayments').textContent = statsCounts.accepted || 0;

    } catch (error) {
        console.error('Error fetching statistics:', error);
        // Optionally show an error message to the user
    }
}

function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('user');
            window.location.href = '../pages/signin.html';
        });
    }
}

// Global utility to show alerts, accessible by tab modules
window.showAlert = function (message, type = 'success') {
    const alertContainer = document.querySelector('.admin-content');
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.insertBefore(alertElement, alertContainer.firstChild);
    setTimeout(() => {
        // Use Bootstrap's method to gracefully close the alert
        const bsAlert = new bootstrap.Alert(alertElement);
        bsAlert.close();
    }, 5000);
}