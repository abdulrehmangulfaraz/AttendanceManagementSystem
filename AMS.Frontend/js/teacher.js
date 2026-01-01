// 1. Verify User is Teacher
checkAuth("Teacher");

// UI Toggle Helper
function showSection(sectionId) {
    document.getElementById("markSection").style.display = 'none';
    document.getElementById("viewSection").style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

// 2. Handle Mark Attendance
document.getElementById("markAttendanceForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const studentId = document.getElementById("mStudentId").value;
    const courseId = document.getElementById("mCourseId").value;
    const sectionId = document.getElementById("mSectionId").value;
    const date = document.getElementById("mDate").value;
    const isPresent = document.getElementById("mStatus").value === "true"; // Convert string to boolean
    
    const msgDiv = document.getElementById("statusMessage");
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/Teacher/mark-attendance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                studentId: studentId,
                courseId: courseId,
                sectionId: sectionId,
                date: date,
                isPresent: isPresent
            })
        });

        if (response.ok) {
            msgDiv.className = "alert alert-success";
            msgDiv.innerText = "Attendance Marked Successfully!";
            msgDiv.style.display = "block";
        } else {
            msgDiv.className = "alert alert-danger";
            msgDiv.innerText = "Failed to mark attendance.";
            msgDiv.style.display = "block";
        }
    } catch (error) {
        console.error(error);
    }
});

// 3. Handle View Attendance
async function fetchAttendance() {
    const courseId = document.getElementById("vCourseId").value;
    const sectionId = document.getElementById("vSectionId").value;
    const tbody = document.getElementById("attendanceTableBody");
    const token = localStorage.getItem("token");

    if (!courseId || !sectionId) {
        alert("Please enter both Course ID and Section ID");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/Teacher/attendance/${courseId}/${sectionId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            tbody.innerHTML = ""; // Clear old data

            data.forEach(record => {
                const row = `<tr>
                    <td>${record.studentName}</td>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td><span class="badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}">${record.status}</span></td>
                </tr>`;
                tbody.innerHTML += row;
            });
        } else {
            alert("Failed to load records.");
        }
    } catch (error) {
        console.error(error);
    }
}