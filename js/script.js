document.addEventListener("DOMContentLoaded", function () {
  const aboutDropdown = document.getElementById("aboutDropdown");

  if (!aboutDropdown) return;

  const navItem = aboutDropdown.closest(".nav-item");
  const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(aboutDropdown);
  const isMobile = window.innerWidth < 992;

  // Desktop: Hover to open dropdown
  if (!isMobile) {
    navItem.addEventListener("mouseenter", () => dropdownInstance.show());
    navItem.addEventListener("mouseleave", () => dropdownInstance.hide());

    let clickedOnce = false;

    aboutDropdown.addEventListener("click", function (e) {
      e.preventDefault();

      if (!clickedOnce) {
        // First click: open dropdown
        dropdownInstance.show();
        clickedOnce = true;

        // Reset after 1.5s
        setTimeout(() => {
          clickedOnce = false;
        }, 1500);
      } else {
        // Second click: navigate
        window.location.href = this.getAttribute("href");
      }
    });
  } else {
    // Mobile: click directly navigates
    aboutDropdown.addEventListener("click", function () {
      window.location.href = this.getAttribute("href");
    });
  }
});

