/**
 * App — root component, manages global task state.
 * App 根组件 —— 负责管理全局任务状态和与后端的交互。
 *
 * State lives here so all child components share the same data.
 * 状态放在顶层，让所有子组件共享同一份数据。
 */
import { useEffect, useState } from "react";
import { fetchTasks, fetchStats, createTask, toggleComplete, deleteTask } from "./api";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load tasks and stats from FastAPI on mount
  // 组件挂载时从 FastAPI 加载任务和统计数据
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [taskData, statsData] = await Promise.all([fetchTasks(), fetchStats()]);
      setTasks(taskData);
      setStats(statsData);
    } catch {
      setError("Could not connect to the API. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  // Create a new task and refresh the list
  // 创建新任务后刷新列表
  async function handleCreate(formData) {
    await createTask(formData);
    await loadAll();
  }

  // Toggle completed status of a task
  // 切换任务完成状态
  async function handleToggle(taskId, currentCompleted) {
    await toggleComplete(taskId, !currentCompleted);
    await loadAll();
  }

  // Delete a task and refresh
  // 删除任务后刷新
  async function handleDelete(taskId) {
    await deleteTask(taskId);
    await loadAll();
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Student Task Manager</h1>
        <p className="app-subtitle">Powered by FastAPI + React</p>
      </header>

      <main className="app-main">
        {/* Stats bar / 统计栏 */}
        {stats && (
          <div className="stats-bar">
            <span>Total: <strong>{stats.total}</strong></span>
            <span>Completed: <strong>{stats.completed}</strong></span>
            <span>Pending: <strong>{stats.pending}</strong></span>
            <span>Completion: <strong>{stats.completion_rate}%</strong></span>
          </div>
        )}

        {/* Add task form / 创建任务表单 */}
        <AddTaskForm onSubmit={handleCreate} />

        {/* Error message / 错误信息 */}
        {error && <p className="error-msg">{error}</p>}

        {/* Task list / 任务列表 */}
        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
