document.addEventListener("DOMContentLoaded", function () {
  const aboutDropdown = document.getElementById("aboutDropdown");

  if (aboutDropdown) {
    const navItem = aboutDropdown.closest(".nav-item");
    const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(aboutDropdown);

    // Desktop hover behavior
    if (window.innerWidth >= 992) {
      // Hover to show/hide dropdown
      navItem.addEventListener("mouseenter", () => dropdownInstance.show());
      navItem.addEventListener("mouseleave", () => dropdownInstance.hide());

      // Click logic (first opens, second navigates)
      let clickedOnce = false;

      aboutDropdown.addEventListener("click", function (e) {
        if (!clickedOnce) {
          // First click: open only
          e.preventDefault();
          dropdownInstance.show();
          clickedOnce = true;

          // Reset on blur
          setTimeout(() => {
            clickedOnce = false;
          }, 1500);
        } else {
          // Second click: allow navigation
          window.location.href = aboutDropdown.getAttribute("href");
        }
      });
    } else {
      // Mobile: directly navigate on click
      aboutDropdown.addEventListener("click", function () {
        window.location.href = aboutDropdown.getAttribute("href");
      });
    }
  }
});
