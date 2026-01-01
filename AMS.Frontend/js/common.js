const API_BASE_URL = "http://localhost:5047/api"; 

// 1. Check if user is logged in
function checkAuth(requiredRole) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        window.location.href = "../index.html";
        return;
    }

    if (requiredRole && role !== requiredRole) {
        alert("Access Denied: You do not have permission to view this page.");
        window.location.href = "../index.html"; // Or redirect to their specific dashboard
    }
}

// 2. Logout Function
function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}