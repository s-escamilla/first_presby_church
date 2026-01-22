// Collections API Handler
// Fetches and renders collections data from external API

class CollectionsAPI {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl || '/api/database'; // Default to local API
        this.cache = {
            events: null,
            communications: null,
            staff: null
        };
    }

    // Generic API fetch method
    async fetchCollection(collectionName) {
        // Check cache first
        if (this.cache[collectionName]) {
            return this.cache[collectionName];
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/index.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    functionname: 'get',
                    collection: collectionName,
                    arguments: {}
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.cache[collectionName] = result.result;
                return result.result;
            } else {
                throw new Error(result.error || 'Failed to fetch collection');
            }
        } catch (error) {
            console.error(`Error fetching ${collectionName}:`, error);
            throw error;
        }
    }

    // Get events
    async getEvents() {
        return this.fetchCollection('events');
    }

    // Get communications  
    async getCommunications() {
        return this.fetchCollection('communications');
    }

    // Get staff (if using API for staff too)
    async getStaff() {
        return this.fetchCollection('staff');
    }

    // Helper: Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Helper: Format datetime
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // Helper: Parse markdown-style text (basic)
    parseMarkdown(text) {
        if (!text) return '';
        // Basic markdown parsing - you can enhance this
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    // ========== RENDER EVENTS ==========
    
    async renderEvents(containerSelector = '.collections-section.events') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        // Show loading state
        const eventsContainer = container.querySelector('.collections-layout.events');
        if (eventsContainer) {
            eventsContainer.innerHTML = '<div class="loading">Loading events...</div>';
        }

        try {
            const events = await this.getEvents();
            
            if (!events || events.length === 0) {
                eventsContainer.innerHTML = '<div class="no-data">No events available</div>';
                return;
            }

            // Sort events by date
            events.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Render event details (left side)
            const firstEvent = events[0];
            const eventDetailsHTML = `
                <div class="event-details">
                    <div class="event-details-content" data-event-id="0">
                        <h3 class="event-title">${firstEvent.title}</h3>
                        <p class="event-date">${this.formatDateTime(firstEvent.date)}</p>
                        <div class="event-location">
                            <p>${firstEvent.location}</p>
                        </div>
                        ${firstEvent.details ? `
                            <div class="event-full-details">
                                ${this.parseMarkdown(firstEvent.details)}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

            // Render event list (right side)
            const eventListHTML = events.map((event, index) => `
                <div class="event-item ${index === 0 ? 'active' : ''}" 
                     data-event-index="${index}" 
                     data-event-date="${event.date}">
                    <h4 class="event-item-title">${event.title}</h4>
                    <p class="event-item-date">${this.formatDateTime(event.date)}</p>
                    <div class="event-item-data" style="display: none;">
                        <span class="event-location">${event.location}</span>
                        <span class="event-details">${event.details || ''}</span>
                    </div>
                </div>
            `).join('');

            const eventListContainerHTML = `
                <div class="event-list">
                    ${eventListHTML}
                </div>
            `;

            // Modal HTML
            const modalHTML = `
                <div class="popup-modal" id="eventModal">
                    <div class="event-modal-overlay modal-overlay"></div>
                    <div class="popup-modal-content">
                        <button class="event-modal-close modal-close">&times;</button>
                        <div class="event-modal-body">
                            <h3 class="modal-event-title"></h3>
                            <p class="modal-event-date"></p>
                            <div class="modal-event-location"></div>
                            <div class="modal-event-details"></div>
                        </div>
                    </div>
                </div>
            `;

            eventsContainer.innerHTML = eventDetailsHTML + eventListContainerHTML + modalHTML;

            // Dispatch custom event to notify events.js that data is ready
            window.dispatchEvent(new CustomEvent('eventsDataLoaded', { 
                detail: { events } 
            }));

        } catch (error) {
            eventsContainer.innerHTML = `<div class="error">Error loading events: ${error.message}</div>`;
        }
    }

    // ========== RENDER CALENDAR VIEW ==========
    
    async renderCalendarView(containerSelector = '.collections-section.calendar_view') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        try {
            const events = await this.getEvents();
            
            if (!events || events.length === 0) {
                const dataContainer = container.querySelector('.events-data');
                if (dataContainer) {
                    dataContainer.innerHTML = '<div class="no-data">No events available</div>';
                }
                const listContainer = container.querySelector('.event-cards-container');
                if (listContainer) {
                    listContainer.innerHTML = '<div class="no-data">No events available</div>';
                }
                return;
            }

            // Sort events by date
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Store events data for calendar.js to use
            window.calendarEventsData = events;

            // 1. Hidden data for calendar view
            const eventsDataHTML = events.map(event => `
                <div class="event-data-item" 
                     data-title="${event.title}"
                     data-date="${event.date}"
                     data-location="${event.location || ''}"
                     data-details="${this.escapeHtml(event.details || '')}">
                </div>
            `).join('');

            const dataContainer = container.querySelector('.events-data');
            if (dataContainer) {
                dataContainer.innerHTML = eventsDataHTML;
            }

            // 2. Event cards for list view
            const eventCardsHTML = events.map((event, index) => {
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
                const time = eventDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                const year = eventDate.getFullYear();

                return `
                    <div class="event-card ${index >= 6 ? 'hidden-event' : ''}" data-event-date="${event.date}">
                        <div class="event-card-date-badge" data-date="${event.date}">
                            <div class="event-day">${day}</div>
                            <div class="event-month">${month}</div>
                            <div class="event-year">${year}</div>
                        </div>
                        <div class="event-card-content">
                            <h4 class="event-card-title">${event.title}</h4>
                            <p class="event-card-time">${time}</p>
                            <p class="event-card-location">${event.location || 'Location TBD'}</p>
                            ${event.details ? `<p class="event-card-details">${event.details.substring(0, 100)}${event.details.length > 100 ? '...' : ''}</p>` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            const showMoreButton = events.length > 6 ? `
                <button class="event-show-more">Show More Events</button>
            ` : '';

            const listContainer = container.querySelector('.event-cards-container');
            if (listContainer) {
                listContainer.innerHTML = eventCardsHTML + showMoreButton;
            }

            // Dispatch custom event to notify calendar-view.js that data is ready
            window.dispatchEvent(new CustomEvent('calendarDataLoaded', { 
                detail: { events } 
            }));

        } catch (error) {
            console.error('Error loading calendar events:', error);
            const dataContainer = container.querySelector('.events-data');
            if (dataContainer) {
                dataContainer.innerHTML = `<div class="error">Error loading events: ${error.message}</div>`;
            }
            const listContainer = container.querySelector('.event-cards-container');
            if (listContainer) {
                listContainer.innerHTML = `<div class="error">Error loading events: ${error.message}</div>`;
            }
        }
    }

    // Helper: Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ========== RENDER COMMUNICATIONS ==========
    
    async renderCommunications(containerSelector = '.collections-section.communications') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const commsContainer = container.querySelector('.communication-list');
        if (commsContainer) {
            commsContainer.innerHTML = '<div class="loading">Loading communications...</div>';
        }

        try {
            const communications = await this.getCommunications();
            
            if (!communications || communications.length === 0) {
                commsContainer.innerHTML = '<div class="no-data">No communications available</div>';
                return;
            }

            // Sort by created_at, most recent first (DB uses created_at, not date)
            communications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const commsHTML = communications.map((comm, index) => `
                <div class="communication-item ${index >= 3 ? 'hidden-comm' : ''}" data-comm-index="${index}">
                    <div class="communication-header">
                        <button class="communication-button">Click to view info</button>
                        <h4 class="communication-subject">${comm.subject}</h4>
                        <p class="communication-date">${this.formatDate(comm.created_at)}</p>
                    </div>
                    <div class="communication-modal-data" style="display: none;">
                        <div class="communication-modal-subject">${comm.subject}</div>
                        <div class="communication-modal-date">${this.formatDate(comm.created_at)}</div>
                        <div class="communication-modal-body">${this.parseMarkdown(comm.content || '')}</div>
                    </div>
                </div>
            `).join('');

            const showMoreButton = communications.length > 3 ? `
                <div class="communication-show-more-container">
                    <button class="communication-show-more" id="showMoreComm">Show More</button>
                </div>
            ` : '';

            const modalHTML = `
                <div class="popup-modal" id="communicationModal">
                    <div class="communication-modal-overlay modal-overlay"></div>
                    <div class="popup-modal-content">
                        <button class="communication-modal-close modal-close">&times;</button>
                        <div class="communication-modal-body-container">
                            <h3 class="modal-comm-subject"></h3>
                            <p class="modal-comm-date"></p>
                            <div class="modal-comm-body"></div>
                        </div>
                    </div>
                </div>
            `;

            const parentContainer = container.querySelector('.collections-layout');
            if (parentContainer) {
                parentContainer.innerHTML = `
                    <div class="communication-list">${commsHTML}</div>
                    ${showMoreButton}
                    ${modalHTML}
                `;
            }

            // Dispatch custom event to notify communication-modal.js that data is ready
            window.dispatchEvent(new CustomEvent('communicationsDataLoaded', { 
                detail: { communications } 
            }));

        } catch (error) {
            commsContainer.innerHTML = `<div class="error">Error loading communications: ${error.message}</div>`;
        }
    }

    // ========== INITIALIZE ALL COLLECTIONS ==========
    
    async initializeAll() {
        // Find all collection sections and render them
        const eventsSections = document.querySelectorAll('.collections-section.events');
        const calendarSections = document.querySelectorAll('.collections-section.calendar_view');
        const commsSections = document.querySelectorAll('.collections-section.communications');

        const promises = [];

        eventsSections.forEach(section => {
            promises.push(this.renderEvents(`.collections-section.events`));
        });

        calendarSections.forEach(section => {
            promises.push(this.renderCalendarView(`.collections-section.calendar_view`));
        });

        commsSections.forEach(section => {
            promises.push(this.renderCommunications(`.collections-section.communications`));
        });

        await Promise.all(promises);
    }
}

// Export for use
window.CollectionsAPI = CollectionsAPI;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // You can change this URL to your external API server later
    // const apiUrl = window.location.hostname =='localhost'?'api/database':'http://167.172.22.76/api/database';
    // if(window.location.hostname !== 'localhost' && window.location.hostname !== ''){
    // const apiUrl = '/api/database'; // Change to 'https://your-api-server.com' later
    // }else{
    const apiUrl = '/api/database';
    // }
    const collectionsAPI = new CollectionsAPI(apiUrl);
    collectionsAPI.initializeAll();
});
