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
<script>
  // Redirect to href on click of dropdown toggle link (About Us)
  document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggle = document.querySelectorAll('.nav-item.dropdown > a.dropdown-toggle');

    dropdownToggle.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
      });
    });
  });
</script>

