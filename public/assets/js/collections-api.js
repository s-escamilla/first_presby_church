(() => {
  // src/assets/js/collections-api.js
  var CollectionsAPI = class {
    constructor(apiBaseUrl) {
      this.apiBaseUrl = apiBaseUrl || "/api/database";
      this.cache = {
        events: null,
        communications: null,
        staff: null
      };
    }
    // Generic API fetch method
    async fetchCollection(collectionName) {
      if (this.cache[collectionName]) {
        return this.cache[collectionName];
      }
      try {
        const response = await fetch(`${this.apiBaseUrl}/index.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            functionname: "get",
            collection: collectionName,
            arguments: {}
          })
        });
        const result = await response.json();
        if (result.success) {
          this.cache[collectionName] = result.result;
          return result.result;
        } else {
          throw new Error(result.error || "Failed to fetch collection");
        }
      } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        throw error;
      }
    }
    // Get events
    async getEvents() {
      return this.fetchCollection("events");
    }
    // Get communications  
    async getCommunications() {
      return this.fetchCollection("communications");
    }
    // Get staff (if using API for staff too)
    async getStaff() {
      return this.fetchCollection("staff");
    }
    // Helper: Format date
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
    // Helper: Format datetime
    formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
    }
    // Helper: Parse markdown-style text (basic)
    parseMarkdown(text) {
      if (!text) return "";
      return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\n/g, "<br>");
    }
    // ========== RENDER EVENTS ==========
    async renderEvents(containerSelector = ".collections-section.events") {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      const eventsContainer = container.querySelector(".collections-layout.events");
      if (eventsContainer) {
        eventsContainer.innerHTML = '<div class="loading">Loading events...</div>';
      }
      try {
        const events = await this.getEvents();
        if (!events || events.length === 0) {
          eventsContainer.innerHTML = '<div class="no-data">No events available</div>';
          return;
        }
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
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
                        ` : ""}
                    </div>
                </div>
            `;
        const eventListHTML = events.map((event, index) => `
                <div class="event-item ${index === 0 ? "active" : ""}" 
                     data-event-index="${index}" 
                     data-event-date="${event.date}">
                    <h4 class="event-item-title">${event.title}</h4>
                    <p class="event-item-date">${this.formatDateTime(event.date)}</p>
                    <div class="event-item-data" style="display: none;">
                        <span class="event-location">${event.location}</span>
                        <span class="event-details">${event.details || ""}</span>
                    </div>
                </div>
            `).join("");
        const eventListContainerHTML = `
                <div class="event-list">
                    ${eventListHTML}
                </div>
            `;
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
        if (window.initializeEventHandlers) {
          window.initializeEventHandlers();
        }
      } catch (error) {
        eventsContainer.innerHTML = `<div class="error">Error loading events: ${error.message}</div>`;
      }
    }
    // ========== RENDER CALENDAR VIEW ==========
    async renderCalendarView(containerSelector = ".collections-section.calendar_view") {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      try {
        const events = await this.getEvents();
        window.calendarEventsData = events;
        const eventsDataHTML = events.map((event) => `
                <div class="event-data-item" 
                     data-title="${event.title}"
                     data-date="${event.date}"
                     data-location="${event.location}"
                     data-details="${event.details || ""}">
                </div>
            `).join("");
        const dataContainer = container.querySelector(".events-data");
        if (dataContainer) {
          dataContainer.innerHTML = eventsDataHTML;
        }
        if (window.initializeCalendar) {
          window.initializeCalendar();
        }
      } catch (error) {
        console.error("Error loading calendar events:", error);
      }
    }
    // ========== RENDER COMMUNICATIONS ==========
    async renderCommunications(containerSelector = ".collections-section.communications") {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      const commsContainer = container.querySelector(".communication-list");
      if (commsContainer) {
        commsContainer.innerHTML = '<div class="loading">Loading communications...</div>';
      }
      try {
        const communications = await this.getCommunications();
        if (!communications || communications.length === 0) {
          commsContainer.innerHTML = '<div class="no-data">No communications available</div>';
          return;
        }
        communications.sort((a, b) => new Date(b.date) - new Date(a.date));
        const commsHTML = communications.map((comm, index) => `
                <div class="communication-item ${index >= 3 ? "hidden-comm" : ""}" data-comm-index="${index}">
                    <div class="communication-header">
                        <button class="communication-button">Click to view info</button>
                        <h4 class="communication-subject">${comm.subject}</h4>
                        <p class="communication-date">${this.formatDate(comm.date)}</p>
                    </div>
                    <div class="communication-modal-data" style="display: none;">
                        <div class="communication-modal-subject">${comm.subject}</div>
                        <div class="communication-modal-date">${this.formatDate(comm.date)}</div>
                        <div class="communication-modal-body">${this.parseMarkdown(comm.content)}</div>
                    </div>
                </div>
            `).join("");
        const showMoreButton = communications.length > 3 ? `
                <div class="communication-show-more-container">
                    <button class="communication-show-more" id="showMoreComm">Show More</button>
                </div>
            ` : "";
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
        const parentContainer = container.querySelector(".collections-layout");
        if (parentContainer) {
          parentContainer.innerHTML = `
                    <div class="communication-list">${commsHTML}</div>
                    ${showMoreButton}
                    ${modalHTML}
                `;
        }
        if (window.initializeCommunicationHandlers) {
          window.initializeCommunicationHandlers();
        }
      } catch (error) {
        commsContainer.innerHTML = `<div class="error">Error loading communications: ${error.message}</div>`;
      }
    }
    // ========== INITIALIZE ALL COLLECTIONS ==========
    async initializeAll() {
      const eventsSections = document.querySelectorAll(".collections-section.events");
      const calendarSections = document.querySelectorAll(".collections-section.calendar_view");
      const commsSections = document.querySelectorAll(".collections-section.communications");
      const promises = [];
      eventsSections.forEach((section) => {
        promises.push(this.renderEvents(`.collections-section.events`));
      });
      calendarSections.forEach((section) => {
        promises.push(this.renderCalendarView(`.collections-section.calendar_view`));
      });
      commsSections.forEach((section) => {
        promises.push(this.renderCommunications(`.collections-section.communications`));
      });
      await Promise.all(promises);
    }
  };
  window.CollectionsAPI = CollectionsAPI;
  document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "/api/database";
    const collectionsAPI = new CollectionsAPI(apiUrl);
    collectionsAPI.initializeAll();
  });
})();
//# sourceMappingURL=collections-api.js.map
