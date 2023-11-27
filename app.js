document.addEventListener('DOMContentLoaded', function () {
    showDiv();
    updateProgress();
});

// MAIN DROPDOWN
function toggleDropdown() {
    var dropdownContent = document.querySelector('.dropdown-content');
    var dropdown = document.querySelector('.dropdown');

    dropdownContent.style.display = dropdownContent.style.display === 'none'
        ? 'block'
        : 'none';
    dropdown
        .classList
        .toggle('open');
}

// STEPS DROPDOWN
function toggleStep(stepId) {
    var stepContent = document.getElementById(stepId);
    var allSteps = document.getElementsByClassName("step");

    // Close all steps and remove the "active" class
    for (var i = 0; i < allSteps.length; i++) {
        var currentStep = allSteps[i];
        currentStep
            .getElementsByClassName("step-content")[0]
            .style
            .display = "none";
        currentStep
            .classList
            .remove("active");
    }

    // Open the selected step and add the "active" class
    stepContent
        .getElementsByClassName("step-content")[0]
        .style
        .display = "block";
    stepContent
        .classList
        .add("active");
}

// Function to handle checkbox change
function handleCheckboxChange(checkbox) {
    // Update progress and open the next step if the checkbox is checked
    updateProgress();
    if (checkbox.checked) {
        var currentStep = checkbox.closest('.step');
        var nextStep = currentStep.nextElementSibling;

        if (nextStep) {
            toggleStep(nextStep.id);
        }
    }
}

// Attach the handleCheckboxChange function to all checkboxes
var checkboxes = document.getElementsByClassName("step-checkbox");
for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function () {
        handleCheckboxChange(this);
    });
}

// Open the first step by default
toggleStep('step1');

// PROGRESS BAR
function updateProgress() {
    var totalSteps = 5;
    var completedSteps = 0;

    // Select all checkboxes with the class "step-checkbox"
    var checkboxes = document.getElementsByClassName("step-checkbox");

    for (var i = 0; i < checkboxes.length; i++) {
        var checkbox = checkboxes[i];

        if (checkbox.checked) {
            completedSteps++;
        }
    }

    // Update the progress bar
    var stepProgress = document.getElementById("progress");
    var percentage = (completedSteps / totalSteps) * 100;
    stepProgress.style.width = percentage + "%";

    // Update the progress text
    var progressText = document.getElementById('progressText');
    progressText.innerText = `${completedSteps} / ${totalSteps} completed`;
}


// PLAN REMOVAL AND DEFAULT LOADING

function removeDiv() {
    var div = document.getElementById('myDiv');
    if (div) {
        div.remove(); // Remove the plan div
    }
}

function showDiv() {
    // You can add logic here to check conditions and decide whether to show the
    var body = document.body;
    var div = document.createElement('div');
    div.id = 'myDiv';
    div.className = 'removable-div';
    div.innerHTML = '<p class="plan-text">Extend your trial for $1/month for 3 months on select pla' +
            'ns.</p><div class="btns"><button type="button">Select a plan</button><svgoncli' +
            'ck="removeDiv()"width="25"height="30" viewbox="0 0 21 20"fill="none"xmlns="htt' +
            'p://www.w3.org/2000/svg"><pathd="M14.4697 15.0303C14.7626 15.3232 15.2374 15.3' +
            '232 15.5303 15.0303C15.8232 14.7374 15.8232 14.2626 15.5303 13.9697L11.5607 10' +
            'L15.5303 6.03033C15.8232 5.73744 15.8232 5.26256 15.5303 4.96967C15.2374 4.676' +
            '78 14.7626 4.67678 14.4697 4.96967L10.5 8.93934L6.53033 4.96967C6.23744 4.6767' +
            '8 5.76256 4.67678 5.46967 4.96967C5.17678 5.26256 5.17678 5.73744 5.46967 6.03' +
            '033L9.43934 10L5.46967 13.9697C5.17678 14.2626 5.17678 14.7374 5.46967 15.0303' +
            'C5.76256 15.3232 6.23744 15.3232 6.53033 15.0303L10.5 11.0607L14.4697 15.0303Z' +
            '"fill="#fff"/></svg>';
}

// NOTIFICATION DROPDOWN

function toggleNotificationDropdown() {
    var notificationDropdown = document.getElementById("notificationDropdown");
    var userDropdown = document.getElementById("userDropdown");
    var notificationMenu = document.getElementById("notification-menu");
    notificationDropdown.classList.toggle("active");


     // FOCUS ON THE FIRST ITEM
     const allNotificationMenuItems = notificationDropdown.querySelectorAll('[role="notification-item"]');

     // Is it expanded?
     const isExpanded = notificationMenu.getAttribute("aria-expanded") === "true";
     
     
     if (isExpanded) {
        notificationMenu.setAttribute("aria-expanded", "false");
        notificationMenu.focus();
     } else {
        notificationMenu.setAttribute("aria-expanded", "true");
         allNotificationMenuItems.item(0).focus();
 
         notificationDropdown.addEventListener("keyup", handleNotificationMenuEscapeKeyPress);
     }

      // CLOSE WHEN ESCAPE KEY IS PRESSED
    function handleNotificationMenuEscapeKeyPress(event) {

        if(event.key === 'Escape') {
            notificationDropdown.classList.remove("active");
        }
       
    }

     // ARROW NAVIGATION
     function handleNotificationMenuItemArrowKeyPress(event, notificationMenuItemIndex) {
        
        const isLastNotificationMenuItem = notificationMenuItemIndex === allNotificationMenuItems.length - 1;
        const isFirstNotificationMenuItem = notificationMenuItemIndex === 0;
        const nextNotificationMenuItem = allNotificationMenuItems.item(notificationMenuItemIndex + 1);
        const previousNotificationMenuItem = allNotificationMenuItems.item(notificationMenuItemIndex - 1);

        if(event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            if(isLastNotificationMenuItem) {
                allNotificationMenuItems.item(0).focus();

                return;
            }

            nextNotificationMenuItem.focus();
        }
         
        if(event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            if(isFirstNotificationMenuItem) {
                allNotificationMenuItems.item( allNotificationMenuItems.length - 1).focus();

                return;
            }

            previousNotificationMenuItem.focus();
        }


    }   

    allNotificationMenuItems.forEach(function (notificationMenuItem, notificationMenuItemIndex) {
        notificationMenuItem.addEventListener("keyup", function (event) {
            handleNotificationMenuItemArrowKeyPress(event, notificationMenuItemIndex);
        });
    });

    // Close userDropdown if it's open
    if (userDropdown.classList.contains('active')) {
        userDropdown.classList.remove('active');
    }
}

// Close the dropdown when clicking outside of it
window.onclick = function(event) {
    if (!event.target.matches('.notification')) {
        var notificationDropdown = document.getElementById("notificationDropdown");
         for (var i = 0; i < notificationDropdown.length; i++) {
            var openDropdown = notificationDropdown[i];
            if (openDropdown.classList.contains('active')) {
                openDropdown.classList.remove('active');
            }
        }
    }
}


// USER DETAILS DROPDOWN
function toggleUserDropdown() {
    var userDropdown = document.getElementById("userDropdown");
    var notificationDropdown = document.getElementById("notificationDropdown");
    var profileMenu = document.getElementById("profile-menu");
    userDropdown.classList.toggle("active");
    
    // FOCUS ON THE FIRST ITEM
    const allMenuItems = userDropdown.querySelectorAll('[role="menu-item"]');

    // Is it expanded?
    const isExpanded = profileMenu.getAttribute("aria-expanded") === "true";
    
    
    if (isExpanded) {
        profileMenu.setAttribute("aria-expanded", "false");
        profileMenu.focus();
    } else {
        profileMenu.setAttribute("aria-expanded", "true");
        allMenuItems.item(0).focus();

        userDropdown.addEventListener("keyup", handleMenuEscapeKeyPress);
    }

    // Close notificationDropdown if it's open
    if (notificationDropdown.classList.contains('active')) {
        notificationDropdown.classList.remove('active');
    }

    // CLOSE WHEN ESCAPE KEY IS PRESSED
    function handleMenuEscapeKeyPress(event) {

        if(event.key === 'Escape') {
           userDropdown.classList.remove("active");
        }
       
    }

    // ARROW NAVIGATION
    function handleMenuItemArrowKeyPress(event, menuItemIndex) {
        
        const isLastMenuItem = menuItemIndex === allMenuItems.length - 1;
        const isFirstMenuItem = menuItemIndex === 0;
        const nextMenuItem = allMenuItems.item(menuItemIndex + 1);
        const previousMenuItem = allMenuItems.item(menuItemIndex - 1);

        if(event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            if(isLastMenuItem) {
                allMenuItems.item(0).focus();

                return;
            }

            nextMenuItem.focus();
        }
         
        if(event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            if(isFirstMenuItem) {
                allMenuItems.item(allMenuItems.length - 1).focus();

                return;
            }

            previousMenuItem.focus();
        }


    }   

    allMenuItems.forEach(function (menuItem, menuItemIndex) {
        menuItem.addEventListener("keyup", function (event) {
            handleMenuItemArrowKeyPress(event, menuItemIndex);
        });
    });
}






// Close the dropdown when clicking outside of it
window.onclick = function(event) {
    if (!event.target.matches('.user-profile')) {
        var userDropdown = document.getElementById("userDropdown");
         for (var i = 0; i < userDropdown.length; i++) {
            var openDropdown = userDropdown[i];
            if (openDropdown.classList.contains('active')) {
                openDropdown.classList.remove('active');
            }
        }
    }
}


// links 

function handleLinkKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        // Perform the link action here
        window.location.href = event.target.href;
    }
}

