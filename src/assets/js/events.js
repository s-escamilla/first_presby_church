// Events Section - Interactive Event List
// Uses event delegation to handle dynamically loaded event items

document.addEventListener('DOMContentLoaded', function() {
    
    // Function to mark past events
    function markPastEvents() {
        const eventItems = document.querySelectorAll('.event-item');
        const now = new Date();
        eventItems.forEach(item => {
            const eventDate = new Date(item.dataset.eventDate);
            if (eventDate < now) {
                item.classList.add('past-event');
            }
        });
    }

    // Initial marking of past events (for static content)
    markPastEvents();
    
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
        const eventModal = document.querySelector('.popup-modal#eventModal');
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
        const eventModal = document.querySelector('.popup-modal#eventModal');
        if (!eventModal) return;
        eventModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Use event delegation on parent container for event items
    document.body.addEventListener('click', function(e) {
        // Check if clicked element is an event item or inside one
        const eventItem = e.target.closest('.event-item');
        if (!eventItem) return;
        
        // Remove active class from all items
        const eventItems = document.querySelectorAll('.event-item');
        eventItems.forEach(el => el.classList.remove('active'));
        
        // Add active class to clicked item
        eventItem.classList.add('active');
        
        // Get event data from the clicked item
        const titleEl = eventItem.querySelector('.event-item-title');
        const dateEl = eventItem.querySelector('.event-item-date');
        const dataContainer = eventItem.querySelector('.event-item-data');
        
        if (!titleEl || !dateEl || !dataContainer) return;
        
        const title = titleEl.textContent;
        const date = dateEl.textContent;
        const location = dataContainer.querySelector('.event-location')?.textContent || '';
        const details = dataContainer.querySelector('.event-details')?.textContent || '';
        
        // On mobile, show modal; on desktop, update details panel
        const eventDetails = document.querySelector('.event-details');
        
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

    // Modal close handlers (also use event delegation)
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.event-modal-close') || 
            e.target.matches('.event-modal-overlay')) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        const eventModal = document.querySelector('.popup-modal#eventModal');
        if (e.key === 'Escape' && eventModal && eventModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Listen for API data loaded and mark past events
    window.addEventListener('eventsDataLoaded', function() {
        markPastEvents();
    });
});