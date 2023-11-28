function initializeApp() {
  // CONSTANTS
  const HIDDEN_CLASS = "hidden";
  const ACTIVE_CLASS = "active";
  const ALERT_INDEX = 0;
  const MENU_INDEX = 1;

  // DOM ELEMENTS RELATED TO ALERTS AND MENU
  const alertsButton = document.getElementById("alerts-btn");
  const alertsContainer = document.getElementById("alerts");
  const alertsNotification = document.getElementById("alerts-notify");

  const menuButton = document.getElementById("menu-btn");
  const menuElement = document.getElementById("menu");
  const menuItems = document.querySelectorAll('[role="menuitem"]');
  const menuNotification = document.getElementById("menu-notify");

  const popups = [alertsContainer, menuElement];
  const popupButtons = [alertsButton, menuButton];
  const popupNotifications = [alertsNotification, menuNotification];

  // DOM ELEMENTS FOR THE PRICING SECTION
  const callout = document.getElementById("callout");
  const calloutCloseButton = document.getElementById("callout-close-btn");
  const calloutNotification = document.getElementById("callout-notify");

  // DOM ELEMENTS FOR THE SETUP STEPS SECTION
  const toggleSetupButton = document.getElementById("toggle-setup-btn");
  const setupElement = document.getElementById("setup");
  const toggleSetupNotification = document.getElementById("toggle-setup-notify");

  const toggleSetupVisibilityButtons = document.querySelectorAll(".setup-step-toggle");
  const setupSteps = [...document.querySelectorAll(".setup-step")];
  const setupStepNotifications = document.querySelectorAll(".setup-step-notify");

  const toggleSetupCompleteButtons = document.querySelectorAll(".check-step-btn");
  const toggleCompleteNotifications = document.querySelectorAll(".check-step-btn-notify");
  const progressBar = document.getElementById("progess-bar");
  const progressCount = document.getElementById("progress-count");

  // REMOVE ALL POPUPS FROM VIEW
  function hidePopups() {
    popups.forEach((popup, index) => {
      const isPopupOpen = !popup.classList.contains(HIDDEN_CLASS);
      if (!isPopupOpen) {
        return;
      }

      popup.classList.add(HIDDEN_CLASS);
      popupButtons[index].setAttribute("aria-expanded", false);
      const popupNotification = popupNotifications[index];
      popupNotification.setAttribute("aria-label", popupNotification.dataset.closeLabel);
    });
  }

  // TOGGLE POPUP VISIBILITY
  function togglePopup(event, popupIndex) {
    const popup = popups[popupIndex];
    const popupButton = popupButtons[popupIndex];
    const isPopupOpen = !popup.classList.contains(HIDDEN_CLASS);
    hidePopups();

    if (!isPopupOpen) {
      popup.classList.remove(HIDDEN_CLASS);
      popupButton.setAttribute("aria-expanded", true);
      const popupNotification = popupNotifications[popupIndex];
      popupNotification.setAttribute("aria-label", popupNotification.dataset.openLabel);
      event.stopPropagation();
    }
  }

  // HIDE POPUP WHEN CLICKING OUTSIDE THEIR ELEMENTS
  function hidePopupsOnClickOutside(event) {
    const isAnyPopupClicked = popups.some((popup) => {
      return popup.contains(event.target);
    });
    if (isAnyPopupClicked) {
      return;
    }

    hidePopups();
  }

  function focusFirstMenuItem() {
    menuItems.item(0).focus();
  }

  // Hide popup on escape key press
  function handleEscapeKeyPress(event) {
    if (event.key === "Escape") {
      hidePopups();
    }
  }

  // Move focus to the next or previous menu item on arrow key press
  function handleMenuItemKeyPress(event, menuItemIndex) {
    let nextMenuItemIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      // Move to the next menu item
      nextMenuItemIndex = modNumber(menuItemIndex + 1, menuItems.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      // Move to the previous menu item
      nextMenuItemIndex = modNumber(menuItemIndex - 1, menuItems.length);
    } else if (event.key === "Home") {
      // Move to the first menu item
      nextMenuItemIndex = 0;
    } else if (event.key === "End") {
      // Move to the last menu item
      nextMenuItemIndex = menuItems.length - 1;
    } else {
      // Do nothing on other key presses
      return;
    }

    menuItems.item(nextMenuItemIndex).focus();
  }

  // Toggle visibility of setup steps
  function toggleSetup() {
    setupElement.classList.toggle(HIDDEN_CLASS);

    const isOpen = !setupElement.classList.contains(HIDDEN_CLASS);
    if (isOpen) {
      toggleSetupNotification.setAttribute("aria-label", "Setup opened");
    } else {
      toggleSetupNotification.setAttribute("aria-label", "Setup closed");
    }

    toggleSetupButton.setAttribute("aria-expanded", isOpen);
    toggleSetupButton.dataset.isOpen = isOpen ? "" : true;
  }

  // Hide other setup steps and show the active one
  function showSetupStep(setupStepIndex) {
    hideSetupSteps();
    setupSteps[setupStepIndex].classList.add(ACTIVE_CLASS);

    const setupStepNotification = setupStepNotifications.item(setupStepIndex);
    setupStepNotification.setAttribute("aria-label", `Setup step ${setupStepIndex + 1} opened`);

    const toggleVisibilityButton = toggleSetupVisibilityButtons.item(setupStepIndex);
    toggleVisibilityButton.setAttribute("aria-expanded", true);
    const toggleCompleteButton = toggleSetupCompleteButtons.item(setupStepIndex);
    toggleCompleteButton.focus();
  }

  // Hide other setup steps
  function hideSetupSteps() {
    setupSteps.forEach((el, index) => {
      const isClosed = !el.classList.contains(ACTIVE_CLASS);
      if (isClosed) {
        return;
      }

      el.classList.remove(ACTIVE_CLASS);
      setupStepNotifications
        .item(index)
        .setAttribute("aria-label", `Setup step ${index + 1} closed`);
    });

    toggleSetupVisibilityButtons.forEach((btn) => btn.setAttribute("aria-expanded", false));
  }

  // Update ARIA attributes for the check button for setup steps
  function updateARIAForToggleCompleteBtn(toggleBtnIndex) {
    const setupStep = setupSteps[toggleBtnIndex];
    const isSetupStepComplete = !!setupStep.dataset.isCompleted;
    const toggleBtn = toggleSetupCompleteButtons[toggleBtnIndex];
    const toggleCompleteNotification = toggleCompleteNotifications.item(toggleBtnIndex);

    if (isSetupStepComplete) {
      toggleBtn.setAttribute("aria-label", "Mark step incomplete");
      toggleCompleteNotification.setAttribute("aria-label", "Setup step marked complete");
    } else {
      toggleCompleteNotification.setAttribute("aria-label", "Setup step marked incomplete");
      toggleBtn.setAttribute("aria-label", "Mark step complete");
    }
  }

  // Toggle setup step complete, update the progress indicator, and open the next
  // uncompleted setup step
  function toggleSetupStepComplete(toggleBtnIndex) {
    const setupStep = setupSteps[toggleBtnIndex];
    const isSetupStepComplete = !!setupStep.dataset.isCompleted;
    setupStep.dataset.isCompleted = isSetupStepComplete ? "" : true;

    updateProgressBar();
    updateARIAForToggleCompleteBtn(toggleBtnIndex);

    const nextStepIndex = findNextUncompletedStepIndex(toggleBtnIndex);
    if (nextStepIndex !== -1) {
      showSetupStep(nextStepIndex);
    }
  }

  // Return the index of the next uncompleted setup step
  function findNextUncompletedStepIndex(setupStepIndex) {
    // Check next steps after the current step
    for (let i = setupStepIndex; i < setupSteps.length; i++) {
      if (!setupSteps[i].dataset.isCompleted) {
        return i;
      }
    }

    // Check steps before the current;
    for (let i = 0; i < setupStepIndex; i++) {
      if (!setupSteps[i].dataset.isCompleted) {
        return i;
      }
    }

    // Return -1, if no incomplete steps are found
    return -1;
  }

  // Update the progress count and indicator
  function updateProgressBar() {
    const completedStepsNo = setupSteps.filter((step) => step.dataset.isCompleted).length;
    progressBar.style.width = `${completedStepsNo * 20}%`;
    progressCount.innerText = completedStepsNo;
  }

  // Modulus function that works with negative numbers
  function modNumber(num, n) {
    return ((num % n) + n) % n;
  }

  // Toggle alerts visibility on alerts button click
  alertsButton.addEventListener("click", (event) => {
    togglePopup(event, ALERT_INDEX);
  });

  // Toggle menu visibility on the menu button click
  menuButton.addEventListener("click", (event) => {
    togglePopup(event, MENU_INDEX);

    const isMenuOpen = !menuElement.classList.contains(HIDDEN_CLASS);
    if (isMenuOpen) {
      focusFirstMenuItem();
    }
  });

  // Close popups on escape key press
  popups.forEach((popup) => {
    popup.addEventListener("keyup", handleEscapeKeyPress);
  });
  alertsButton.addEventListener("keyup", handleEscapeKeyPress);

  // Handle menu item focus on key press
  menuItems.forEach((menuItem, index) =>
    menuItem.addEventListener("keyup", (event) => handleMenuItemKeyPress(event, index))
  );

  document.addEventListener("click", hidePopupsOnClickOutside);

  // Hide the callout
  calloutCloseButton.addEventListener("click", () => {
    callout.classList.add(HIDDEN_CLASS);
    calloutNotification.setAttribute("aria-label", "Callout removed");
  });

  toggleSetupButton.addEventListener("click", toggleSetup);
  toggleSetupVisibilityButtons.forEach((btn, btnIndex) => {
    btn.addEventListener("click", () => showSetupStep(btnIndex));
  });

  toggleSetupCompleteButtons.forEach((btn, btnIndex) => {
    btn.addEventListener("click", () => toggleSetupStepComplete(btnIndex));
  });
}

initializeApp();
