// 1. Verify User is Admin
checkAuth("Admin");

// Tab Navigation Logic
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach(t => t.style.display = 'none');
    
    // Show selected tab
    document.getElementById('tab-' + tabName).style.display = 'block';
    
    // Update Header
    const titles = {
        'users': 'Manage Users',
        'sessions': 'Academic Sessions',
        'courses': 'Courses',
        'sections': 'Sections',
        'assignments': 'Assignments'
    };
    document.getElementById('pageTitle').innerText = titles[tabName];
    
    // Clear messages
    document.getElementById("statusMessage").style.display = 'none';
}

// Initialize Default Tab
showTab('users');

// Helper for API Calls
async function postData(endpoint, data) {
    const token = localStorage.getItem("token");
    const msgDiv = document.getElementById("statusMessage");

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            msgDiv.className = "alert alert-success";
            msgDiv.innerText = "Operation Successful!";
            msgDiv.style.display = "block";
            return true;
        } else {
            const err = await response.text();
            msgDiv.className = "alert alert-danger";
            msgDiv.innerText = "Error: " + err;
            msgDiv.style.display = "block";
            return false;
        }
    } catch (error) {
        msgDiv.className = "alert alert-danger";
        msgDiv.innerText = "Connection Failed";
        msgDiv.style.display = "block";
        return false;
    }
}

// --- FORM EVENT LISTENERS ---

// 1. Register User
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById("regName").value,
        email: document.getElementById("regEmail").value,
        password: document.getElementById("regPassword").value,
        role: document.getElementById("regRole").value
    };
    // Note: Registration goes to Auth controller, not Admin controller
    if(await postData("Auth/register", data)) e.target.reset();
});

// 2. Create Session
document.getElementById("sessionForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById("sessName").value,
        startDate: document.getElementById("sessStart").value,
        endDate: document.getElementById("sessEnd").value
    };
    if(await postData("Admin/sessions", data)) e.target.reset();
});

// 3. Create Course
document.getElementById("courseForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById("courseName").value,
        code: document.getElementById("courseCode").value,
        creditHours: parseInt(document.getElementById("courseCredit").value)
    };
    if(await postData("Admin/courses", data)) e.target.reset();
});

// 4. Create Section
document.getElementById("sectionForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById("sectName").value,
        academicSessionId: parseInt(document.getElementById("sectSessionId").value)
    };
    if(await postData("Admin/sections", data)) e.target.reset();
});

// 5a. Assign Teacher
document.getElementById("assignTeacherForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        teacherId: parseInt(document.getElementById("atTeacherId").value),
        courseId: parseInt(document.getElementById("atCourseId").value),
        sectionId: parseInt(document.getElementById("atSectionId").value)
    };
    if(await postData("Admin/assign-teacher", data)) e.target.reset();
});

// 5b. Enroll Student
document.getElementById("enrollStudentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        studentId: parseInt(document.getElementById("esStudentId").value),
        courseId: parseInt(document.getElementById("esCourseId").value),
        sectionId: parseInt(document.getElementById("esSectionId").value)
    };
    if(await postData("Admin/enroll-student", data)) e.target.reset();
});