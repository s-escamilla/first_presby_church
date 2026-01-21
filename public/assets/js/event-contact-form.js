(() => {
  // src/assets/js/event-contact-form.js
  document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("eventContactForm");
    if (!form) return;
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", function(e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 0) {
          if (value.length <= 3) {
            value = `(${value}`;
          } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
          } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
          }
        }
        e.target.value = value;
      });
    }
    const eventDateInput = document.getElementById("eventDate");
    if (eventDateInput) {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      eventDateInput.setAttribute("min", today);
    }
    function validateField(field) {
      const errorElement = document.getElementById(`${field.id}Error`);
      let isValid = true;
      let errorMessage = "";
      if (errorElement) {
        errorElement.textContent = "";
      }
      field.classList.remove("invalid");
      if (field.hasAttribute("required") && !field.value.trim()) {
        isValid = false;
        errorMessage = "This field is required";
      }
      if (field.type === "email" && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
      }
      if (field.id === "phone" && field.value.trim()) {
        const phoneDigits = field.value.replace(/\D/g, "");
        if (phoneDigits.length !== 10) {
          isValid = false;
          errorMessage = "Please enter a valid 10-digit phone number";
        }
      }
      if (field.type === "date" && field.value) {
        const selectedDate = new Date(field.value);
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          isValid = false;
          errorMessage = "Event date must be in the future";
        }
      }
      if (!isValid && errorElement) {
        errorElement.textContent = errorMessage;
        field.classList.add("invalid");
      }
      return isValid;
    }
    const formFields = form.querySelectorAll("input, select, textarea");
    formFields.forEach((field) => {
      field.addEventListener("blur", function() {
        validateField(this);
      });
      field.addEventListener("input", function() {
        if (this.classList.contains("invalid")) {
          validateField(this);
        }
      });
    });
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      let isFormValid = true;
      formFields.forEach((field) => {
        if (!validateField(field)) {
          isFormValid = false;
        }
      });
      if (!isFormValid) {
        const firstError = form.querySelector(".invalid");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          firstError.focus();
        }
        return;
      }
      const submitBtn = form.querySelector(".submit-btn");
      const btnText = submitBtn.querySelector(".btn-text");
      const btnLoader = submitBtn.querySelector(".btn-loader");
      const successMessage = document.getElementById("successMessage");
      const errorMessage = document.getElementById("errorMessage");
      submitBtn.disabled = true;
      btnText.style.display = "none";
      btnLoader.style.display = "inline-flex";
      successMessage.style.display = "none";
      errorMessage.style.display = "none";
      const formData = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        eventType: document.getElementById("eventType").value,
        eventDate: document.getElementById("eventDate").value,
        eventDescription: document.getElementById("eventDescription").value.trim(),
        submittedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      try {
        if (window.location.hostname !== "localhost" && window.location.hostname !== "") {
          const apiEndpoint2 = form.dataset.apiEndpoint || "http://167.172.22.76/api/database/index.php";
        } else {
          const apiEndpoint2 = form.dataset.apiEndpoint || "/api/database/index.php";
        }
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            functionname: "create",
            collection: "eventRequests",
            arguments: formData
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        successMessage.style.display = "flex";
        form.reset();
        successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 1e4);
      } catch (error) {
        console.error("Form submission error:", error);
        const errorMessageText = document.getElementById("errorMessageText");
        errorMessageText.textContent = "Sorry, there was an error submitting your request. Please try again or contact us directly.";
        errorMessage.style.display = "flex";
        errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      } finally {
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoader.style.display = "none";
      }
    });
  });
})();
//# sourceMappingURL=event-contact-form.js.map
