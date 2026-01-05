// Communications Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('communicationsModal');
    const viewAllBtn = document.querySelector('.view-all-communications-btn');
    const modalOverlay = document.querySelector('.communications-modal-overlay');
    const closeBtn = document.querySelector('.communications-modal-close');
    const communicationItems = document.querySelectorAll('.communication-list-item');
    
    // Only proceed if communications elements exist
    if (!modal || !viewAllBtn) return;
    
    // Open modal when "View All Communications" is clicked
    viewAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
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
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Toggle communication item expansion
    communicationItems.forEach(item => {
        const header = item.querySelector('.communication-list-header');
        const content = item.querySelector('.communication-list-content');
        
        if (header && content) {
            header.addEventListener('click', function() {
                const isExpanded = item.classList.contains('expanded');
                
                if (isExpanded) {
                    // Collapse
                    item.classList.remove('expanded');
                    content.style.display = 'none';
                } else {
                    // Expand
                    item.classList.add('expanded');
                    content.style.display = 'block';
                }
            });
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Collapse all items when modal is closed
        communicationItems.forEach(item => {
            item.classList.remove('expanded');
            const content = item.querySelector('.communication-list-content');
            if (content) {
                content.style.display = 'none';
            }
        });
    }
});
