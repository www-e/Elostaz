// js/auth/auth-guard.js
import { supabase } from '../supabase-client.js';

async function checkSession() {
    const { data: { session } } = await (await supabase()).auth.getSession();

    const navbar = document.querySelector('.navbar-collapse .navbar-nav');
    const signInBtn = navbar?.querySelector('.signin-btn')?.parentElement; // Get the <li> element
    
    if (session) {
        // User is logged in
        if (signInBtn) {
            signInBtn.style.display = 'none'; // Hide the sign-in button
        }

        // Check if profile dropdown already exists
        if (!navbar.querySelector('#profile-dropdown-li')) {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const isAdmin = user && user.role === 'admin';
            
            const profileDropdown = document.createElement('li');
            profileDropdown.className = 'nav-item dropdown';
            profileDropdown.id = 'profile-dropdown-li';
            profileDropdown.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user-circle"></i> Profile
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li><a class="dropdown-item" href="${isAdmin ? 'admin.html' : 'profile.html'}">لوحة التحكم</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item" id="logoutBtnGlobal">تسجيل الخروج</button></li>
                </ul>
            `;
            navbar.appendChild(profileDropdown);

            document.getElementById('logoutBtnGlobal').addEventListener('click', async () => {
                await (await supabase()).auth.signOut();
                sessionStorage.removeItem('user');
                window.location.href = window.PathHandler.getAssetPath('pages/signin.html');
            });
        }
    } else {
        // User is not logged in, ensure the sign-in button is visible
        if (signInBtn) {
            signInBtn.style.display = 'block';
        }
    }
}

document.addEventListener('DOMContentLoaded', checkSession);