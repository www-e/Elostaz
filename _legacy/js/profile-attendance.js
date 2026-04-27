document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the profile page and logged in
    if (!document.getElementById('profileSection') || !document.getElementById('attendanceContainer')) return;
    
    // Import Database module if not available
    if (typeof Database === 'undefined') {
        console.error('Database module not loaded! This might cause issues.');
    }
    
    // DOM Elements
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthEl = document.getElementById('currentMonth');
    const attendanceTable = document.getElementById('studentAttendanceTable');
    const noAttendanceData = document.getElementById('noAttendanceData');
    const presentCount = document.getElementById('presentCount');
    const absentCount = document.getElementById('absentCount');
    const excusedCount = document.getElementById('excusedCount');
    
    // Current date state
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    
    // Current student
    let currentStudent = null;
    
    // Initialize
    initAttendance();
    
    // Event listeners
    prevMonthBtn.addEventListener('click', () => {
        navigateMonth(-1);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        navigateMonth(1);
    });
    
    // Initialize attendance module
    function initAttendance() {
        // Get current student
        currentStudent = Database.auth.getCurrentUser();
        
        if (!currentStudent) {
            noAttendanceData.style.display = 'block';
            attendanceTable.style.display = 'none';
            return;
        }
        
        updateMonthDisplay();
        loadAttendanceData();
    }
    
    // Navigate between months
    function navigateMonth(direction) {
        currentMonth += direction;
        
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        } else if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        
        updateMonthDisplay();
        loadAttendanceData();
    }
    
    // Update month display
    function updateMonthDisplay() {
        const monthNames = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    // Load attendance data
    function loadAttendanceData() {
        // Check if currentStudent is available
        if (!currentStudent) {
            noAttendanceData.style.display = 'block';
            attendanceTable.style.display = 'none';
            resetCounters();
            return;
        }
        
        // Get attendance data for this student and month using the database module
        const studentMonthAttendance = Database.attendance.getStudentMonthAttendance(
            currentStudent.id, 
            currentYear, 
            currentMonth
        );
        
        // Get student group days
        const groupDays = getGroupDaysInMonth(currentYear, currentMonth, getGroupDays(currentStudent.group));
        
        // Clear table
        const tbody = attendanceTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        // Initialize counters
        let present = 0;
        let absent = 0;
        let excused = 0;
        
        // Check if there are any attendance records for this student
        let hasAttendanceRecord = false;
        groupDays.forEach(day => {
            const dateStr = formatDateISO(day);
            if (studentMonthAttendance[dateStr]) {
                hasAttendanceRecord = true;
            }
        });
        
        // Show/hide appropriate elements based on data availability
        if (groupDays.length === 0) {
            attendanceTable.style.display = 'none';
            noAttendanceData.style.display = 'block';
            noAttendanceData.textContent = 'لا توجد أيام مجموعة في هذا الشهر';
            resetCounters();
            return;
        }
        
        if (!hasAttendanceRecord) {
            // Show table but with "not recorded" status
            attendanceTable.style.display = 'table';
            noAttendanceData.style.display = 'none';
        } else {
            // Show table with recorded data
            attendanceTable.style.display = 'table';
            noAttendanceData.style.display = 'none';
        }
        
        // Add rows for each day in the group schedule
        groupDays.forEach(day => {
            const dateStr = formatDateISO(day);
            const status = studentMonthAttendance[dateStr] || null;
            
            // Create row for every day, even if status is null
            const row = document.createElement('tr');
            
            // Day name
            const dayCell = document.createElement('td');
            dayCell.textContent = getDayName(day.getDay());
            row.appendChild(dayCell);
            
            // Date
            const dateCell = document.createElement('td');
            dateCell.textContent = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;
            row.appendChild(dateCell);
            
            // Status
            const statusCell = document.createElement('td');
            const statusSpan = document.createElement('span');
            
            if (status) {
                // Count statuses
                if (status === 'present') present++;
                else if (status === 'absent') absent++;
                else if (status === 'excused') excused++;
                
                statusSpan.className = `attendance-status ${status}`;
                
                if (status === 'present') {
                    statusSpan.textContent = 'حاضر';
                } else if (status === 'absent') {
                    statusSpan.textContent = 'غائب';
                } else if (status === 'excused') {
                    statusSpan.textContent = 'غائب بعذر';
                }
            } else {
                statusSpan.className = 'attendance-status not-recorded';
                statusSpan.textContent = 'غير مسجل';
            }
            
            statusCell.appendChild(statusSpan);
            row.appendChild(statusCell);
            
            tbody.appendChild(row);
        });
        
        // Update counters
        presentCount.textContent = present;
        absentCount.textContent = absent;
        excusedCount.textContent = excused;
    }
    
    // Reset attendance counters
    function resetCounters() {
        presentCount.textContent = '0';
        absentCount.textContent = '0';
        excusedCount.textContent = '0';
    }
    
    // Helper function to get days for a specific group
    function getGroupDays(group) {
        // Handle different group name formats
        if (!group) {
            console.warn('Group is undefined or null');
            return [];
        }
        
        if (group === 'السبت - الثلاثاء' || group === 'السبت/الثلاثاء' || group.includes('السبت') && group.includes('الثلاثاء')) {
            return [6, 2]; // Saturday (6) and Tuesday (2)
        } else if (group === 'الأحد - الأربعاء' || group === 'الأحد/الأربعاء' || group.includes('الأحد') && group.includes('الأربعاء')) {
            return [0, 3]; // Sunday (0) and Wednesday (3)
        } else if (group === 'الاثنين - الخميس' || group === 'الاثنين/الخميس' || group.includes('الاثنين') && group.includes('الخميس')) {
            return [1, 4]; // Monday (1) and Thursday (4)
        } else {
            console.warn('Unknown group format:', group);
            return [];
        }
    }
    
    // Helper function to get all group days in a month
    function getGroupDaysInMonth(year, month, groupDays) {
        const result = [];
        const date = new Date(year, month, 1);
        
        // Get all days in the month
        while (date.getMonth() === month) {
            // Check if this day is in the group days
            if (groupDays.includes(date.getDay())) {
                result.push(new Date(date));
            }
            date.setDate(date.getDate() + 1);
        }
        
        return result;
    }
    
    // Helper function to get day name in Arabic
    function getDayName(dayIndex) {
        const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return dayNames[dayIndex];
    }
    
    // Helper function to format date as YYYY-MM-DD
    function formatDateISO(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});
