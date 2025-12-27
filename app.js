const API_BASE_URL = "https://localhost:7239/api/Tasks";

// ============================
// DOCUMENT READY
// ============================
$(document).ready(function () {

  // ============================
  // ADD TASK
  // ============================
  if ($("#addTaskForm").length) {
    $("#addTaskForm").submit(function (e) {
      e.preventDefault();

      const task = {
        title: $("#taskTitle").val(),
        description: $("#taskDescription").val(),
        assignedTo: $("#assignedTo").val(),
        priority: $("#priority").val(),
        status: "Pending",
        dueDate: $("#dueDate").val()
      };

      $.ajax({
        url: API_BASE_URL,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(task),
        success: function () {
          alert("✅ Task added successfully");
          window.location.href = "tasks.html";
        },
        error: function () {
          alert("❌ Failed to add task");
        }
      });
    });
  }

  // ============================
  // LOAD TASKS TABLE
  // ============================
  if ($("#taskTableBody").length) {
    loadTasks();
  }

  // ============================
  // DASHBOARD COUNTS
  // ============================
  if ($("#totalTasks").length) {
    loadDashboard();
  }

});

// ============================
// LOAD TASKS
// ============================
function loadTasks() {
  $.get(API_BASE_URL, function (tasks) {
    const tbody = $("#taskTableBody");
    tbody.empty();

    if (tasks.length === 0) {
      tbody.append(`
        <tr>
          <td colspan="6" class="text-center text-muted">
            No tasks available
          </td>
        </tr>
      `);
      return;
    }

    tasks.forEach((task, index) => {
      tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${task.title}</td>
          <td>${task.assignedTo}</td>
          <td>${task.priority}</td>
          <td>${task.status}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
              Delete
            </button>
          </td>
        </tr>
      `);
    });
  });
}

// ============================
// DELETE TASK
// ============================
function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  $.ajax({
    url: `${API_BASE_URL}/${id}`,
    type: "DELETE",
    success: function () {
      alert("✅ Task deleted");
      loadTasks();
      loadDashboard();
    },
    error: function () {
      alert("❌ Failed to delete task");
    }
  });
}

// ============================
// DASHBOARD COUNTS
// ============================
function loadDashboard() {
  $.get(API_BASE_URL, function (tasks) {
    $("#totalTasks").text(tasks.length);
    $("#pendingTasks").text(tasks.filter(t => t.status === "Pending").length);
    $("#inProgressTasks").text(tasks.filter(t => t.status === "In Progress").length);
    $("#completedTasks").text(tasks.filter(t => t.status === "Completed").length);
  });
}
