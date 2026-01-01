// 1. Verify User is Admin
checkAuth("Admin");

// 2. Handle Create Session Form
document.getElementById("createSessionForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("sessionName").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const msgDiv = document.getElementById("statusMessage");

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/Admin/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // IMPORTANT: Send the Token!
            },
            body: JSON.stringify({
                name: name,
                startDate: startDate,
                endDate: endDate
            })
        });

        if (response.ok) {
            msgDiv.className = "alert alert-success";
            msgDiv.innerText = "Session Created Successfully!";
            msgDiv.style.display = "block";
            // Clear form
            document.getElementById("createSessionForm").reset();
        } else {
            const err = await response.text(); // Get server error message if any
            msgDiv.className = "alert alert-danger";
            msgDiv.innerText = "Error: " + (err || response.statusText);
            msgDiv.style.display = "block";
        }

    } catch (error) {
        console.error(error);
        msgDiv.className = "alert alert-danger";
        msgDiv.innerText = "Server Connection Failed";
        msgDiv.style.display = "block";
    }
});