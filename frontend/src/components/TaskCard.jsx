/**
 * TaskCard — displays a single task with actions.
 * TaskCard 组件 —— 展示单条任务，包含完成勾选和删除按钮。
 */
export default function TaskCard({ task, onToggle, onDelete }) {
  // Format ISO date string to readable format / 将 ISO 日期格式化为可读格式
  const formattedDate = new Date(task.due_date + "T00:00:00").toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      {/* Completed checkbox — calls PUT /tasks/{id} via onToggle */}
      {/* 完成勾选框 —— 触发 PUT /tasks/{id} 请求 */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, task.completed)}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
      />

      <div className="task-info">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span>{task.course}</span>
          <span>Due: {formattedDate}</span>
          {/* Priority badge with colour by level / 按优先级显示不同颜色徽标 */}
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        </div>
      </div>

      {/* Delete button — calls DELETE /tasks/{id} */}
      {/* 删除按钮 —— 触发 DELETE /tasks/{id} 请求 */}
      <button
        className="btn-delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.title}"`}
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
}
