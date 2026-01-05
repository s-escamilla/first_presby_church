// Calendar View Functionality for Events
document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const calendarView = document.querySelector('.events-calendar-view');
    const listView = document.querySelector('.events-list-view');
    
    if (!calendarView || !listView) return;
    
    let currentDate = new Date();
    let selectedDate = null;
    
    // Mark past event cards
    const eventCards = document.querySelectorAll('.event-card');
    const now = new Date();
    eventCards.forEach(card => {
        const eventDate = new Date(card.dataset.eventDate);
        if (eventDate < now) {
            card.classList.add('past-event');
        }
    });
    
    // Populate date badges in list view
    const dateBadges = document.querySelectorAll('.event-card-date-badge');
    dateBadges.forEach(badge => {
        const dateStr = badge.dataset.date;
        if (dateStr) {
            const date = new Date(dateStr);
            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            
            badge.querySelector('.event-day').textContent = day;
            badge.querySelector('.event-month').textContent = month;
        }
    });
    
    // View Toggle
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update button states
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle views
            if (view === 'calendar') {
                calendarView.classList.add('active-view');
                listView.classList.remove('active-view');
            } else {
                calendarView.classList.remove('active-view');
                listView.classList.add('active-view');
            }
        });
    });
    
    // Event List "View More" functionality
    const showMoreBtn = document.querySelector('.event-show-more');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            const hiddenEvents = document.querySelectorAll('.event-card.hidden-event');
            hiddenEvents.forEach(event => {
                event.classList.remove('hidden-event');
            });
            this.style.display = 'none';
        });
    }
    
    // Get events data
    function getEventsData() {
        const eventsDataItems = document.querySelectorAll('.event-data-item');
        return Array.from(eventsDataItems).map(item => ({
            title: item.dataset.title,
            date: new Date(item.dataset.date),
            location: item.dataset.location,
            details: item.dataset.details
        }));
    }
    
    const events = getEventsData();
    
    // Calendar navigation
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    // Render calendar
    function renderCalendar() {
        const monthYearElement = document.querySelector('.calendar-month-year');
        const calendarGrid = document.querySelector('.calendar-grid');
        
        if (!monthYearElement || !calendarGrid) return;
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Set month/year header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearElement.textContent = `${monthNames[month]} ${year}`;
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            const cellDate = new Date(year, month, day);
            
            // Get events for this day
            const dayEvents = events.filter(event => 
                event.date.toDateString() === cellDate.toDateString()
            );
            
            // Create day number element
            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-day-number';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);
            
            // Add event chips if there are events
            if (dayEvents.length > 0) {
                dayCell.classList.add('has-event');
                
                const eventsContainer = document.createElement('div');
                eventsContainer.className = 'calendar-day-events';
                
                dayEvents.forEach(event => {
                    const eventChip = document.createElement('div');
                    eventChip.className = 'event-chip';
                    
                    const eventTime = document.createElement('span');
                    eventTime.className = 'event-chip-time';
                    eventTime.textContent = formatTime(event.date);
                    
                    const eventTitle = document.createElement('span');
                    eventTitle.className = 'event-chip-title';
                    eventTitle.textContent = event.title;
                    
                    eventChip.appendChild(eventTime);
                    eventChip.appendChild(eventTitle);
                    eventsContainer.appendChild(eventChip);
                });
                
                dayCell.appendChild(eventsContainer);
            }
            
            // Check if today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const checkDate = new Date(cellDate);
            checkDate.setHours(0, 0, 0, 0);
            
            if (checkDate.toDateString() === today.toDateString()) {
                dayCell.classList.add('today');
            }
            
            // Check if past date
            if (checkDate < today) {
                dayCell.classList.add('past-day');
            }
            
            // Check if selected
            if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
                dayCell.classList.add('selected');
            }
            
            // Click handler
            dayCell.addEventListener('click', () => {
                if (dayEvents.length > 0) {
                    selectedDate = cellDate;
                    renderCalendar();
                    showEventsForDate(cellDate, dayEvents);
                }
            });
            
            calendarGrid.appendChild(dayCell);
        }
    }
    
    // Show events for selected date in modal
    function showEventsForDate(date, dayEvents) {
        const modal = document.getElementById('calendarModal');
        if (!modal) return;
        
        // Format date for header
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        // Get modal body
        const modalBody = modal.querySelector('.calendar-modal-body');
        if (!modalBody) return;
        
        // Clear existing content
        modalBody.innerHTML = '';
        
        // Add date header
        const dateHeader = document.createElement('h2');
        dateHeader.className = 'modal-date-header';
        dateHeader.textContent = formattedDate;
        modalBody.appendChild(dateHeader);
        
        // Add events count
        const eventCount = document.createElement('p');
        eventCount.className = 'modal-event-count';
        eventCount.textContent = `${dayEvents.length} Event${dayEvents.length > 1 ? 's' : ''}`;
        modalBody.appendChild(eventCount);
        
        // Add events container
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'modal-events-container';
        
        // Add each event
        dayEvents.forEach((event, index) => {
            const eventCard = document.createElement('div');
            eventCard.className = 'modal-event-card';
            
            const cardHeader = document.createElement('span');
            
            // Event title
            const title = document.createElement('p');
            title.className = 'modal-event-title';
            title.textContent = event.title;
            cardHeader.appendChild(title);
            
            // Event time
            const time = document.createElement('p');
            time.className = 'modal-event-time';
            time.innerHTML = `<strong>Time:</strong> ${formatTime(event.date)}`;
            cardHeader.appendChild(time);
            
            // Event location
            if (event.location) {
                const location = document.createElement('p');
                location.className = 'modal-event-location';
                location.innerHTML = `<strong>Location:</strong> ${event.location}`;
                cardHeader.appendChild(location);
            }
            eventCard.appendChild(cardHeader);
            // Event details
            if (event.details) {
                const details = document.createElement('div');
                details.className = 'modal-event-details';
                details.innerHTML = event.details;
                eventCard.appendChild(details);
            }
            
            eventsContainer.appendChild(eventCard);
        });
        
        modalBody.appendChild(eventsContainer);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal functionality
    const modal = document.getElementById('calendarModal');
    if (modal) {
        const closeBtn = modal.querySelector('.calendar-modal-close');
        const overlay = modal.querySelector('.calendar-modal-overlay');
        
        // Close on button click
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close on overlay click
        if (overlay) {
            overlay.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Format time
    function formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    // Initialize calendar
    renderCalendar();
});
