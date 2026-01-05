// Communication Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('communicationModal');
    const communicationItems = document.querySelectorAll('.communication-item');
    const modalOverlay = document.querySelector('.communication-modal-overlay');
    const closeBtn = document.querySelector('.communication-modal-close');
    const showMoreBtn = document.getElementById('showMoreComm');
    
    // Show More functionality
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            const hiddenItems = document.querySelectorAll('.communication-item.hidden-comm');
            hiddenItems.forEach(item => {
                item.classList.remove('hidden-comm');
            });
            // Hide the button after showing all items
            this.classList.add('hidden');
        });
    }
    
    // Open modal when communication item is clicked
    communicationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the communication data
            const modalData = this.querySelector('.communication-modal-data');
            
            // Extract communication data
            const subject = modalData.querySelector('.communication-modal-subject').textContent;
            const date = modalData.querySelector('.communication-modal-date').textContent;
            const body = modalData.querySelector('.communication-modal-body').innerHTML;
            
            // Populate modal
            modal.querySelector('.modal-comm-subject').textContent = subject;
            modal.querySelector('.modal-comm-date').textContent = date;
            modal.querySelector('.modal-comm-body').innerHTML = body;
            
            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when overlay is clicked
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close modal when ESC key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

