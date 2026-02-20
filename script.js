// IronPulse Fitness - Core Interactivity
// Handles navigation, smooth scrolling, animations, pricing toggle, and form validation.

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

  // Contact form validation
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

      if (!hasError) {
        contactForm.reset();
        if (contactSuccessMessage) {
          contactSuccessMessage.textContent =
            "Thanks for reaching out. We’ll get back to you shortly.";
        }
      }
    });
  }

  // Join form validation (membership page)
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

      if (joinSuccessMessage) {
        joinSuccessMessage.textContent = "";
      }

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

      if (!hasError) {
        joinForm.reset();
        if (joinSuccessMessage) {
          joinSuccessMessage.textContent =
            "Your application has been submitted. Our team will connect with you soon.";
        }
      }
    });
  }
});

