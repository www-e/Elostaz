// Attendance Management Module
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the admin page
    if (!document.getElementById('attendance')) return;
    
    // DOM Elements
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthEl = document.getElementById('currentMonth');
    const saveAttendanceBtn = document.getElementById('saveAttendance');
    
    // Group tables
    const satTueTable = document.getElementById('satTueTable');
    const sunWedTable = document.getElementById('sunWedTable');
    const monThuTable = document.getElementById('monThuTable');
    
    // Group empty messages
    const satTueNoStudents = document.getElementById('satTueNoStudents');
    const sunWedNoStudents = document.getElementById('sunWedNoStudents');
    const monThuNoStudents = document.getElementById('monThuNoStudents');
    const satTueNoDays = document.getElementById('satTueNoDays');
    const sunWedNoDays = document.getElementById('sunWedNoDays');
    const monThuNoDays = document.getElementById('monThuNoDays');
    
    // Group mapping
    const groupMappings = {
        'السبت - الثلاثاء': {
            days: [6, 2], // Saturday (6) and Tuesday (2)
            table: satTueTable,
            noStudentsEl: satTueNoStudents,
            noDaysEl: satTueNoDays
        },
        'الأحد - الأربعاء': {
            days: [0, 3], // Sunday (0) and Wednesday (3)
            table: sunWedTable,
            noStudentsEl: sunWedNoStudents,
            noDaysEl: sunWedNoDays
        },
        'الاثنين - الخميس': {
            days: [1, 4], // Monday (1) and Thursday (4)
            table: monThuTable,
            noStudentsEl: monThuNoStudents,
            noDaysEl: monThuNoDays
        }
    };
    
    // Current date state
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    
    // Current group
    let currentGroup = 'السبت - الثلاثاء';
    
    // Initialize
    initAttendance();
    
    // Event listeners
    prevMonthBtn.addEventListener('click', () => {
        navigateMonth(-1);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        navigateMonth(1);
    });
    
    saveAttendanceBtn.addEventListener('click', saveAttendance);
    
    // Group tab event listeners
    document.querySelectorAll('#attendanceTabs .nav-link').forEach(tab => {
        tab.addEventListener('click', () => {
            currentGroup = tab.dataset.group;
            loadGroupAttendance(currentGroup);
        });
    });
    
    // Initialize attendance module
    function initAttendance() {
        updateMonthDisplay();
        loadGroupAttendance(currentGroup);
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
        loadGroupAttendance(currentGroup);
    }
    
    // Update month display
    function updateMonthDisplay() {
        const monthNames = [
            'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    // Load attendance data for current group
    function loadGroupAttendance(group) {
        if (!group) return;
        
        // Get current month's days for this group
        const groupDays = getGroupDaysInMonth(currentYear, currentMonth, getGroupDaysForGroup(group));
        const attendanceData = Database.attendance.getMonthAttendance(currentYear, currentMonth);
        
        // Show no days message if applicable
        if (groupDays.length === 0) {
            groupMappings[group].table.style.display = 'none';
            groupMappings[group].noDaysEl.style.display = 'block';
            return;
        }
        
        // Show table
        groupMappings[group].table.style.display = 'table';
        groupMappings[group].noDaysEl.style.display = 'none';
        
        // Load table data
        loadAttendanceTable(group);
    }
    
    // Load attendance table for a specific group
    function loadAttendanceTable(group) {
        const groupInfo = groupMappings[group];
        const students = Database.users.getByGroup(group);
        const table = groupInfo.table;
        const noStudentsEl = groupInfo.noStudentsEl;
        
        // Show message if no students in group
        if (students.length === 0) {
            table.style.display = 'none';
            noStudentsEl.style.display = 'block';
            return;
        }
        
        // Show table and hide message
        table.style.display = 'table';
        noStudentsEl.style.display = 'none';
        
        // Get group days for the current month
        const groupDays = getGroupDaysInMonth(currentYear, currentMonth, groupInfo.days);
        
        // Get attendance data for current month
        const attendanceData = Database.attendance.getMonthAttendance(currentYear, currentMonth);
        
        // Generate table header
        generateTableHeader(table, groupDays);
        
        // Generate table body
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        
        students.forEach(student => {
            const row = generateStudentRow(table, student, groupDays, attendanceData);
            tbody.appendChild(row);
        });
    }
    
    // Generate student row with attendance cells
    function generateStudentRow(table, student, groupDays, attendanceData) {
        const row = document.createElement('tr');
        row.dataset.studentId = student.id;
        
        // Add student info cell
        const studentCell = document.createElement('td');
        studentCell.className = 'student-info';
        studentCell.innerHTML = `
            <div class="student-name">${student.name}</div>
            <div class="student-id">ID: ${student.id}</div>
            <div class="student-index">Index: ${student.index || 'N/A'}</div>
        `;
        row.appendChild(studentCell);
        
        // Add attendance cells for each day
        groupDays.forEach(day => {
            const cell = document.createElement('td');
            cell.className = 'attendance-cell';
            cell.dataset.date = formatDateISO(day);
            
            // Set attendance status if exists
            if (attendanceData[student.id] && attendanceData[student.id][formatDateISO(day)]) {
                const status = attendanceData[student.id][formatDateISO(day)];
                cell.className = `attendance-cell ${status}`;
            }
            
            cell.addEventListener('click', () => toggleAttendanceStatus(cell));
            row.appendChild(cell);
        });
        
        return row;
    }
    
    // Generate attendance table header
    function generateTableHeader(table, days) {
        const thead = table.querySelector('thead tr');
        thead.innerHTML = '<th>الطالب</th>';
        
        days.forEach(day => {
            const th = document.createElement('th');
            th.textContent = `${day.getDate()} ${getMonthShortName(day.getMonth())}`;
            th.dataset.date = formatDateISO(day);
            thead.appendChild(th);
        });
    }
    
    // Toggle attendance status on cell click
    function toggleAttendanceStatus(cell) {
        // Check the current class to determine the next status
        let currentStatus = null;
        
        if (cell.classList.contains('present')) {
            currentStatus = 'present';
        } else if (cell.classList.contains('absent')) {
            currentStatus = 'absent';
        } else if (cell.classList.contains('excused')) {
            currentStatus = 'excused';
        }
        
        // Remove all status classes
        cell.classList.remove('present', 'absent', 'excused');
        
        // Set the next status in the cycle: none -> present -> absent -> excused -> none
        if (!currentStatus) {
            cell.classList.add('present');
        } else if (currentStatus === 'present') {
            cell.classList.add('absent');
        } else if (currentStatus === 'absent') {
            cell.classList.add('excused');
        } else {
            // If it was excused, remove all classes (which we did above)
        }
    }
    
    // Save attendance data
    function saveAttendance() {
        // Get the current attendance data
        const attendanceData = Database.attendance.getMonthAttendance(currentYear, currentMonth) || {};
        
        const activeTable = document.querySelector('#attendanceTabContent .tab-pane.active .attendance-table');
        
        if (!activeTable) return;
        
        // Loop through each student row
        activeTable.querySelectorAll('tbody tr').forEach(row => {
            const studentId = row.dataset.studentId;
            
            // Initialize student data if not exists
            if (!attendanceData[studentId]) {
                attendanceData[studentId] = {};
            }
            
            // Loop through attendance cells
            row.querySelectorAll('.attendance-cell').forEach(cell => {
                const date = cell.dataset.date;
                let status = null;
                
                // Determine status
                if (cell.classList.contains('present')) {
                    status = 'present';
                } else if (cell.classList.contains('absent')) {
                    status = 'absent';
                } else if (cell.classList.contains('excused')) {
                    status = 'excused';
                }
                
                // Save status or remove if null
                if (status) {
                    attendanceData[studentId][date] = status;
                } else if (attendanceData[studentId][date]) {
                    delete attendanceData[studentId][date];
                }
            });
        });
        
        // Save to database
        Database.attendance.saveMonthAttendance(currentYear, currentMonth, attendanceData);
        
        // Show success message
        showAlert('تم', 'تم حفظ بيانات الحضور بنجاح', 'success');
    }
    
    // Helper function to get day name in Arabic
    function getDayName(dayIndex) {
        const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return dayNames[dayIndex];
    }
    
    // Helper function to get month short name in Arabic
    function getMonthShortName(monthIndex) {
        const monthNames = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        return monthNames[monthIndex];
    }
    
    // Helper function to format date as YYYY-MM-DD
    function formatDateISO(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Helper function to get all days of a specific weekday in a month
    function getGroupDaysInMonth(year, month, weekdays) {
        const result = [];
        const date = new Date(year, month, 1);
        
        // Get the last day of the month
        const lastDay = new Date(year, month + 1, 0).getDate();
        
        // Loop through all days in the month
        for (let i = 1; i <= lastDay; i++) {
            date.setDate(i);
            
            // If the day is in our weekdays array, add it to result
            if (weekdays.includes(date.getDay())) {
                result.push(new Date(date));
            }
        }
        
        return result;
    }
    
    // Helper function to get group days for a specific group
    function getGroupDaysForGroup(group) {
        return groupMappings[group].days;
    }
    
    // Show alert function (reusing from admin.js)
    function showAlert(title, message, type = 'success') {
        const alertModalEl = document.getElementById('alertModal');
        const alertModal = new bootstrap.Modal(alertModalEl);
        const alertModalTitle = document.getElementById('alertModalTitle');
        const alertModalMessage = document.getElementById('alertModalMessage');
        
        alertModalTitle.textContent = title;
        alertModalMessage.textContent = message;
        
        // Remove existing alert classes and add the new one
        alertModalEl.classList.remove('alert-success', 'alert-danger');
        alertModalEl.classList.add(`alert-${type}`);
        
        // Show the modal
        alertModal.show();
    }
});
