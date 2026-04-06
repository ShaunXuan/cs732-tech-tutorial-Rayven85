/**
 * Centralised API module — all calls to the FastAPI backend live here.
 * 集中式 API 模块 —— 所有对 FastAPI 后端的请求都放在这里。
 */

const BASE_URL = "http://localhost:8000";

/**
 * Fetch all tasks with optional filters.
 * 获取所有任务，支持过滤、搜索和排序。
 * @param {Object} filters - { course, completed, priority, search, sort_by }
 */
export async function fetchTasks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.course) params.set("course", filters.course);
  if (filters.completed !== undefined && filters.completed !== "")
    params.set("completed", filters.completed);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort_by) params.set("sort_by", filters.sort_by);

  const url = `${BASE_URL}/tasks/${params.toString() ? "?" + params : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

/**
 * Create a new task (POST /tasks/).
 * 创建新任务。
 */
export async function createTask(data) {
  const response = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(JSON.stringify(err.detail));
  }
  return response.json();
}

/**
 * Toggle the completed status of a task (PUT /tasks/{id}).
 * 切换任务完成状态。
 */
export async function toggleComplete(taskId, completed) {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

/**
 * Delete a task by ID (DELETE /tasks/{id}).
 * 根据 ID 删除任务。
 */
export async function deleteTask(taskId) {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete task");
}

/**
 * Fetch task statistics (GET /tasks/stats).
 * 获取任务统计摘要。
 */
export async function fetchStats() {
  const response = await fetch(`${BASE_URL}/tasks/stats`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

/**
 * Fetch upcoming tasks (GET /tasks/upcoming).
 * 获取即将到期的任务。
 */
export async function fetchUpcoming() {
  const response = await fetch(`${BASE_URL}/tasks/upcoming`);
  if (!response.ok) throw new Error("Failed to fetch upcoming tasks");
  return response.json();
}
