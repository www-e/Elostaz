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
    
    // Get form elements
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const parentPhoneInput = document.getElementById('parent_phone');
    const schoolInput = document.getElementById('school');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const successModalElement = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const registrationIdSpan = document.getElementById('registration-id');
    const errorModal = document.getElementById('error-modal');
    const closeErrorModalBtn = document.getElementById('close-error-modal');
    const errorModalMessage = document.getElementById('error-modal-message');
    
    // Populate section options for third grade
    if (sectionSelect) {
        const sections = ['أدبي', 'علمي علوم', 'علمي رياضة'];
        sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            sectionSelect.appendChild(option);
        });
    }
    
    // Initialize custom dropdowns for all select elements
    function initializeCustomDropdowns() {
        // Remove any existing custom dropdowns first
        document.querySelectorAll('.custom-dropdown-container').forEach(dropdown => {
            dropdown.parentElement.removeChild(dropdown);
        });
        
        // Create fresh custom dropdowns
        if (gradeSelect) createCustomDropdown(gradeSelect);
        if (sectionSelect) createCustomDropdown(sectionSelect);
        if (groupSelect) createCustomDropdown(groupSelect);
    }
    
    // Initialize all dropdowns
    initializeCustomDropdowns();

    // Handle grade change
    if (gradeSelect) {
        gradeSelect.addEventListener('change', function() {
            const grade = this.value;
            
            // Show/hide section selection for 3rd grade
            if (sectionGroup && sectionSelect) {
                if (grade === 'third') {
                    sectionGroup.style.display = 'block';
                    sectionSelect.required = true;
                    // Clear and update section options for third grade
                    sectionSelect.innerHTML = '<option value="">اختر الشعبة</option>';
                    Object.entries(sectionNames).forEach(([value, name]) => {
                        const option = document.createElement('option');
                        option.value = value;
                        option.textContent = name;
                        sectionSelect.appendChild(option);
                    });
                    // Show third grade info modal with a slight delay for better UX
                    setTimeout(() => thirdGradeModal.show(), 300);
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
        
        // Get the parent container of the select element
        const timeSelectContainer = timeSelect.parentElement;
        
        // Clear existing select and custom dropdown if it exists
        timeSelect.innerHTML = '<option value="">اختر الموعد</option>';
        const existingCustomDropdown = timeSelectContainer.querySelector('.custom-dropdown-container');
        if (existingCustomDropdown) {
            timeSelectContainer.removeChild(existingCustomDropdown);
        }
        
        if (!grade || !group || (grade === 'third' && !section)) {
            timeSelect.disabled = true;
            return;
        }
        
        // Get available times
        const availableTimes = getAvailableTimes(grade, group, section);
        
        // Add options to the select element
        availableTimes.forEach(({ time, displayTime, availability }) => {
            // Add to the hidden select element (for form submission)
            const option = document.createElement('option');
            option.value = time;
            option.textContent = displayTime;
            option.setAttribute('data-status', availability.status);
            option.setAttribute('data-text', availability.text);
            timeSelect.appendChild(option);
        });
        
        // Create custom dropdown for time select
        const customDropdown = createCustomTimeDropdown(timeSelect);
        
        timeSelect.disabled = false;
    }
    
    // Function to create custom dropdown specifically for time select
    function createCustomTimeDropdown(selectElement) {
        if (!selectElement) return;
        
        // Get the parent container of the select element
        const selectContainer = selectElement.parentElement;
        
        // Create custom dropdown container
        const customDropdownContainer = document.createElement('div');
        customDropdownContainer.className = 'custom-dropdown-container';
        
        // Create selected display
        const selectedDisplay = document.createElement('div');
        selectedDisplay.className = 'selected-option';
        selectedDisplay.textContent = 'اختر الموعد';
        selectedDisplay.setAttribute('data-value', '');
        
        // Create dropdown options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'dropdown-options';
        
        // Add options to custom dropdown (skip the first empty/placeholder option)
        Array.from(selectElement.options).forEach((option, index) => {
            // Skip empty placeholder options
            if (index === 0 && !option.value) return;
            
            // Create custom dropdown option
            const dropdownOption = document.createElement('div');
            dropdownOption.className = 'dropdown-option';
            dropdownOption.setAttribute('data-value', option.value);
            
            // Create option content with time and tag
            const timeText = document.createElement('span');
            timeText.className = 'time-text';
            timeText.textContent = option.textContent;
            
            const tag = document.createElement('span');
            const status = option.getAttribute('data-status') || 'available';
            const tagText = option.getAttribute('data-text') || '';
            tag.className = `new-badge tag-${status}`;
            tag.textContent = tagText;
            
            // Ensure proper contrast for tag text in dark mode
            if (status === 'limited') {
                tag.style.fontWeight = '700';
                tag.style.textShadow = '0px 0px 1px rgba(0,0,0,0.2)';
            }
            
            dropdownOption.appendChild(timeText);
            dropdownOption.appendChild(tag);
            
            optionsContainer.appendChild(dropdownOption);
        });
        
        // Assemble custom dropdown
        customDropdownContainer.appendChild(selectedDisplay);
        customDropdownContainer.appendChild(optionsContainer);
        
        // Insert custom dropdown after the select element
        selectElement.style.display = 'none'; // Hide the original select
        selectContainer.appendChild(customDropdownContainer);
        
        // Add event listeners for custom dropdown
        selectedDisplay.addEventListener('click', function() {
            // Close all other open dropdowns first
            document.querySelectorAll('.dropdown-options.show').forEach(dropdown => {
                if (dropdown !== optionsContainer) {
                    dropdown.classList.remove('show');
                }
            });
            
            // Toggle this dropdown
            optionsContainer.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!customDropdownContainer.contains(e.target)) {
                optionsContainer.classList.remove('show');
            }
        });
        
        // Handle option selection
        const dropdownOptions = optionsContainer.querySelectorAll('.dropdown-option');
        dropdownOptions.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const text = this.querySelector('.time-text')?.textContent || this.textContent;
                
                // Update selected display
                selectedDisplay.textContent = text;
                selectedDisplay.setAttribute('data-value', value);
                
                // Update hidden select for form submission
                selectElement.value = value;
                
                // Trigger change event on select
                const event = new Event('change', { bubbles: true });
                selectElement.dispatchEvent(event);
                
                // Close dropdown
                optionsContainer.classList.remove('show');
            });
        });
        
        return customDropdownContainer;
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
    
    // Function to create custom dropdowns for all select elements
    function createCustomDropdown(selectElement) {
        if (!selectElement) return;
        
        // Get the parent container of the select element
        const selectContainer = selectElement.parentElement;
        
        // Skip if already has a custom dropdown
        if (selectContainer.querySelector('.custom-dropdown-container')) return;
        
        // Create custom dropdown container
        const customDropdownContainer = document.createElement('div');
        customDropdownContainer.className = 'custom-dropdown-container';
        
        // Get the label text from the select element's label
        const labelText = selectContainer.querySelector('label')?.textContent || '';
        
        // Create selected display
        const selectedDisplay = document.createElement('div');
        selectedDisplay.className = 'selected-option';
        
        // Set initial text - if no selection, use placeholder text instead of label
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        if (selectedOption && selectedOption.value) {
            selectedDisplay.textContent = selectedOption.textContent;
        } else {
            // Use placeholder text based on the select element's ID
            switch(selectElement.id) {
                case 'grade':
                    selectedDisplay.textContent = 'اختر الصف';
                    break;
                case 'section':
                    selectedDisplay.textContent = 'اختر الشعبة';
                    break;
                case 'group':
                    selectedDisplay.textContent = 'اختر المجموعة';
                    break;
                case 'time':
                    selectedDisplay.textContent = 'اختر الموعد';
                    break;
                default:
                    selectedDisplay.textContent = 'اختر';
            }
        }
        
        selectedDisplay.setAttribute('data-value', selectElement.value);
        
        // Create dropdown options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'dropdown-options';
        
        // Add options to custom dropdown (skip the first empty/placeholder option)
        Array.from(selectElement.options).forEach((option, index) => {
            // Skip empty placeholder options
            if (index === 0 && !option.value) return;
            
            const dropdownOption = document.createElement('div');
            dropdownOption.className = 'dropdown-option';
            dropdownOption.textContent = option.textContent;
            dropdownOption.setAttribute('data-value', option.value);
            optionsContainer.appendChild(dropdownOption);
        });
        
        // Assemble custom dropdown
        customDropdownContainer.appendChild(selectedDisplay);
        customDropdownContainer.appendChild(optionsContainer);
        
        // Insert custom dropdown after the select element
        selectElement.style.display = 'none'; // Hide the original select
        selectContainer.appendChild(customDropdownContainer);
        
        // Add event listeners for custom dropdown
        selectedDisplay.addEventListener('click', function() {
            // Close all other open dropdowns first
            document.querySelectorAll('.dropdown-options.show').forEach(dropdown => {
                if (dropdown !== optionsContainer) {
                    dropdown.classList.remove('show');
                }
            });
            
            // Toggle this dropdown
            optionsContainer.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!customDropdownContainer.contains(e.target)) {
                optionsContainer.classList.remove('show');
            }
        });
        
        // Handle option selection
        const dropdownOptions = optionsContainer.querySelectorAll('.dropdown-option');
        dropdownOptions.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const text = this.textContent;
                
                // Update selected display
                selectedDisplay.textContent = text;
                selectedDisplay.setAttribute('data-value', value);
                
                // Update hidden select for form submission
                selectElement.value = value;
                
                // Trigger change event on select
                const event = new Event('change', { bubbles: true });
                selectElement.dispatchEvent(event);
                
                // Close dropdown
                optionsContainer.classList.remove('show');
            });
        });
        
        // Update custom dropdown when select changes programmatically
        selectElement.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption && selectedOption.value) {
                selectedDisplay.textContent = selectedOption.textContent;
                selectedDisplay.setAttribute('data-value', selectedOption.value);
            } else {
                // Reset to placeholder if no selection
                switch(selectElement.id) {
                    case 'grade':
                        selectedDisplay.textContent = 'اختر الصف';
                        break;
                    case 'section':
                        selectedDisplay.textContent = 'اختر الشعبة';
                        break;
                    case 'group':
                        selectedDisplay.textContent = 'اختر المجموعة';
                        break;
                    case 'time':
                        selectedDisplay.textContent = 'اختر الموعد';
                        break;
                    default:
                        selectedDisplay.textContent = 'اختر';
                }
            }
            
            // Update dropdown options
            optionsContainer.innerHTML = '';
            
            // Add options to dropdown (skip the first empty/placeholder option)
            Array.from(this.options).forEach((option, index) => {
                // Skip empty placeholder options
                if (index === 0 && !option.value) return;
                
                const dropdownOption = document.createElement('div');
                dropdownOption.className = 'dropdown-option';
                dropdownOption.textContent = option.textContent;
                dropdownOption.setAttribute('data-value', option.value);
                optionsContainer.appendChild(dropdownOption);
                
                // Re-add click event listener
                dropdownOption.addEventListener('click', function() {
                    const value = this.getAttribute('data-value');
                    const text = this.textContent;
                    
                    // Update selected display
                    selectedDisplay.textContent = text;
                    selectedDisplay.setAttribute('data-value', value);
                    
                    // Update hidden select for form submission
                    selectElement.value = value;
                    
                    // Trigger change event on select
                    const event = new Event('change', { bubbles: true });
                    selectElement.dispatchEvent(event);
                    
                    // Close dropdown
                    optionsContainer.classList.remove('show');
                });
            });
        });
        
        return customDropdownContainer;
    }
}); 