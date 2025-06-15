import { supabase } from '../supabase-client.js';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signinForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = form.username.value.trim();
        const password = form.password.value;

        if (!username || !password) {
            showError('يرجى إدخال اسم المستخدم وكلمة المرور');
            return;
        }

        try {
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Get Supabase client
            const supabaseClient = await supabase();

            // First try student authentication
            const { data: student, error: studentError } = await supabaseClient
                .from('stats_review_2025')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .single();

            if (student) {
                // Student login successful
                sessionStorage.setItem('user', JSON.stringify({
                    id: student.id,
                    username: student.username,
                    student_name: student.student_name,
                    student_phone: student.student_phone,
                    parent_phone: student.parent_phone,
                    school_type: student.school_type,
                    attendance_type: student.attendance_type,
                    payment_status: student.payment_status,
                    role: 'student'
                }));

                // Redirect to student profile page
                window.location.href = '../pages/profile.html';
                return;
            }

            // If not a student, try admin authentication
            const { data: { session }, error: adminError } = await supabaseClient.auth.signInWithPassword({
                email: username,
                password: password
            });

            if (adminError) {
                throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
            }

            if (session) {
                // Admin login successful
                sessionStorage.setItem('user', JSON.stringify({
                    id: session.user.id,
                    role: 'admin',
                    email: session.user.email
                }));

                // Redirect to admin dashboard
                window.location.href = '../pages/admin.html';
                return;
            }

            throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');

        } catch (error) {
            console.error('Sign-in error:', error);
            showError(error.message || 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        } finally {
            // Remove loading state
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
});

function showError(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        const form = document.getElementById('signinForm');
        form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.classList.add('show');

    // Hide error after 5 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
} 