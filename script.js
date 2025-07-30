document.addEventListener("DOMContentLoaded", function () {
  const aboutDropdown = document.getElementById("aboutDropdown");
  const navItem = aboutDropdown.closest(".nav-item");

  // Enable Bootstrap dropdown
  const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(aboutDropdown);

  // Desktop hover behavior
  navItem.addEventListener("mouseenter", function () {
    if (window.innerWidth >= 992) {
      dropdownInstance.show();
    }
  });

  navItem.addEventListener("mouseleave", function () {
    if (window.innerWidth >= 992) {
      dropdownInstance.hide();
    }
  });

  // Click behavior: redirect to about.html
  aboutDropdown.addEventListener("click", function (e) {
    const isMobile = window.innerWidth < 992;

    if (!isMobile) {
      // Desktop: redirect on click
      e.preventDefault();
      window.location.href = aboutDropdown.getAttribute("href");
    }
    // On mobile, default Bootstrap click-toggle will work
  });
});
