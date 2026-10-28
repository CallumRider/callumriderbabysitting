
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const enquiryForm = document.getElementById("enquiry-form");
  const feedback = document.getElementById("form-feedback");
  const year = document.getElementById("year");
  const bookingDate = document.getElementById("booking-date");

  // Keep the copyright year up to date.
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Prevent parents from selecting a date in the past.
  if (bookingDate) {
    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    bookingDate.min = localToday;
  }

  // Mobile navigation.
  if (menuToggle && navLinks) {
    function closeMenu() {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    menuToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        navLinks.classList.contains("is-open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Build an enquiry message for the parent's chosen contact app.
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!enquiryForm.reportValidity()) {
        return;
      }

      const formData = new FormData(enquiryForm);

      const parentName = String(formData.get("parent-name") || "").trim();
      const date = String(formData.get("booking-date") || "");
      const startTime = String(formData.get("start-time") || "");
      const endTime = String(formData.get("end-time") || "");
      const children = String(formData.get("children") || "");
      const ages = String(formData.get("ages") || "").trim();
      const details = String(formData.get("details") || "").trim();

      const message = [
        "Babysitting enquiry",
        "",
        "Parent/guardian: " + parentName,
        "Date: " + date,
        "Time: " + startTime + " to " + endTime,
        "Number of children: " + children,
        "Children's ages: " + ages,
        details ? "Additional details: " + details : "",
        "",
        "Please let me know if you are available."
      ].filter(Boolean).join("\n");

      if (endTime <= startTime) {
        feedback.textContent =
          "Please check the times. For an overnight booking, mention this in the additional details and contact Callum directly.";
        return;
      }

      const phoneNumber = "07398156901";
      const emailAddress = "callumrider@icloud.com";
      const isPhone = /Android|iPhone|iPad|iPod|Mobile/i.test(
        navigator.userAgent
      );

      feedback.textContent = isPhone
        ? "Your messaging app should open with the enquiry ready to review. Please check the details before sending."
        : "Your email app should open with the enquiry ready to review. Please check the details before sending.";

      if (isPhone) {
        window.location.href =
          "sms:" + phoneNumber + "?&body=" + encodeURIComponent(message);
      } else {
        const subject = "Babysitting enquiry - " + parentName;
        window.location.href =
          "mailto:" + emailAddress +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(message);
      }
    });
  }
});
