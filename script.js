document.addEventListener("DOMContentLoaded", function () {
  const aboutDropdown = document.getElementById("aboutDropdown");

  if (aboutDropdown) {
    const navItem = aboutDropdown.closest(".nav-item");
    const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(aboutDropdown);
    const isMobile = window.innerWidth < 992;

    // Click behavior: navigate to about.html if dropdown is already open
    aboutDropdown.addEventListener("click", function (e) {
      if (!this.parentElement.classList.contains("show")) {
        // First click (desktop): prevent navigation, open dropdown
        e.preventDefault();
      } else {
        // Second click or on mobile: go to overview page
        window.location.href = this.getAttribute("href");
      }
    });

    // Hover behavior (desktop only)
    if (!isMobile) {
      navItem.addEventListener("mouseenter", () => dropdownInstance.show());
      navItem.addEventListener("mouseleave", () => dropdownInstance.hide());
    }
  }
});
