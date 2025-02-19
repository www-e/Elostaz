// Google Sheets integration
export async function sendToGoogleSheets(data) {
    // Google Form URL
    const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd0GuqDFenUIh6YLHXEZM31hk8wuq8TvZZwWiIfIsAtfNIL4g/formResponse';
    
    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.setAttribute('name', 'hidden_iframe');
    iframe.setAttribute('id', 'hidden_iframe');
    iframe.setAttribute('style', 'display: none');
    document.body.appendChild(iframe);

    // Create form
    const form = document.createElement('form');
    form.setAttribute('action', FORM_URL);
    form.setAttribute('method', 'post');
    form.setAttribute('target', 'hidden_iframe');

    // Form data mapping
    const formFields = {
        'entry.1256825568': data[0][1], // studentName
        'entry.2113872397': data[0][2], // studentPhone
        'entry.408825990': data[0][3],  // parentPhone
        'entry.433721923': data[0][4],  // country
        'entry.1640854366': data[0][5], // studentGrade
        'entry.477566493': 'online',    // sessionType
        'entry.886530649': data[0][6],  // sessionDate
        'entry.863063401': data[0][7],  // sessionTime
        'entry.490872707': data[0][8]   // notes
    };

    // Add form fields
    Object.entries(formFields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', name);
        input.setAttribute('value', value || '');
        form.appendChild(input);
    });

    // Add form to document
    document.body.appendChild(form);

    return new Promise((resolve, reject) => {
        iframe.onload = function() {
            // Clean up
            setTimeout(() => {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
                resolve();
            }, 1000);
        };

        // Submit the form
        form.submit();
    });
}
