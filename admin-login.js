document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = loginForm.querySelector(".email");
    const passwordInput = loginForm.querySelector(".password");
    const messageDiv = document.getElementById("message");

    // Admin credentials
    const adminEmail = "olaseniabash@gmail.com";
    const adminPassword = "Olaseni28";

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get user inputs
        const enteredEmail = emailInput.value.trim().toLowerCase();
        const enteredPassword = passwordInput.value.trim();

        // Validate credentials
        if (
            enteredEmail === adminEmail.toLowerCase() && 
            enteredPassword === adminPassword
        ) {
            showSuccessMessage("Login successful!");
            setTimeout(() => {
                window.location.href = "admin45789457683476373gdbdhuwjhwhw89476548378483974678.html"; // Redirect to admin page
            }, 1500);
        } else {
            showErrorMessage("Wrong email or password. Please try again.");
        }
    });

    function showSuccessMessage(message) {
        displayMessage(message, "green");
    }

    function showErrorMessage(message) {
        displayMessage(message, "red");
    }

    function displayMessage(message, color) {
        messageDiv.textContent = message;
        messageDiv.style.color = color;
        messageDiv.style.position = "fixed";
        messageDiv.style.top = "50%";
        messageDiv.style.left = "50%";
        messageDiv.style.transform = "translate(-50%, -50%)";
        messageDiv.style.backgroundColor = "white";
        messageDiv.style.padding = "20px";
        messageDiv.style.border = `2px solid ${color}`;
        messageDiv.style.borderRadius = "10px";
        messageDiv.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
        messageDiv.style.zIndex = "1000";

        // Hide the message after 3 seconds
        setTimeout(() => {
            messageDiv.style.transition = "opacity 0.5s ease";
            messageDiv.style.opacity = "0"; // Fade out the message

            // Remove the message completely after fade-out
            setTimeout(() => {
                messageDiv.textContent = "";
                messageDiv.style.opacity = "0"; // Reset opacity for future messages
            }, 500); // Wait for the fade-out transition to complete
        }, 3000);
    }
});

document.querySelector('.page-close').addEventListener('click', function() {
    history.back(); // Navigate back to the previous page
});
