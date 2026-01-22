// Communication Modal Functionality
// Uses event delegation to handle dynamically loaded communication items

document.addEventListener('DOMContentLoaded', function() {
    
    function closeModal() {
        const modal = document.getElementById('communicationModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Use event delegation for communication items
    document.body.addEventListener('click', function(e) {
        // Check if clicked element is a communication item or inside one
        const commItem = e.target.closest('.communication-item');
        if (!commItem) return;
        
        e.preventDefault();
        
        const modal = document.getElementById('communicationModal');
        if (!modal) return;
        
        // Get the communication data
        const modalData = commItem.querySelector('.communication-modal-data');
        if (!modalData) return;
        
        // Extract communication data
        const subject = modalData.querySelector('.communication-modal-subject')?.textContent || '';
        const date = modalData.querySelector('.communication-modal-date')?.textContent || '';
        const body = modalData.querySelector('.communication-modal-body')?.innerHTML || '';
        
        // Populate modal
        const modalSubject = modal.querySelector('.modal-comm-subject');
        const modalDate = modal.querySelector('.modal-comm-date');
        const modalBody = modal.querySelector('.modal-comm-body');
        
        if (modalSubject) modalSubject.textContent = subject;
        if (modalDate) modalDate.textContent = date;
        if (modalBody) modalBody.innerHTML = body;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Use event delegation for Show More button
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('#showMoreComm') || e.target.matches('.communication-show-more')) {
            const hiddenItems = document.querySelectorAll('.communication-item.hidden-comm');
            hiddenItems.forEach(item => {
                item.classList.remove('hidden-comm');
            });
            // Hide the button after showing all items
            e.target.classList.add('hidden');
            e.target.style.display = 'none';
        }
    });
    
    // Modal close handlers (also use event delegation)
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.communication-modal-close') || 
            e.target.matches('.communication-modal-overlay')) {
            closeModal();
        }
    });
    
    // Close modal when ESC key is pressed
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('communicationModal');
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
