import { db } from "./firestoreconfig.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
 
 
// Initialize EmailJS (No need for `init()`)
const form = document.querySelector(".rsvp-form");
const inputs = form.querySelectorAll("input[type='text'], input[type='number'], input[type='email']");
const radioGroups = [
    { name: "attendance", options: form.querySelectorAll("input[name='attendance']") },
    { name: "guest", options: form.querySelectorAll("input[name='guest']") }
];
const submitButton = form.querySelector(".rsvp-button");

// Check current submission count
async function getSubmissionCount() {
    const querySnapshot = await getDocs(collection(db, "rsvp"));
    return querySnapshot.size;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentCount = await getSubmissionCount();

    // Limit submissions to 300
    if (currentCount >= 300) {
        alert("Guest limit has been reached. Please contact the organizers for more information.");
        return;
    }

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

    // If all inputs are valid, save to Firestore and send emails
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

            // Send email to the person who submitted the form (template_9gotjmv)
            await emailjs.send("service_x8k2rx5", "template_9gotjmv", {
                reply_to: formData.email,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                attendance: formData.attendance,
                guest: formData.guest
            }, "hJOWLuydKWyJxBQVm");

            // Send email to the two admins (template_gquzkc7)
            await emailjs.send("service_qn5r7w4", "template_gquzkc7", {
                reply_to: "bmluxeevents@gmail.com", // First admin email
                cc_email: " olaseniabash@gmail.com", // Second admin email
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                attendance: formData.attendance,
                guest: formData.guest
            }, "hJOWLuydKWyJxBQVm");

            showSuccessMessage();
            form.reset();
            updateButtonState(); // Update button state after reset
        } catch (e) {
            console.error("Error adding document or sending email: ", e);
            showErrorMessage("An error occurred while submitting the form. Please try again.");
        }
    }

    // Update button state after form validation
    updateButtonState();
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

// Add event listeners to inputs and radio buttons to dynamically update button state


function showSuccessMessage() {
    const successMessage = document.createElement("div");
    successMessage.textContent = "Form submitted successfully, an email just got sent to you!";
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
