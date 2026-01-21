(() => {
  // src/assets/js/staff-modal.js
  document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("staffModal");
    const readMoreButtons = document.querySelectorAll(".read-more-btn");
    const modalOverlay = document.querySelector(".staff-modal-overlay");
    const closeBtn = document.querySelector(".staff-modal-close");
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        const staffCard = this.closest(".staff-card");
        const modalData = staffCard.querySelector(".staff-modal-data");
        const name = modalData.querySelector(".staff-modal-name").textContent;
        const title = modalData.querySelector(".staff-modal-title").textContent;
        const photo = modalData.querySelector(".staff-modal-photo").textContent;
        const date = modalData.querySelector(".staff-modal-date").textContent;
        const bio = modalData.querySelector(".staff-modal-bio").innerHTML;
        modal.querySelector(".modal-name").textContent = name;
        modal.querySelector(".modal-title").textContent = title;
        modal.querySelector(".modal-photo").src = photo;
        modal.querySelector(".modal-photo").alt = name;
        modal.querySelector(".modal-date").textContent = "Since: " + date;
        modal.querySelector(".modal-bio").innerHTML = bio;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener("click", closeModal);
    }
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });
    function closeModal() {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
})();
//# sourceMappingURL=staff-modal.js.map
