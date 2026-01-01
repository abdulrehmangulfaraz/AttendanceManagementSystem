// 1. Verify User is Student
checkAuth("Student");

// 2. Fetch Attendance on Page Load
document.addEventListener("DOMContentLoaded", fetchMyAttendance);

async function fetchMyAttendance() {
    const tbody = document.getElementById("myAttendanceBody");
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/Student/my-attendance`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            tbody.innerHTML = ""; // Clear old data

            if (data.length === 0) {
                tbody.innerHTML = "<tr><td colspan='3' class='text-center'>No attendance records found.</td></tr>";
                return;
            }

            data.forEach(record => {
                const row = `<tr>
                    <td>${record.courseName}</td>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td><span class="badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}">${record.status}</span></td>
                </tr>`;
                tbody.innerHTML += row;
            });
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}