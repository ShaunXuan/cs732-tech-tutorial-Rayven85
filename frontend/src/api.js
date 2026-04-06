/**
 * Centralised API module — all calls to the FastAPI backend live here.
 * 集中式 API 模块 —— 所有对 FastAPI 后端的请求都放在这里。
 *
 * This pattern keeps components clean: they call these functions instead of
 * writing fetch() directly. It also makes the base URL easy to change.
 * 这种模式让组件保持简洁：组件调用这些函数，而不是直接写 fetch()。
 * 同时也方便统一修改后端地址。
 */

// Base URL of the FastAPI backend / FastAPI 后端的基础地址
const BASE_URL = "http://localhost:8000";

/**
 * Fetch all tasks, with optional filters.
 * 获取所有任务，支持可选过滤参数。
 * @param {Object} filters - { course, completed, sort_by }
 */
export async function fetchTasks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.course) params.set("course", filters.course);
  if (filters.completed !== undefined && filters.completed !== "")
    params.set("completed", filters.completed);
  if (filters.sort_by) params.set("sort_by", filters.sort_by);

  const url = `${BASE_URL}/tasks/${params.toString() ? "?" + params : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

/**
 * Create a new task.
 * 创建一个新任务。
 * @param {Object} data - TaskCreate fields
 */
export async function createTask(data) {
  const response = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    // Extract FastAPI validation error detail / 提取 FastAPI 验证错误详情
    const err = await response.json();
    throw new Error(JSON.stringify(err.detail));
  }
  return response.json();
}

/**
 * Toggle the completed status of a task.
 * 切换任务的完成状态。
 * @param {string} taskId
 * @param {boolean} completed - new completed value / 新的完成状态值
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
 * Delete a task by ID.
 * 根据 ID 删除任务。
 * @param {string} taskId
 */
export async function deleteTask(taskId) {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
  // 204 No Content is success — no JSON body / 204 表示成功，没有响应体
  if (!response.ok) throw new Error("Failed to delete task");
}

/**
 * Fetch task statistics summary.
 * 获取任务统计摘要。
 */
export async function fetchStats() {
  const response = await fetch(`${BASE_URL}/tasks/stats`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}
