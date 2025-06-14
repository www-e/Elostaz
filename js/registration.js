import { 
    schedules, 
    gradeNames, 
    sectionNames, 
    groupNames,
    submitRegistration,
    getAvailableGroups,
    getAvailableTimes,
    isRestrictedGroup
} from './registration-service.js';

import { SuccessModal } from './components/success-modal.js';
import { ThirdGradeModal } from './components/third-grade-modal.js';
import { RestrictedGroupsModal } from './components/restricted-groups-modal.js';
import { DuplicateRegistrationModal } from './components/duplicate-registration-modal.js';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    const gradeSelect = document.getElementById('grade');
    const sectionGroup = document.getElementById('sectionGroup');
    const sectionSelect = document.getElementById('section');
    const groupSelect = document.getElementById('group');
    const timeSelect = document.getElementById('time');
    const successModal = new SuccessModal();
    const thirdGradeModal = new ThirdGradeModal();
    const restrictedGroupsModal = new RestrictedGroupsModal();
    const duplicateRegistrationModal = new DuplicateRegistrationModal();
    
    // Global dropdown management
    let activeDropdown = null;
    
    // Initialize custom dropdowns for all select elements
    function initializeCustomDropdowns() {
        // Remove any existing custom dropdowns first
        document.querySelectorAll('.custom-dropdown-container').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Create fresh custom dropdowns
        if (gradeSelect) createCustomDropdown(gradeSelect);
        if (sectionSelect) createCustomDropdown(sectionSelect);
        if (groupSelect) createCustomDropdown(groupSelect);
    }
    
    // Initialize all dropdowns
    initializeCustomDropdowns();

    // Enhanced custom dropdown creation function
    function createCustomDropdown(selectElement) {
        if (!selectElement) return;
        
        const selectContainer = selectElement.parentElement;
        
        // Remove existing custom dropdown if present
        const existingDropdown = selectContainer.querySelector('.custom-dropdown-container');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        // Create custom dropdown container
        const customDropdownContainer = document.createElement('div');
        customDropdownContainer.className = 'custom-dropdown-container';
        
        // Create selected display
        const selectedDisplay = document.createElement('div');
        selectedDisplay.className = 'selected-option';
        selectedDisplay.setAttribute('tabindex', '0');
        selectedDisplay.setAttribute('role', 'combobox');
        selectedDisplay.setAttribute('aria-expanded', 'false');
        
        // Set initial placeholder text
        const placeholderText = getPlaceholderText(selectElement.id);
        selectedDisplay.textContent = placeholderText;
        selectedDisplay.setAttribute('data-value', '');
        
        // Create dropdown options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'dropdown-options';
        optionsContainer.setAttribute('role', 'listbox');
        
        // Function to update dropdown options
        function updateDropdownOptions() {
            optionsContainer.innerHTML = '';
            
            Array.from(selectElement.options).forEach((option, index) => {
                // Skip empty placeholder options
                if (index === 0 && !option.value) return;
                
                const dropdownOption = document.createElement('div');
                dropdownOption.className = 'dropdown-option';
                dropdownOption.setAttribute('role', 'option');
                dropdownOption.setAttribute('data-value', option.value);
                dropdownOption.textContent = option.textContent;
                
                // Add click event listener
                dropdownOption.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectOption(option.value, option.textContent);
                });
                
                optionsContainer.appendChild(dropdownOption);
            });
        }
        
        // Function to select an option
        function selectOption(value, text) {
            selectedDisplay.textContent = text;
            selectedDisplay.setAttribute('data-value', value);
            selectElement.value = value;
            
            // Trigger change event
            const changeEvent = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(changeEvent);
            
            closeDropdown();
        }
        
        // Function to open dropdown
        function openDropdown() {
            // Close any other open dropdown
            closeAllDropdowns();
            
            // Set this as active dropdown
            activeDropdown = customDropdownContainer;
            
            // Open this dropdown
            customDropdownContainer.classList.add('active');
            optionsContainer.classList.add('show');
            selectedDisplay.setAttribute('aria-expanded', 'true');
            
            // Focus first option
            const firstOption = optionsContainer.querySelector('.dropdown-option');
            if (firstOption) {
                firstOption.focus();
            }
        }
        
        // Function to close dropdown
        function closeDropdown() {
            customDropdownContainer.classList.remove('active');
            optionsContainer.classList.remove('show');
            selectedDisplay.setAttribute('aria-expanded', 'false');
            
            if (activeDropdown === customDropdownContainer) {
                activeDropdown = null;
            }
        }
        
        // Event listeners
        selectedDisplay.addEventListener('click', function(e) {
            e.stopPropagation();
            if (optionsContainer.classList.contains('show')) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });
        
        // Keyboard support
        selectedDisplay.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (optionsContainer.classList.contains('show')) {
                        closeDropdown();
                    } else {
                        openDropdown();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeDropdown();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (!optionsContainer.classList.contains('show')) {
                        openDropdown();
                    } else {
                        const firstOption = optionsContainer.querySelector('.dropdown-option');
                        if (firstOption) firstOption.focus();
                    }
                    break;
            }
        });
        
        // Keyboard navigation in options
        optionsContainer.addEventListener('keydown', function(e) {
            const options = Array.from(optionsContainer.querySelectorAll('.dropdown-option'));
            const currentIndex = options.indexOf(document.activeElement);
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
                    options[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
                    options[prevIndex].focus();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (document.activeElement.classList.contains('dropdown-option')) {
                        document.activeElement.click();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeDropdown();
                    selectedDisplay.focus();
                    break;
            }
        });
        
        // Assemble dropdown
        customDropdownContainer.appendChild(selectedDisplay);
        customDropdownContainer.appendChild(optionsContainer);
        
        // Hide original select and insert custom dropdown
        selectElement.style.display = 'none';
        selectContainer.appendChild(customDropdownContainer);
        
        // Update options initially
        updateDropdownOptions();
        
        // Update when select changes programmatically
        selectElement.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption && selectedOption.value) {
                selectedDisplay.textContent = selectedOption.textContent;
                selectedDisplay.setAttribute('data-value', selectedOption.value);
            } else {
                selectedDisplay.textContent = getPlaceholderText(selectElement.id);
                selectedDisplay.setAttribute('data-value', '');
            }
            updateDropdownOptions();
        });
        
        return customDropdownContainer;
    }
    
    // Enhanced time dropdown creation
    function createCustomTimeDropdown(selectElement) {
        if (!selectElement) return;
        
        const selectContainer = selectElement.parentElement;
        
        // Remove existing custom dropdown
        const existingDropdown = selectContainer.querySelector('.custom-dropdown-container');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        // Create custom dropdown container
        const customDropdownContainer = document.createElement('div');
        customDropdownContainer.className = 'custom-dropdown-container';
        
        // Create selected display
        const selectedDisplay = document.createElement('div');
        selectedDisplay.className = 'selected-option';
        selectedDisplay.setAttribute('tabindex', '0');
        selectedDisplay.textContent = 'اختر الموعد';
        selectedDisplay.setAttribute('data-value', '');
        
        // Create dropdown options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'dropdown-options';
        
        // Add options with tags
        Array.from(selectElement.options).forEach((option, index) => {
            if (index === 0 && !option.value) return;
            
            const dropdownOption = document.createElement('div');
            dropdownOption.className = 'dropdown-option';
            dropdownOption.setAttribute('data-value', option.value);
            
            // Create time text span
            const timeText = document.createElement('span');
            timeText.className = 'time-text';
            timeText.textContent = option.textContent;
            
            // Create status tag
            const tag = document.createElement('span');
            const status = option.getAttribute('data-status') || 'available';
            const tagText = option.getAttribute('data-text') || '';
            tag.className = `new-badge tag-${status}`;
            tag.textContent = tagText;
            
            dropdownOption.appendChild(timeText);
            if (tagText) {
                dropdownOption.appendChild(tag);
            }
            
            // Add click event
            dropdownOption.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                const text = this.querySelector('.time-text')?.textContent || this.textContent;
                
                selectedDisplay.textContent = text;
                selectedDisplay.setAttribute('data-value', value);
                selectElement.value = value;
                
                const changeEvent = new Event('change', { bubbles: true });
                selectElement.dispatchEvent(changeEvent);
                
                closeAllDropdowns();
            });
            
            optionsContainer.appendChild(dropdownOption);
        });
        
        // Event listeners
        selectedDisplay.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close other dropdowns
            closeAllDropdowns();
            
            // Toggle this dropdown
            if (!optionsContainer.classList.contains('show')) {
                activeDropdown = customDropdownContainer;
                customDropdownContainer.classList.add('active');
                optionsContainer.classList.add('show');
            }
        });
        
        // Assemble and insert
        customDropdownContainer.appendChild(selectedDisplay);
        customDropdownContainer.appendChild(optionsContainer);
        selectElement.style.display = 'none';
        selectContainer.appendChild(customDropdownContainer);
        
        return customDropdownContainer;
    }
    
    // Utility functions
    function getPlaceholderText(selectId) {
        const placeholders = {
            'grade': 'اختر الصف',
            'section': 'اختر الشعبة',
            'group': 'اختر المجموعة',
            'time': 'اختر الموعد'
        };
        return placeholders[selectId] || 'اختر';
    }
    
    function closeAllDropdowns() {
        document.querySelectorAll('.custom-dropdown-container').forEach(container => {
            container.classList.remove('active');
            const options = container.querySelector('.dropdown-options');
            if (options) {
                options.classList.remove('show');
            }
            const selectedOption = container.querySelector('.selected-option');
            if (selectedOption) {
                selectedOption.setAttribute('aria-expanded', 'false');
            }
        });
        activeDropdown = null;
    }
    
    // Global event listeners
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-dropdown-container')) {
            closeAllDropdowns();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });

    // Handle grade change
    if (gradeSelect) {
        gradeSelect.addEventListener('change', function() {
            const grade = this.value;
            
            // Show/hide section selection for 2nd and 3rd grade
            if (sectionGroup && sectionSelect) {
                if (grade === 'third' || grade === 'second') {
                    sectionGroup.style.display = 'block';
                    sectionSelect.required = true;
                    
                    // Clear and update section options
                    sectionSelect.innerHTML = '<option value="">اختر الشعبة</option>';
                    
                    if (grade === 'third') {
                        // For third grade: show general (رياضة) and statistics (إحصاء)
                        const thirdGradeOptions = [
                            ['general', sectionNames['general']],
                            ['statistics', sectionNames['statistics']]
                        ];
                        thirdGradeOptions.forEach(([value, name]) => {
                            const option = document.createElement('option');
                            option.value = value;
                            option.textContent = name;
                            sectionSelect.appendChild(option);
                        });
                        
                        // Show third grade info modal with a slight delay for better UX
                        setTimeout(() => thirdGradeModal.show(), 300);
                    } else if (grade === 'second') {
                        // For second grade: show science and arts
                        const secondGradeOptions = [
                            ['science', sectionNames['science']],
                            ['arts', sectionNames['arts']]
                        ];
                        secondGradeOptions.forEach(([value, name]) => {
                            const option = document.createElement('option');
                            option.value = value;
                            option.textContent = name;
                            sectionSelect.appendChild(option);
                        });
                    }
                    
                    // Recreate the custom dropdown for the section select
                    createCustomDropdown(sectionSelect);
                } else {
                    sectionGroup.style.display = 'none';
                    sectionSelect.required = false;
                    sectionSelect.value = '';
                }
            }

            updateGroupOptions(grade, sectionSelect?.value);
        });
    }

    // Handle section change for 3rd grade
    if (sectionSelect) {
        sectionSelect.addEventListener('change', function() {
            const grade = gradeSelect.value;
            const section = this.value;
            updateGroupOptions(grade, section);
        });
    }

    // Handle group change
    if (groupSelect) {
        groupSelect.addEventListener('change', function() {
            const grade = gradeSelect.value;
            const section = sectionSelect?.value;
            const group = this.value;
            updateTimeOptions(grade, group, section);
        });
    }

    function updateGroupOptions(grade, section = null) {
        if (!groupSelect) return;

        groupSelect.innerHTML = '<option value="">اختر المجموعة</option>';
        timeSelect.innerHTML = '<option value="">اختر الموعد</option>';

        if (!grade || (grade === 'third' && !section)) {
            groupSelect.disabled = true;
            timeSelect.disabled = true;
            return;
        }

        const availableGroups = getAvailableGroups(grade, section);
        availableGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = groupNames[group];
            groupSelect.appendChild(option);
        });

        // Trigger change event to update custom dropdown
        const event = new Event('change', { bubbles: true });
        groupSelect.dispatchEvent(event);

        groupSelect.disabled = false;
        timeSelect.disabled = true;
    }

    function updateTimeOptions(grade, group, section = null) {
        if (!timeSelect) return;
        
        // Clear existing select
        timeSelect.innerHTML = '<option value="">اختر الموعد</option>';
        
        if (!grade || !group || (grade === 'third' && !section)) {
            timeSelect.disabled = true;
            return;
        }
        
        // Get available times
        const availableTimes = getAvailableTimes(grade, group, section);
        
        // Add options to the select element
        availableTimes.forEach(({ time, displayTime, availability }) => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = displayTime;
            option.setAttribute('data-status', availability.status);
            option.setAttribute('data-text', availability.text);
            timeSelect.appendChild(option);
        });
        
        // Create custom dropdown for time select
        createCustomTimeDropdown(timeSelect);
        
        timeSelect.disabled = false;
    }

    // Form submission handler
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            // Check if trying to register for a restricted group
            const grade = formData.get('grade');
            const section = formData.get('section');
            const group = formData.get('days_group');
            const timeSlot = formData.get('time_slot');
            
            if (isRestrictedGroup(grade, section, group, timeSlot)) {
                restrictedGroupsModal.show();
                return;
            }

            try {
                const result = await submitRegistration(formData);
                
                if (!result.success) {
                    // Handle different error types with appropriate modals
                    if (result.error.includes('مكتملة')) {
                        restrictedGroupsModal.show();
                        return;
                    } else if (result.error.includes('مسجل بالفعل') || 
                              result.errorCode === '23505' || 
                              result.error.includes('duplicate key value')) {
                        // Show duplicate registration modal
                        duplicateRegistrationModal.show(formData.get('student_phone'));
                        return;
                    }
                    throw new Error(result.error);
                }

                // Show success modal with registration data
                successModal.show({
                    studentName: formData.get('student_name'),
                    gradeName: gradeNames[formData.get('grade')],
                    studentPhone: formData.get('student_phone'),
                    parentPhone: formData.get('parent_phone'),
                    sectionName: sectionNames[formData.get('section')] || null,
                    groupName: groupNames[formData.get('days_group')] || null,
                    timeSlot: formData.get('time_slot')
                });

                form.reset();
                initializeCustomDropdowns();
            } catch (error) {
                console.error('Error submitting form:', error);
                
                // Check if it's a duplicate key error from the database
                if (error.message.includes('duplicate key value') || 
                    error.message.includes('idx_unique_student_registration')) {
                    duplicateRegistrationModal.show(formData.get('student_phone'));
                } else {
                    // For other errors, show a generic alert
                    alert(error.message || 'حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
                }
            }
        });
    }

    // Handle WhatsApp sharing
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', async () => {
            try {
                const successContent = document.querySelector('.success-content');
                const blob = await captureReceipt(successContent);
                const file = new File([blob], 'receipt.png', { type: 'image/png' });
                
                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'تأكيد التسجيل',
                        text: 'إيصال التسجيل في مركز أ/ أشرف حسن للرياضيات'
                    });
                } else {
                    // Fallback for browsers that don't support sharing
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'receipt.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            } catch (error) {
                console.error('Error sharing:', error);
                alert('حدث خطأ أثناء مشاركة الإيصال. يرجى المحاولة مرة أخرى.');
            }
        });
    }

    // Image capture function
    async function captureReceipt(element) {
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: null,
                width: element.offsetWidth * 2,
                height: element.offsetHeight * 2
            });

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                }, 'image/png', 1.0);
            });
        } catch (error) {
            console.error('Error capturing receipt:', error);
            throw error;
        }
    }
});
