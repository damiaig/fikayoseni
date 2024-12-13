import { db } from "./firestoreconfig.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Fetch and display submissions
async function fetchAndDisplayForms() {
    try {
        const tableBody = document.getElementById("submissions-table-body");
        tableBody.innerHTML = ""; // Clear the table before adding new data

        const querySnapshot = await getDocs(collection(db, "rsvp"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.phone}</td>
                <td>${data.email}</td>
                <td>${data.attendance}</td>
                <td>${data.guest}</td>
                <td>
                    <button class="delete-button" data-id="${doc.id}">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", async (e) => {
                const docId = e.target.getAttribute("data-id");
                await deleteSubmission(docId, e.target.closest("tr"));
            });
        });
    } catch (error) {
        console.error("Error fetching forms: ", error);
    }
}

// Delete submission
async function deleteSubmission(docId, rowElement) {
    try {
        await deleteDoc(doc(db, "rsvp", docId));
        rowElement.remove(); // Remove the row from the UI
        console.log(`Document with ID ${docId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting document: ${error}`);
    }
}

// Fetch submissions on page load
fetchAndDisplayForms();


document.querySelector('.page-close').addEventListener('click', function() {
    history.back(); // Navigate back to the previous page
});