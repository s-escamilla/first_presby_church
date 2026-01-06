(() => {
  // src/assets/js/calendar-view.js
  document.addEventListener("DOMContentLoaded", function() {
    const viewButtons = document.querySelectorAll(".view-btn");
    const calendarView = document.querySelector(".events-calendar-view");
    const listView = document.querySelector(".events-list-view");
    if (!calendarView || !listView) return;
    let currentDate = /* @__PURE__ */ new Date();
    let selectedDate = null;
    const eventCards = document.querySelectorAll(".event-card");
    const now = /* @__PURE__ */ new Date();
    eventCards.forEach((card) => {
      const eventDate = new Date(card.dataset.eventDate);
      if (eventDate < now) {
        card.classList.add("past-event");
      }
    });
    const dateBadges = document.querySelectorAll(".event-card-date-badge");
    dateBadges.forEach((badge) => {
      const dateStr = badge.dataset.date;
      if (dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleDateString("en-US", { month: "short" });
        badge.querySelector(".event-day").textContent = day;
        badge.querySelector(".event-month").textContent = month;
      }
    });
    viewButtons.forEach((btn) => {
      btn.addEventListener("click", function() {
        const view = this.dataset.view;
        viewButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        if (view === "calendar") {
          calendarView.classList.add("active-view");
          listView.classList.remove("active-view");
        } else {
          calendarView.classList.remove("active-view");
          listView.classList.add("active-view");
        }
      });
    });
    const showMoreBtn = document.querySelector(".event-show-more");
    if (showMoreBtn) {
      showMoreBtn.addEventListener("click", function() {
        const hiddenEvents = document.querySelectorAll(".event-card.hidden-event");
        hiddenEvents.forEach((event) => {
          event.classList.remove("hidden-event");
        });
        this.style.display = "none";
      });
    }
    function getEventsData() {
      const eventsDataItems = document.querySelectorAll(".event-data-item");
      return Array.from(eventsDataItems).map((item) => ({
        title: item.dataset.title,
        date: new Date(item.dataset.date),
        location: item.dataset.location,
        details: item.dataset.details
      }));
    }
    const events = getEventsData();
    const prevMonthBtn = document.querySelector(".prev-month");
    const nextMonthBtn = document.querySelector(".next-month");
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      });
    }
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      });
    }
    function renderCalendar() {
      const monthYearElement = document.querySelector(".calendar-month-year");
      const calendarGrid = document.querySelector(".calendar-grid");
      if (!monthYearElement || !calendarGrid) return;
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      monthYearElement.textContent = `${monthNames[month]} ${year}`;
      calendarGrid.innerHTML = "";
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      dayNames.forEach((day) => {
        const dayHeader = document.createElement("div");
        dayHeader.className = "calendar-day-header";
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
      });
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-day empty";
        calendarGrid.appendChild(emptyCell);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.className = "calendar-day";
        const cellDate = new Date(year, month, day);
        const dayEvents = events.filter(
          (event) => event.date.toDateString() === cellDate.toDateString()
        );
        const dayNumber = document.createElement("div");
        dayNumber.className = "calendar-day-number";
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);
        if (dayEvents.length > 0) {
          dayCell.classList.add("has-event");
          const eventsContainer = document.createElement("div");
          eventsContainer.className = "calendar-day-events";
          dayEvents.forEach((event) => {
            const eventChip = document.createElement("div");
            eventChip.className = "event-chip";
            const eventTime = document.createElement("span");
            eventTime.className = "event-chip-time";
            eventTime.textContent = formatTime(event.date);
            const eventTitle = document.createElement("span");
            eventTitle.className = "event-chip-title";
            eventTitle.textContent = event.title;
            eventChip.appendChild(eventTime);
            eventChip.appendChild(eventTitle);
            eventsContainer.appendChild(eventChip);
          });
          dayCell.appendChild(eventsContainer);
        }
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(cellDate);
        checkDate.setHours(0, 0, 0, 0);
        if (checkDate.toDateString() === today.toDateString()) {
          dayCell.classList.add("today");
        }
        if (checkDate < today) {
          dayCell.classList.add("past-day");
        }
        if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
          dayCell.classList.add("selected");
        }
        dayCell.addEventListener("click", () => {
          if (dayEvents.length > 0) {
            selectedDate = cellDate;
            renderCalendar();
            showEventsForDate(cellDate, dayEvents);
          }
        });
        calendarGrid.appendChild(dayCell);
      }
    }
    function showEventsForDate(date, dayEvents) {
      const modal2 = document.getElementById("calendarModal");
      if (!modal2) return;
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      const formattedDate = date.toLocaleDateString("en-US", options);
      const modalBody = modal2.querySelector(".calendar-modal-body");
      if (!modalBody) return;
      modalBody.innerHTML = "";
      const dateHeader = document.createElement("h2");
      dateHeader.className = "modal-date-header";
      dateHeader.textContent = formattedDate;
      modalBody.appendChild(dateHeader);
      const eventCount = document.createElement("p");
      eventCount.className = "modal-event-count";
      eventCount.textContent = `${dayEvents.length} Event${dayEvents.length > 1 ? "s" : ""}`;
      modalBody.appendChild(eventCount);
      const eventsContainer = document.createElement("div");
      eventsContainer.className = "modal-events-container";
      dayEvents.forEach((event, index) => {
        const eventCard = document.createElement("div");
        eventCard.className = "modal-event-card";
        const cardHeader = document.createElement("span");
        const title = document.createElement("p");
        title.className = "modal-event-title";
        title.textContent = event.title;
        cardHeader.appendChild(title);
        const time = document.createElement("p");
        time.className = "modal-event-time";
        time.innerHTML = `<strong>Time:</strong> ${formatTime(event.date)}`;
        cardHeader.appendChild(time);
        if (event.location) {
          const location = document.createElement("p");
          location.className = "modal-event-location";
          location.innerHTML = `<strong>Location:</strong> ${event.location}`;
          cardHeader.appendChild(location);
        }
        eventCard.appendChild(cardHeader);
        if (event.details) {
          const details = document.createElement("div");
          details.className = "modal-event-details";
          details.innerHTML = event.details;
          eventCard.appendChild(details);
        }
        eventsContainer.appendChild(eventCard);
      });
      modalBody.appendChild(eventsContainer);
      modal2.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    const modal = document.getElementById("calendarModal");
    if (modal) {
      const closeBtn = modal.querySelector(".calendar-modal-close");
      const overlay = modal.querySelector(".calendar-modal-overlay");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          modal.classList.remove("active");
          document.body.style.overflow = "";
        });
      }
      if (overlay) {
        overlay.addEventListener("click", () => {
          modal.classList.remove("active");
          document.body.style.overflow = "";
        });
      }
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
          modal.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    }
    function formatTime(date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
    }
    renderCalendar();
  });
})();
//# sourceMappingURL=calendar-view.js.map
