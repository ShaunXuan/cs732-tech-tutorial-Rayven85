/**
 * App — root component, manages global state.
 * App 根组件 —— 管理全局状态，协调所有子组件。
 */
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  fetchTasks, fetchStats, fetchUpcoming,
  createTask, toggleComplete, deleteTask,
} from "./api";
import StatsCards from "./components/StatsCards";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import TaskModal from "./components/TaskModal";

const EMPTY_FILTERS = {
  search: "", course: "", priority: "", completed: "", sort_by: "",
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedTask, setSelectedTask] = useState(null); // modal state / 弹窗状态
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(EMPTY_FILTERS); }, []);

  async function loadAll(currentFilters) {
    setLoading(true);
    setError("");
    try {
      // Parallel requests to FastAPI / 并行发出三个 FastAPI 请求
      const [taskData, statsData, upcomingData] = await Promise.all([
        fetchTasks(currentFilters),
        fetchStats(),
        fetchUpcoming(),
      ]);
      setTasks(taskData);
      setStats(statsData);
      setUpcoming(upcomingData);
    } catch {
      setError("Could not connect to the API. Is the FastAPI backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
    loadAll(newFilters);
  }

  async function handleCreate(formData) {
    await createTask(formData);
    await loadAll(filters);
  }

  async function handleToggle(taskId, currentCompleted) {
    await toggleComplete(taskId, !currentCompleted);
    await loadAll(filters);
  }

  async function handleDelete(taskId) {
    await deleteTask(taskId);
    if (selectedTask?.id === taskId) setSelectedTask(null); // close modal if deleted task was open
    await loadAll(filters);
  }

  const courses = stats?.courses ?? [];

  return (
    <div className="app">
      {/* Header (3.B — light, matches page bg) / 轻色 Header，与页面背景色一致 */}
      <header className="app-header">
        <div className="header-inner">
          <div>
            <h1 className="app-title">Student Task Manager</h1>
            <p className="app-subtitle">FastAPI + React · COMPSCI732</p>
          </div>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="docs-link"
          >
            API Docs
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      <main className="app-main">
        <StatsCards stats={stats} />
        <AddTaskForm onSubmit={handleCreate} />
        <FilterBar filters={filters} onChange={handleFilterChange} courses={courses} />

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading tasks…</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            upcoming={upcoming}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onSelect={setSelectedTask}
          />
        )}
      </main>

      {/* Task detail modal — shown when a card is clicked / 点击卡片后显示的详情弹窗 */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
