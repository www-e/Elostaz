
// Smart Card Flip Functionality
document.addEventListener('DOMContentLoaded', function() {
    const flipButton = document.querySelector('.flip-button');
    const smartCard = document.querySelector('.smart-card');

    if (flipButton && smartCard) {
        flipButton.addEventListener('click', function() {
            smartCard.classList.toggle('flipped');
            flipButton.textContent = smartCard.classList.contains('flipped') ? ' وجه الكارت' : 'ضهر الكارت';
        });
    }
});
