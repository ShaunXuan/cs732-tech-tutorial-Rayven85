/**
 * TaskModal — detail overlay shown when a task card is clicked.
 * 任务详情弹窗 —— 点击任务卡片后展示的覆盖层。
 *
 * Rendered with a portal so it sits above everything else in the DOM.
 * 使用 portal 渲染，确保弹窗层级最高，不受父元素样式影响。
 */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, BookOpen, Calendar, Flag, CheckCircle2, Clock, AlignLeft } from "lucide-react";

// Format ISO date string for display / 将 ISO 日期字符串格式化为可读格式
function formatDate(isoStr) {
  return new Date(isoStr).toLocaleDateString("en-NZ", {
    weekday: "short", year: "numeric", month: "long", day: "numeric",
  });
}

function formatDateTime(isoStr) {
  return new Date(isoStr).toLocaleString("en-NZ", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// Days remaining label / 剩余天数标签
function daysLabel(dueDateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr + "T00:00:00");
  const days = Math.round((due - today) / 86400000);
  if (days < 0) return { text: `${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} overdue`, cls: "modal-due-overdue" };
  if (days === 0) return { text: "Due today", cls: "modal-due-today" };
  if (days === 1) return { text: "Due tomorrow", cls: "modal-due-soon" };
  return { text: `${days} days remaining`, cls: "modal-due-ok" };
}

const PRIORITY_LABEL = { high: "High", medium: "Medium", low: "Low" };

export default function TaskModal({ task, onClose }) {
  // Close on Escape key / 按 Escape 键关闭
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll while modal is open / 防止背景滚动
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const { text: dueText, cls: dueCls } = daysLabel(task.due_date);

  return createPortal(
    // Backdrop — click outside to close / 点击背景关闭
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop close when clicking card / 阻止点击卡片时关闭
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className={`modal-badge modal-badge-${task.priority}`}>
              {PRIORITY_LABEL[task.priority]}
            </span>
            {task.completed && (
              <span className="modal-badge modal-badge-done">Completed</span>
            )}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Title */}
        <h2 className={`modal-title ${task.completed ? "modal-title-done" : ""}`}>
          {task.title}
        </h2>

        {/* Description */}
        <div className="modal-section">
          <div className="modal-section-label">
            <AlignLeft size={13} />
            Description
          </div>
          {task.description ? (
            <p className="modal-description">{task.description}</p>
          ) : (
            <p className="modal-description modal-description-empty">No description provided.</p>
          )}
        </div>

        {/* Meta grid */}
        <div className="modal-meta-grid">
          <div className="modal-meta-item">
            <BookOpen size={13} className="modal-meta-icon" />
            <div>
              <div className="modal-meta-label">Course</div>
              <div className="modal-meta-value">{task.course}</div>
            </div>
          </div>

          <div className="modal-meta-item">
            <Calendar size={13} className="modal-meta-icon" />
            <div>
              <div className="modal-meta-label">Due Date</div>
              <div className="modal-meta-value">{formatDate(task.due_date + "T00:00:00")}</div>
              <div className={`modal-meta-sub ${dueCls}`}>{dueText}</div>
            </div>
          </div>

          <div className="modal-meta-item">
            <Flag size={13} className="modal-meta-icon" />
            <div>
              <div className="modal-meta-label">Priority</div>
              <div className="modal-meta-value">{PRIORITY_LABEL[task.priority]}</div>
            </div>
          </div>

          <div className="modal-meta-item">
            <CheckCircle2 size={13} className="modal-meta-icon" />
            <div>
              <div className="modal-meta-label">Status</div>
              <div className="modal-meta-value">{task.completed ? "Completed" : "Pending"}</div>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="modal-timestamps">
          <span className="modal-ts-item">
            <Clock size={11} />
            Created: {formatDateTime(task.created_at)}
          </span>
          <span className="modal-ts-item">
            <Clock size={11} />
            Updated: {formatDateTime(task.updated_at)}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
