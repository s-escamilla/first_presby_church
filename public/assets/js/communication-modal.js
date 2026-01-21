(() => {
  // src/assets/js/communication-modal.js
  document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("communicationModal");
    const communicationItems = document.querySelectorAll(".communication-item");
    const modalOverlay = document.querySelector(".communication-modal-overlay");
    const closeBtn = document.querySelector(".communication-modal-close");
    const showMoreBtn = document.getElementById("showMoreComm");
    if (showMoreBtn) {
      showMoreBtn.addEventListener("click", function() {
        const hiddenItems = document.querySelectorAll(".communication-item.hidden-comm");
        hiddenItems.forEach((item) => {
          item.classList.remove("hidden-comm");
        });
        this.classList.add("hidden");
      });
    }
    communicationItems.forEach((item) => {
      item.addEventListener("click", function(e) {
        e.preventDefault();
        const modalData = this.querySelector(".communication-modal-data");
        const subject = modalData.querySelector(".communication-modal-subject").textContent;
        const date = modalData.querySelector(".communication-modal-date").textContent;
        const body = modalData.querySelector(".communication-modal-body").innerHTML;
        modal.querySelector(".modal-comm-subject").textContent = subject;
        modal.querySelector(".modal-comm-date").textContent = date;
        modal.querySelector(".modal-comm-body").innerHTML = body;
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
      if (e.key === "Escape" && modal && modal.classList.contains("active")) {
        closeModal();
      }
    });
    function closeModal() {
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });
})();
//# sourceMappingURL=communication-modal.js.map
