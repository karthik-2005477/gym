// IronPulse Fitness - Core Interactivity
// Handles navigation, smooth scrolling, animations, pricing toggle, form validation, and EmailJS integration.

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Navbar toggle (mobile)
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("a")) {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scrolling for in-page anchors with class .scroll-link
  const smoothLinks = document.querySelectorAll('a[href^="#"], a.scroll-link');
  smoothLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLAnchorElement)) return;

      const href = target.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const targetElement = document.querySelector(href);
      if (!targetElement) return;

      event.preventDefault();
      const rect = targetElement.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 76; // account for sticky header

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    });
  });

  // Scroll animations using IntersectionObserver
  const animatedElements = document.querySelectorAll("[data-animate]");
  if ("IntersectionObserver" in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for older browsers
    animatedElements.forEach((el) => el.classList.add("is-visible"));
  }

  // Pricing toggle (monthly / yearly)
  const billingToggle = document.getElementById("billingToggle");
  const billingLabels = document.querySelectorAll(".billing-label");
  const priceAmounts = document.querySelectorAll(".price-amount");

  function setBillingMode(mode) {
    // Update knob position
    if (billingToggle) {
      const parent = billingToggle.parentElement;
      if (parent) {
        parent.classList.toggle("billing-yearly", mode === "yearly");
      }
    }

    // Highlight active label
    billingLabels.forEach((node) => {
      const label = /** @type {HTMLSpanElement} */ (node);
      const labelMode = label.dataset.billing;
      label.classList.toggle("active", labelMode === mode);
    });

    // Update price text
    priceAmounts.forEach((node) => {
      const priceEl = /** @type {HTMLElement} */ (node);
      const monthly = priceEl.dataset.monthly;
      const yearly = priceEl.dataset.yearly;
      if (mode === "monthly" && monthly) {
        priceEl.textContent = monthly;
      } else if (mode === "yearly" && yearly) {
        priceEl.textContent = yearly;
      }
    });
  }

  if (billingToggle) {
    let currentMode = "monthly";

    billingToggle.addEventListener("click", () => {
      currentMode = currentMode === "monthly" ? "yearly" : "monthly";
      setBillingMode(currentMode);
    });

    // Clicking labels also toggles
    billingLabels.forEach((node) => {
      const label = /** @type {HTMLSpanElement} */ (node);
      label.addEventListener("click", () => {
        const mode = label.dataset.billing === "yearly" ? "yearly" : "monthly";
        currentMode = mode;
        setBillingMode(currentMode);
      });
    });

    // Initialize
    setBillingMode(currentMode);
  }

  // Shared year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  // Form validation helpers
  function setFieldError(input, message) {
    const group = input.closest(".form-group");
    if (!group) return;
    const errorSpan = group.querySelector(`.form-error[data-for="${input.id}"]`);
    input.classList.toggle("error", Boolean(message));
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validatePhone(value) {
    const digits = value.replace(/[^\d]/g, "");
    return digits.length >= 8;
  }

  // ============================================
  // CONTACT FORM WITH EMAILJS INTEGRATION
  // ============================================
  // Replace these values with your EmailJS credentials:
  const EMAILJS_SERVICE_ID = "service_qg4t7vn"; // e.g., "service_abc123"
  const EMAILJS_TEMPLATE_ID = "template_86ppadl"; // e.g., "template_xyz789"

  const contactForm = document.getElementById("contactForm");
  const contactSuccessMessage = document.getElementById("contactSuccessMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let hasError = false;

      const nameInput = document.getElementById("contactName");
      const emailInput = document.getElementById("contactEmail");
      const phoneInput = document.getElementById("contactPhone");
      const typeSelect = document.getElementById("contactType");
      const messageInput = document.getElementById("contactMessage");

      if (contactSuccessMessage) {
        contactSuccessMessage.textContent = "";
      }

      // Validation
      if (nameInput) {
        if (!nameInput.value.trim()) {
          setFieldError(nameInput, "Please enter your name.");
          hasError = true;
        } else {
          setFieldError(nameInput, "");
        }
      }

      if (emailInput) {
        if (!emailInput.value.trim()) {
          setFieldError(emailInput, "Please enter your email.");
          hasError = true;
        } else if (!validateEmail(emailInput.value)) {
          setFieldError(emailInput, "Enter a valid email address.");
          hasError = true;
        } else {
          setFieldError(emailInput, "");
        }
      }

      if (phoneInput) {
        if (!phoneInput.value.trim()) {
          setFieldError(phoneInput, "Please enter your phone number.");
          hasError = true;
        } else if (!validatePhone(phoneInput.value)) {
          setFieldError(phoneInput, "Enter a valid phone number.");
          hasError = true;
        } else {
          setFieldError(phoneInput, "");
        }
      }

      if (typeSelect) {
        if (!typeSelect.value) {
          setFieldError(typeSelect, "Please select an inquiry type.");
          hasError = true;
        } else {
          setFieldError(typeSelect, "");
        }
      }

      if (messageInput) {
        if (!messageInput.value.trim()) {
          setFieldError(messageInput, "Please enter a message.");
          hasError = true;
        } else {
          setFieldError(messageInput, "");
        }
      }

      // If validation passes, send email via EmailJS
      if (!hasError) {
        // Show loading message
        if (contactSuccessMessage) {
          contactSuccessMessage.textContent = "Sending your message...";
          contactSuccessMessage.style.color = "#ff8a3c";
        }

        // Prepare email payload
        const emailParams = {
          from_name: nameInput ? nameInput.value.trim() : "",
          from_email: emailInput ? emailInput.value.trim() : "",
          phone: phoneInput ? phoneInput.value.trim() : "",
          inquiry_type: typeSelect ? typeSelect.value : "",
          message: messageInput ? messageInput.value.trim() : "",
        };

        // Send email using EmailJS
        emailjs
          .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams)
          .then(
            () => {
              // Success
              if (contactSuccessMessage) {
                contactSuccessMessage.textContent =
                  "Thanks for reaching out. We'll get back to you shortly.";
                contactSuccessMessage.style.color = "#ff8a3c";
              }
              if (contactForm) {
                contactForm.reset();
              }
            },
            (error) => {
              // Error
              console.error("EmailJS error:", error);
              if (contactSuccessMessage) {
                contactSuccessMessage.textContent =
                  "Something went wrong. Please try again or contact us directly.";
                contactSuccessMessage.style.color = "#ff4d5a";
              }
            }
          );
      }
    });
  }

  // ============================================
  // JOIN FORM (MEMBERSHIP PAGE) - OPTIONAL EMAILJS
  // ============================================
  // Uncomment and configure if you want to send emails for membership applications too
  // const EMAILJS_JOIN_SERVICE_ID = "YOUR_SERVICE_ID";
  // const EMAILJS_JOIN_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

  const joinForm = document.getElementById("joinForm");
  const joinSuccessMessage = document.getElementById("joinSuccessMessage");

  if (joinForm) {
    joinForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let hasError = false;

      const nameInput = document.getElementById("joinName");
      const emailInput = document.getElementById("joinEmail");
      const phoneInput = document.getElementById("joinPhone");
      const planSelect = document.getElementById("joinPlan");
      const goalsInput = document.getElementById("joinGoals");

      if (joinSuccessMessage) {
        joinSuccessMessage.textContent = "";
      }

      // Validation
      if (nameInput) {
        if (!nameInput.value.trim()) {
          setFieldError(nameInput, "Please enter your name.");
          hasError = true;
        } else {
          setFieldError(nameInput, "");
        }
      }

      if (emailInput) {
        if (!emailInput.value.trim()) {
          setFieldError(emailInput, "Please enter your email.");
          hasError = true;
        } else if (!validateEmail(emailInput.value)) {
          setFieldError(emailInput, "Enter a valid email address.");
          hasError = true;
        } else {
          setFieldError(emailInput, "");
        }
      }

      if (phoneInput) {
        if (!phoneInput.value.trim()) {
          setFieldError(phoneInput, "Please enter your phone number.");
          hasError = true;
        } else if (!validatePhone(phoneInput.value)) {
          setFieldError(phoneInput, "Enter a valid phone number.");
          hasError = true;
        } else {
          setFieldError(phoneInput, "");
        }
      }

      if (planSelect) {
        if (!planSelect.value) {
          setFieldError(planSelect, "Please select a plan.");
          hasError = true;
        } else {
          setFieldError(planSelect, "");
        }
      }

      // If validation passes
      if (!hasError) {
        // Option 1: Just show success message (current behavior)
        joinForm.reset();
        if (joinSuccessMessage) {
          joinSuccessMessage.textContent =
            "Your application has been submitted. Our team will connect with you soon.";
        }

        // Option 2: Uncomment below to send email via EmailJS for membership applications
        /*
        if (joinSuccessMessage) {
          joinSuccessMessage.textContent = "Submitting your application...";
          joinSuccessMessage.style.color = "#ff8a3c";
        }

        const emailParams = {
          from_name: nameInput ? nameInput.value.trim() : "",
          from_email: emailInput ? emailInput.value.trim() : "",
          phone: phoneInput ? phoneInput.value.trim() : "",
          plan: planSelect ? planSelect.value : "",
          goals: goalsInput ? goalsInput.value.trim() : "",
        };

        emailjs
          .send(EMAILJS_JOIN_SERVICE_ID, EMAILJS_JOIN_TEMPLATE_ID, emailParams)
          .then(
            () => {
              if (joinSuccessMessage) {
                joinSuccessMessage.textContent =
                  "Your application has been submitted. Our team will connect with you soon.";
                joinSuccessMessage.style.color = "#ff8a3c";
              }
              if (joinForm) {
                joinForm.reset();
              }
            },
            (error) => {
              console.error("EmailJS error:", error);
              if (joinSuccessMessage) {
                joinSuccessMessage.textContent =
                  "Something went wrong. Please try again or contact us directly.";
                joinSuccessMessage.style.color = "#ff4d5a";
              }
            }
          );
        */
      }
    });
  }
});


