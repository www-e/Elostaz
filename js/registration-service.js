import { supabase } from './supabase-client.js';

// Restricted groups that cannot be registered for
const RESTRICTED_GROUPS = {
    'third': {
        'general': {
            'sun_wed_fri': ['13:00']  // الأحد والأربعاء والجمعة 1:00 للعام
        },
        'statistics': {
            'mon_thu': ['12:00']  // الاتنين والخميس 12:00 للإحصاء
        }
    }
};

// Check if a group is restricted
export function isRestrictedGroup(grade, section, group, time) {
    if (!RESTRICTED_GROUPS[grade]) return false;
    if (!RESTRICTED_GROUPS[grade][section]) return false;
    if (!RESTRICTED_GROUPS[grade][section][group]) return false;
    return RESTRICTED_GROUPS[grade][section][group].includes(time);
}

export const schedules = {
    first: {
        'sat_tue': ['15:15', '16:30'],
        'sun_wed': ['14:00'],
        'mon_thu': ['14:00']
    },
    second: {
        'sat_tue': ['14:00'],
        'sun_wed': ['15:15'],
        'mon_thu': ['15:15']
    },
    third: {
        statistics: {
            'sun_wed': ['16:30'],
            'mon_thu': ['12:00']
        },
        general: {
            'sat_tue_thu': ['12:00'],
            'sun_wed_fri': ['13:00']
        }
    }
};

export const gradeNames = {
    'first': 'الصف الأول الثانوي',
    'second': 'الصف الثاني الثانوي',
    'third': 'الصف الثالث الثانوي'
};

export const sectionNames = {
    'general': 'علمي رياضة',
    'statistics': 'إحصاء (أدبي)',
    'science': 'علمي',
    'arts': 'أدبي'
};

export const groupNames = {
    'sat_tue': 'السبت والثلاثاء',
    'sun_wed': 'الأحد والأربعاء',
    'mon_thu': 'الاثنين والخميس',
    'sat_tue_thu': 'السبت والثلاثاء والخميس',
    'sun_wed_fri': 'الأحد والأربعاء والجمعة'
};

// Function to check if a group is always full
function isAlwaysFull(grade, section, group, time) {
    return isRestrictedGroup(grade, section, group, time);
}

// Function to generate random availability status
function getAvailabilityStatus(grade, section, group, time) {
    if (isAlwaysFull(grade, section, group, time)) {
        return {
            status: 'full',
            text: 'مكتملة'
        };
    }

    // Generate random status for other groups
    const rand = Math.random();
    if (rand < 0.2) {
        return {
            status: 'full',
            text: 'مكتملة'
        };
    } else if (rand < 0.5) {
        return {
            status: 'limited',
            text: 'عدد محدود'
        };
    } else {
        return {
            status: 'available',
            text: 'متاحة'
        };
    }
}

export async function registerStudent(studentData) {
    const supabaseClient = await supabase();
    try {
        const { data, error } = await supabaseClient
            .from('registrations_2025_2026')
            .insert([studentData]);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error registering student:', error);
        return { data: null, error };
    }
}

export async function checkExistingRegistration(studentPhone) {
    const supabaseClient = await supabase();
    try {
        const { data, error } = await supabaseClient
            .from('registrations_2025_2026')
            .select('*')
            .eq('student_phone', studentPhone);

        if (error) throw error;
        return { exists: data.length > 0, error: null };
    } catch (error) {
        console.error('Error checking registration:', error);
        return { exists: false, error };
    }
}

export function getAvailableGroups(grade, section = null) {
    if (grade === 'third') {
        return Object.keys(schedules.third[section]);
    }
    return Object.keys(schedules[grade]);
}

// Convert time to Arabic 12-hour format
function convertToArabicTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'م' : 'ص';
    const hour12 = hour > 12 ? hour - 12 : hour;
    const arabicTime = `${convertToArabicNumbers(hour12)}:${convertToArabicNumbers(minutes)} ${period}`;
    return arabicTime;
}

function convertToArabicNumbers(num) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/[0-9]/g, w => arabicNumbers[+w]);
}

export function getAvailableTimes(grade, group, section = null) {
    let times;
    if (grade === 'third') {
        times = schedules.third[section][group];
    } else {
        times = schedules[grade][group];
    }

    return times.map(time => ({
        time,
        displayTime: convertToArabicTime(time),
        availability: getAvailabilityStatus(grade, section, group, time)
    }));
}

export function showThirdGradeInfo() {
    const modal = document.createElement('div');
    modal.className = 'info-modal';
    modal.innerHTML = `
        <div class="info-modal-content">
            <div class="info-modal-header">
                <h3 class="info-modal-title">معلومات هامة للصف الثالث الثانوي</h3>
                <button class="info-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="info-modal-body">
                <p>نظام الدراسة للصف الثالث الثانوي يتميز بالآتي:</p>
                <ul>
                    <li>
                        <span class="info-highlight">حضور مكثف:</span>
                        ثلاثة أيام في الأسبوع لضمان التغطية الكاملة للمنهج
                    </li>
                    <li>
                        <span class="info-highlight">امتحان شامل:</span>
                        يُعقد في آخر جمعة من كل شهر لتقييم مستوى الطلاب
                    </li>
                    <li>
                        <span class="info-highlight">شمولية التدريس:</span>
                        المنهج يغطي متطلبات الثانوية العامة والأزهر
                    </li>
                    <li>
                        <span class="info-highlight">متابعة مستمرة:</span>
                        تقييم دوري للمستوى وتقديم الدعم اللازم
                    </li>
                </ul>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('active'), 10);

    // Close button functionality
    const closeBtn = modal.querySelector('.info-modal-close');
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

export async function submitRegistration(formData) {
    try {
        const registrationData = {
            student_name: formData.get('student_name'),
            student_phone: formData.get('student_phone'),
            parent_phone: formData.get('parent_phone'),
            grade: formData.get('grade'),
            section: formData.get('section') || null,
            days_group: formData.get('days_group'),
            time_slot: formData.get('time_slot')
        };

        // Check if trying to register for a restricted group
        if (isRestrictedGroup(
            registrationData.grade, 
            registrationData.section, 
            registrationData.days_group, 
            registrationData.time_slot
        )) {
            throw new Error('لا يمكن التسجيل في هذه المجموعة حيث أنها مكتملة');
        }

        // Check for existing registration
        const { exists, error: checkError } = await checkExistingRegistration(registrationData.student_phone);
        if (checkError) throw checkError;
        if (exists) {
            return { 
                success: false, 
                error: 'هذا الطالب مسجل بالفعل في هذا الصف',
                errorCode: 'DUPLICATE_STUDENT'
            };
        }

        // Register the student
        const { data, error } = await registerStudent(registrationData);
        if (error) {
            // Check if it's a duplicate key error
            if (error.code === '23505' || (error.message && error.message.includes('duplicate key value'))) {
                return { 
                    success: false, 
                    error: 'هذا الطالب مسجل بالفعل في هذا الصف',
                    errorCode: '23505'
                };
            }
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error submitting registration:', error);
        
        // Format the error response
        const errorResponse = { 
            success: false, 
            error: error.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.'
        };
        
        // Add error code if available
        if (error.code) {
            errorResponse.errorCode = error.code;
        }
        
        return errorResponse;
    }
} 