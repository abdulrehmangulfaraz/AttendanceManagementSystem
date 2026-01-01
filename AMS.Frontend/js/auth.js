const API_URL = "http://localhost:5047/api"; 

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("errorMessage");

    try {
        const response = await fetch(`${API_URL}/Auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Save Token and Role to LocalStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userEmail", email);

            // Redirect based on Role
            if (data.role === "Admin") {
                window.location.href = "pages/admin-dashboard.html";
            } else if (data.role === "Teacher") {
                window.location.href = "pages/teacher-dashboard.html";
            } else if (data.role === "Student") {
                window.location.href = "pages/student-dashboard.html";
            }
        } else {
            errorDiv.innerText = "Invalid Email or Password";
            errorDiv.style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        errorDiv.innerText = "Server error. Please try again later.";
        errorDiv.style.display = "block";
    }
});