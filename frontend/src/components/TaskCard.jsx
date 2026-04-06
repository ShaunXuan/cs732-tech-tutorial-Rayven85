/**
 * TaskCard — compact single-row task display (layout option 5.A).
 * 任务卡片组件 —— 紧凑单行布局：标题和元信息在同一行。
 */
import { BookOpen, Calendar, Trash2 } from "lucide-react";

// Calculate days until due date / 计算距截止日期的天数
function daysUntil(dueDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr + "T00:00:00");
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
}

function dueDateInfo(dueDateStr) {
  const days = daysUntil(dueDateStr);
  const formatted = new Date(dueDateStr + "T00:00:00").toLocaleDateString("en-NZ", {
    day: "numeric", month: "short", year: "numeric",
  });
  if (days < 0)  return { text: `${formatted} — overdue`, cls: "due-overdue" };
  if (days === 0) return { text: `${formatted} — today`,   cls: "due-today" };
  if (days <= 3)  return { text: `${formatted} — ${days}d left`, cls: "due-soon" };
  return { text: formatted, cls: "due-normal" };
}

export default function TaskCard({ task, onToggle, onDelete, onSelect }) {
  const { text: dateText, cls: dateCls } = dueDateInfo(task.due_date);

  return (
    // Click the card body to open detail modal / 点击卡片打开详情弹窗
    <div
      className={`task-card priority-border-${task.priority} ${task.completed ? "completed" : ""}`}
      onClick={() => onSelect(task)}
    >
      {/* Checkbox — stopPropagation so card click doesn't fire / 阻止冒泡，避免触发卡片点击 */}
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, task.completed)}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
      />

      {/* Title / 标题 */}
      <span className="task-title">{task.title}</span>

      {/* Meta / 元信息 */}
      <div className="task-meta">
        <span className="meta-item">
          <BookOpen size={11} />
          {task.course}
        </span>
        <span className={`meta-item ${dateCls}`}>
          <Calendar size={11} />
          {dateText}
        </span>
        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
      </div>

      {/* Delete — stopPropagation so modal doesn't open / 删除按钮，阻止冒泡 */}
      <button
        className="btn-delete"
        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
        aria-label={`Delete "${task.title}"`}
        title="Delete task"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
