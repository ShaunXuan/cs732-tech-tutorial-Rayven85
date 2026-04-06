/**
 * AddTaskForm — controlled form for creating a new task.
 * AddTaskForm 组件 —— 受控表单，用于创建新任务。
 *
 * On submit, calls createTask() via the onSubmit prop,
 * which sends a POST request to FastAPI.
 * 提交时调用父组件传入的 onSubmit，最终发送 POST 请求到 FastAPI。
 */
import { useState } from "react";

// Default form state / 表单默认值
const INITIAL = {
  title: "",
  course: "",
  due_date: "",
  priority: "medium",
};

export default function AddTaskForm({ onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic client-side check before sending to FastAPI
    // FastAPI 也会验证，但先做一次简单的前端检查
    if (!form.title.trim() || !form.course.trim() || !form.due_date) {
      setError("Title, course, and due date are required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(INITIAL); // Reset form on success / 成功后重置表单
    } catch (err) {
      setError("Failed to create task. Please check your input.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <h2>Add New Task</h2>

      <div className="form-row">
        {/* Title field / 标题输入 */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task title *"
          maxLength={200}
        />
        {/* Course field / 课程代码输入 */}
        <input
          name="course"
          value={form.course}
          onChange={handleChange}
          placeholder="Course (e.g. COMPSCI732) *"
          maxLength={50}
        />
      </div>

      <div className="form-row">
        {/* Due date field / 截止日期 */}
        <input
          name="due_date"
          type="date"
          value={form.due_date}
          onChange={handleChange}
        />
        {/* Priority selector — mirrors the FastAPI Literal enum / 优先级选择器 */}
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit" className="btn-add" disabled={submitting}>
          {submitting ? "Adding…" : "+ Add Task"}
        </button>
      </div>

      {/* Show error from FastAPI or client validation / 显示来自 FastAPI 或客户端的错误 */}
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
