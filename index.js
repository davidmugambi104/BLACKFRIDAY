// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the menu icon and navbar
    const menuIcon = document.querySelector('.menu-icon');
    const navbar = document.querySelector('.navbar');
    
    // Toggle the menu and animation when the icon is clicked
    menuIcon.addEventListener('click', function() {
        navbar.classList.toggle('open');  // Toggle the "open" class on the navbar
        menuIcon.classList.toggle('open'); // Toggle the animation on the hamburger icon
    });

    // Set the target date (e.g., Black Friday)
    const targetDate = new Date("Nov 29, 2024 00:00:00").getTime();

    // Update the countdown every second
    const countdownInterval = setInterval(function() {
        // Get the current date and time
        const now = new Date().getTime();
        
        // Calculate the time difference between now and the target date
        const timeLeft = targetDate - now;

        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Display the countdown
        document.getElementById("days").querySelector("p").textContent = days;
        document.getElementById("hours").querySelector("p").textContent = hours;
        document.getElementById("minutes").querySelector("p").textContent = minutes;
        document.getElementById("seconds").querySelector("p").textContent = seconds;

        // If the countdown is finished, display a message
        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "<h2>The event has started!</h2>";
        }
    }, 1000); // Update every second (1000ms)
});
