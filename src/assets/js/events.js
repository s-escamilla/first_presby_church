// Events Section - Interactive Event List
document.addEventListener('DOMContentLoaded', function() {
    const eventItems = document.querySelectorAll('.event-item');
    const eventDetails = document.querySelector('.event-details');
    const eventModal = document.querySelector('.popup-modal');
    const eventModalOverlay = document.querySelector('.event-modal-overlay');
    const eventModalClose = document.querySelector('.event-modal-close');
    
    if (!eventItems.length) return;
    
    // Mark past events
    const now = new Date();
    eventItems.forEach(item => {
        const eventDate = new Date(item.dataset.eventDate);
        if (eventDate < now) {
            item.classList.add('past-event');
        }
    });
    
    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth < 768;
    }
    
    // Function to update event details
    function updateEventDetails(title, date, location, details) {
        let detailsHTML = `
            <div class="event-details-content">
                <h3 class="event-title">${title}</h3>
                <p class="event-date">${date}</p>
                <div class="event-location">
                    <p>${location}</p>
                </div>
        `;
        
        if (details && details.trim() !== '') {
            detailsHTML += `
                <div class="event-full-details">
                    <p>${details}</p>
                </div>
            `;
        }
        
        detailsHTML += `</div>`;
        
        return detailsHTML;
    }
    
    // Function to show modal (mobile)
    function showModal(title, date, location, details) {
        if (!eventModal) return;
        
        // Update modal content
        const modalTitle = eventModal.querySelector('.modal-event-title');
        const modalDate = eventModal.querySelector('.modal-event-date');
        const modalLocation = eventModal.querySelector('.modal-event-location');
        const modalDetails = eventModal.querySelector('.modal-event-details');
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalDate) modalDate.textContent = date;
        if (modalLocation) modalLocation.textContent = location;
        if (modalDetails) {
            if (details && details.trim() !== '') {
                modalDetails.textContent = details;
                modalDetails.style.display = 'block';
            } else {
                modalDetails.style.display = 'none';
            }
        }
        
        // Show modal
        eventModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close modal
    function closeModal() {
        if (!eventModal) return;
        eventModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners for modal close
    if (eventModalClose) {
        eventModalClose.addEventListener('click', closeModal);
    }
    
    if (eventModalOverlay) {
        eventModalOverlay.addEventListener('click', closeModal);
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && eventModal && eventModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Event item click handler
    eventItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            eventItems.forEach(el => el.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get event data from the clicked item
            const title = this.querySelector('.event-item-title').textContent;
            const date = this.querySelector('.event-item-date').textContent;
            const dataContainer = this.querySelector('.event-item-data');
            const location = dataContainer.querySelector('.event-location').textContent;
            const details = dataContainer.querySelector('.event-details').textContent;
            
            // On mobile, show modal; on desktop, update details panel
            if (isMobile()) {
                showModal(title, date, location, details);
            } else if (eventDetails) {
                // Update the details panel with smooth transition
                eventDetails.style.opacity = '0';
                
                setTimeout(() => {
                    eventDetails.innerHTML = updateEventDetails(title, date, location, details);
                    eventDetails.style.opacity = '1';
                }, 200);
            }
        });
    });
});
