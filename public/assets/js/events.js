(() => {
  // src/assets/js/events.js
  document.addEventListener("DOMContentLoaded", function() {
    const eventItems = document.querySelectorAll(".event-item");
    const eventDetails = document.querySelector(".event-details");
    const eventModal = document.querySelector(".popup-modal");
    const eventModalOverlay = document.querySelector(".event-modal-overlay");
    const eventModalClose = document.querySelector(".event-modal-close");
    if (!eventItems.length) return;
    const now = /* @__PURE__ */ new Date();
    eventItems.forEach((item) => {
      const eventDate = new Date(item.dataset.eventDate);
      if (eventDate < now) {
        item.classList.add("past-event");
      }
    });
    function isMobile() {
      return window.innerWidth < 768;
    }
    function updateEventDetails(title, date, location, details) {
      let detailsHTML = `
            <div class="event-details-content">
                <h3 class="event-title">${title}</h3>
                <p class="event-date">${date}</p>
                <div class="event-location">
                    <p>${location}</p>
                </div>
        `;
      if (details && details.trim() !== "") {
        detailsHTML += `
                <div class="event-full-details">
                    <p>${details}</p>
                </div>
            `;
      }
      detailsHTML += `</div>`;
      return detailsHTML;
    }
    function showModal(title, date, location, details) {
      if (!eventModal) return;
      const modalTitle = eventModal.querySelector(".modal-event-title");
      const modalDate = eventModal.querySelector(".modal-event-date");
      const modalLocation = eventModal.querySelector(".modal-event-location");
      const modalDetails = eventModal.querySelector(".modal-event-details");
      if (modalTitle) modalTitle.textContent = title;
      if (modalDate) modalDate.textContent = date;
      if (modalLocation) modalLocation.textContent = location;
      if (modalDetails) {
        if (details && details.trim() !== "") {
          modalDetails.textContent = details;
          modalDetails.style.display = "block";
        } else {
          modalDetails.style.display = "none";
        }
      }
      eventModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    function closeModal() {
      if (!eventModal) return;
      eventModal.classList.remove("active");
      document.body.style.overflow = "";
    }
    if (eventModalClose) {
      eventModalClose.addEventListener("click", closeModal);
    }
    if (eventModalOverlay) {
      eventModalOverlay.addEventListener("click", closeModal);
    }
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && eventModal && eventModal.classList.contains("active")) {
        closeModal();
      }
    });
    eventItems.forEach((item) => {
      item.addEventListener("click", function() {
        eventItems.forEach((el) => el.classList.remove("active"));
        this.classList.add("active");
        const title = this.querySelector(".event-item-title").textContent;
        const date = this.querySelector(".event-item-date").textContent;
        const dataContainer = this.querySelector(".event-item-data");
        const location = dataContainer.querySelector(".event-location").textContent;
        const details = dataContainer.querySelector(".event-details").textContent;
        if (isMobile()) {
          showModal(title, date, location, details);
        } else if (eventDetails) {
          eventDetails.style.opacity = "0";
          setTimeout(() => {
            eventDetails.innerHTML = updateEventDetails(title, date, location, details);
            eventDetails.style.opacity = "1";
          }, 200);
        }
      });
    });
  });
})();
//# sourceMappingURL=events.js.map
