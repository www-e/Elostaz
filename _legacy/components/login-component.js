/**
 * Login Component
 * Provides a reusable login component for the homepage
 */

class LoginComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        // Import DatabaseAdapter
        import('../js/database-adapter.js').then(module => {
            this.Database = module.default;
            
            // Check if user is already logged in
            const currentUser = this.Database.auth.getCurrentUser();
            if (currentUser) {
                this.renderUserProfile(currentUser);
            } else {
                this.renderLoginForm();
            }
        }).catch(error => {
            console.error('Error loading database module:', error);
            this.renderError();
        });
    }

    renderLoginForm() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Cairo', sans-serif;
                }
                
                .login-card {
                    background-color: var(--card-bg, #fff);
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    transition: all 0.3s ease;
                    direction: rtl;
                    text-align: right;
                }
                
                h3 {
                    margin-top: 0;
                    margin-bottom: 20px;
                    color: var(--text-color, #333);
                    text-align: center;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: var(--text-color, #333);
                }
                
                .form-control {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid var(--border-color, #ddd);
                    border-radius: 8px;
                    background-color: var(--input-bg, #fff);
                    color: var(--text-color, #333);
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }
                
                .form-control:focus {
                    border-color: var(--primary-color, #007bff);
                    outline: none;
                }
                
                .validation-message {
                    color: #dc3545;
                    font-size: 0.875rem;
                    margin-top: 5px;
                    display: none;
                }
                
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: none;
                    width: 100%;
                    text-align: center;
                }
                
                .btn-primary {
                    background-color: var(--primary-color, #007bff);
                    color: white;
                }
                
                .btn-primary:hover {
                    background-color: var(--primary-hover, #0069d9);
                }
                
                .profile-link {
                    display: block;
                    text-align: center;
                    margin-top: 15px;
                    color: var(--primary-color, #007bff);
                    text-decoration: none;
                }
                
                .profile-link:hover {
                    text-decoration: underline;
                }
            </style>
            
            <div class="login-card">
                <h3>تسجيل الدخول</h3>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="studentId">معرف الطالب</label>
                        <input type="text" id="studentId" class="form-control" required>
                        <div class="validation-message"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="studentPassword">كلمة المرور</label>
                        <input type="password" id="studentPassword" class="form-control" required>
                        <div class="validation-message"></div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        تسجيل الدخول
                    </button>
                </form>
                
                <a href="pages/profile.html" class="profile-link">الذهاب إلى صفحة الملف الشخصي</a>
            </div>
        `;
    }

    renderUserProfile(user) {
        const basePath = window.PathHandler ? window.PathHandler.getBasePath() : '';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Cairo', sans-serif;
                }
                
                .profile-card {
                    background-color: var(--card-bg, #fff);
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    transition: all 0.3s ease;
                    direction: rtl;
                    text-align: center;
                }
                
                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 15px;
                    background-color: var(--primary-color, #007bff);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 30px;
                }
                
                h3 {
                    margin-top: 0;
                    margin-bottom: 5px;
                    color: var(--text-color, #333);
                }
                
                .student-id {
                    color: var(--text-muted, #6c757d);
                    margin-bottom: 15px;
                }
                
                .info-item {
                    margin-bottom: 10px;
                    padding: 10px;
                    background-color: var(--card-bg-secondary, #f8f9fa);
                    border-radius: 8px;
                }
                
                .info-label {
                    font-weight: 600;
                    color: var(--text-muted, #6c757d);
                    margin-bottom: 5px;
                }
                
                .info-value {
                    font-weight: 600;
                    color: var(--text-color, #333);
                }
                
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: none;
                    margin-top: 15px;
                }
                
                .btn-primary {
                    background-color: var(--primary-color, #007bff);
                    color: white;
                }
                
                .btn-primary:hover {
                    background-color: var(--primary-hover, #0069d9);
                }
                
                .btn-outline {
                    background-color: transparent;
                    border: 1px solid var(--primary-color, #007bff);
                    color: var(--primary-color, #007bff);
                }
                
                .btn-outline:hover {
                    background-color: var(--primary-color, #007bff);
                    color: white;
                }
                
                .buttons {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 15px;
                }
            </style>
            
            <div class="profile-card">
                <div class="profile-avatar">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <h3>${user.name}</h3>
                <p class="student-id">${user.id}</p>
                
                <div class="info-item">
                    <div class="info-label">الصف الدراسي</div>
                    <div class="info-value">${user.grade}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">أيام المجموعة</div>
                    <div class="info-value">${user.group}</div>
                </div>
                
                <div class="buttons">
                    <a href="${basePath}/pages/profile.html" class="btn btn-primary">
                        الملف الشخصي
                    </a>
                    <button id="logoutBtn" class="btn btn-outline">
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
    }

    renderError() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Cairo', sans-serif;
                }
                
                .error-card {
                    background-color: var(--card-bg, #fff);
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    transition: all 0.3s ease;
                    direction: rtl;
                    text-align: center;
                    color: var(--text-color, #333);
                }
                
                .error-icon {
                    font-size: 40px;
                    color: #dc3545;
                    margin-bottom: 15px;
                }
            </style>
            
            <div class="error-card">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p>حدث خطأ أثناء تحميل البيانات. يرجى تحديث الصفحة والمحاولة مرة أخرى.</p>
            </div>
        `;
    }

    setupEventListeners() {
        this.shadowRoot.addEventListener('submit', (e) => {
            if (e.target.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin();
            }
        });

        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn') {
                this.handleLogout();
            }
        });
    }

    handleLogin() {
        const studentId = this.shadowRoot.getElementById('studentId');
        const studentPassword = this.shadowRoot.getElementById('studentPassword');
        
        const id = studentId.value.trim();
        const password = studentPassword.value.trim();
        
        if (!id) {
            this.showValidationError(studentId, 'يرجى إدخال معرف الطالب');
            return;
        }
        
        if (!password) {
            this.showValidationError(studentPassword, 'يرجى إدخال كلمة المرور');
            return;
        }
        
        const result = this.Database.auth.login(id, password);
        
        if (result.success) {
            this.renderUserProfile(result.user);
        } else {
            this.showValidationError(studentPassword, result.message);
        }
    }

    handleLogout() {
        this.Database.auth.logout();
        this.renderLoginForm();
    }

    showValidationError(inputElement, message) {
        const validationMessage = inputElement.nextElementSibling;
        validationMessage.textContent = message;
        validationMessage.style.display = 'block';
        
        inputElement.addEventListener('input', function hideError() {
            validationMessage.style.display = 'none';
            inputElement.removeEventListener('input', hideError);
        });
    }
}

// Define the custom element
customElements.define('login-component', LoginComponent);

export default LoginComponent;
