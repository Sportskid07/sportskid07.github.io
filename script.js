// Allow dropdown to also navigate to the About Us overview (about.html)
document.addEventListener("DOMContentLoaded", function () {
  const aboutLink = document.querySelector('.nav-item.dropdown > a[href="about.html"]');
  
  if (aboutLink) {
    aboutLink.addEventListener("click", function (e) {
      // On small screens, prevent dropdown from closing before navigation
      const isMobile = window.innerWidth < 992;
      if (!isMobile) {
        window.location.href = this.getAttribute("href");
      }
    });
  }
});

  // Allow navigation on dropdown parent link
  document.querySelectorAll('.dropdown-toggle').forEach(function (dropdown) {
    dropdown.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        window.location.href = href;
      }
    })
  });


// Enable dropdown click navigation to 'about.html'
document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
  toggle.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href !== '#' && !this.classList.contains('show')) {
      // Navigate to overview page when About Us is clicked
      window.location.href = href;
    }
  });
});

  document.addEventListener("DOMContentLoaded", function () {
    const aboutDropdown = document.getElementById('aboutDropdown');

    aboutDropdown.addEventListener('click', function (e) {
      // Navigate to about.html when clicked
      window.location.href = this.getAttribute('href');
    });
  });

