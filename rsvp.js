import { db } from "./firestoreconfig.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


const form = document.querySelector(".rsvp-form");
const inputs = form.querySelectorAll("input[type='text'], input[type='number'], input[type='email']");
const radioGroups = [
    { name: "attendance", options: form.querySelectorAll("input[name='attendance']") },
    { name: "guest", options: form.querySelectorAll("input[name='guest']") }
];
const submitButton = form.querySelector(".rsvp-button");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;

    // Clear existing error messages
    form.querySelectorAll(".error-message").forEach(msg => msg.remove());
    inputs.forEach(input => input.style.border = "");
    radioGroups.forEach(group => group.options.forEach(option => option.parentElement.style.border = ""));

    // Validate text and email inputs
    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            showError(input, "This field is required.");
        } else if (input.type === "email" && !validateEmail(input.value)) {
            valid = false;
            showError(input, "Please enter a valid email address.");
        }
    });

    // Validate radio button groups
    radioGroups.forEach(group => {
        const selected = Array.from(group.options).some(option => option.checked);
        if (!selected) {
            valid = false;
            const container = group.options[0].closest(".options-row");
            showError(container, "This selection is required.");
        }
    });

    // If all inputs are valid, save to Firestore
    if (valid) {
        const formData = {
            name: form.querySelector("input[placeholder='First Name & Last Name']").value.trim(),
            phone: form.querySelector("input[placeholder='Phone Number']").value.trim(),
            email: form.querySelector("input[placeholder='Email']").value.trim(),
            attendance: form.querySelector("input[name='attendance']:checked").value,
            guest: form.querySelector("input[name='guest']:checked").value,
            timestamp: new Date()
        };

        try {
            // Add data to Firestore
            const docRef = await addDoc(collection(db, "rsvp"), formData);
            console.log("Document written with ID: ", docRef.id);

            showSuccessMessage();
            form.reset();
            updateButtonState(); // Update button state after reset
        } catch (e) {
            console.error("Error adding document: ", e);
            showErrorMessage("An error occurred while submitting the form. Please try again.");
        }
    }
});

// Utility Functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(element, message) {
    const error = document.createElement("div");
    error.className = "error-message";
    error.textContent = message;
    element.style.border = "1px solid red";
    if (element.classList.contains("options-row")) {
        element.parentElement.insertBefore(error, element);
    } else {
        element.parentElement.insertBefore(error, element);
    }
}

function showSuccessMessage() {
    const successMessage = document.createElement("div");
    successMessage.textContent = "Form submitted successfully!";
    successMessage.style.position = "fixed";
    successMessage.style.top = "50%";
    successMessage.style.left = "50%";
    successMessage.style.transform = "translate(-50%, -50%)";
    successMessage.style.backgroundColor = "white";
    successMessage.style.color = "green";
    successMessage.style.padding = "20px";
    successMessage.style.border = "2px solid green";
    successMessage.style.borderRadius = "10px";
    successMessage.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    successMessage.style.zIndex = "1000";
    document.body.appendChild(successMessage);

    setTimeout(() => {
        successMessage.remove();
        window.location.href = "index.html"; // Redirect to index.html after 3 seconds
    }, 3000);
}


function showErrorMessage(message) {
    const errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    errorMessage.style.position = "fixed";
    errorMessage.style.top = "50%";
    errorMessage.style.left = "50%";
    errorMessage.style.transform = "translate(-50%, -50%)";
    errorMessage.style.backgroundColor = "white";
    errorMessage.style.color = "red";
    errorMessage.style.padding = "20px";
    errorMessage.style.border = "2px solid red";
    errorMessage.style.borderRadius = "10px";
    errorMessage.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    errorMessage.style.zIndex = "1000";
    document.body.appendChild(errorMessage);

    setTimeout(() => {
        errorMessage.remove();
    }, 3000);
}

// Add event listeners to inputs and radio buttons to dynamically update button state
inputs.forEach(input => {
    input.addEventListener("input", updateButtonState); // Trigger on text input changes
});

radioGroups.forEach(group => {
    group.options.forEach(option => {
        option.addEventListener("change", updateButtonState); // Trigger on radio button changes
    });
});

function updateButtonState() {
    const isFormValid = Array.from(inputs).every(input => 
        input.value.trim() && (input.type !== "email" || validateEmail(input.value))
    ) && radioGroups.every(group => 
        Array.from(group.options).some(option => option.checked)
    );

    if (isFormValid) {
        submitButton.style.cursor = "pointer";
        submitButton.disabled = false;
    } else {
        submitButton.style.cursor = "not-allowed";
        submitButton.disabled = true;
    }
}

// Initial state for the button
updateButtonState();



document.querySelector('.page-close').addEventListener('click', function() {
    history.back(); // Navigate back to the previous page
});

// Initial state for the button
updateButtonState();
