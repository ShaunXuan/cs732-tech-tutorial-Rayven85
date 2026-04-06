/**
 * TaskList — renders tasks split into Upcoming and All Tasks sections.
 * 任务列表组件 —— 将任务分为"即将到期"和"全部任务"两个区块。
 */
import { Clock, ClipboardList } from "lucide-react";
import TaskCard from "./TaskCard";

export default function TaskList({ tasks, upcoming, onToggle, onDelete, onSelect }) {
  // IDs of upcoming tasks — used to avoid showing them twice
  // 即将到期任务的 ID 集合，避免在"全部"区块中重复显示
  const upcomingIds = new Set(upcoming.map((t) => t.id));
  const rest = tasks.filter((t) => !upcomingIds.has(t.id));

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>No tasks found. Adjust your filters or add a task above.</p>
      </div>
    );
  }

  return (
    <div className="task-sections">
      {/* Upcoming section / 即将到期区块 */}
      {upcoming.length > 0 && (
        <section className="task-section">
          <div className="section-header upcoming-header">
            <Clock size={12} />
            Due in the next 7 days
            <span className="section-count">{upcoming.length}</span>
          </div>
          <div className="task-list">
            {upcoming.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onSelect={onSelect} />
            ))}
          </div>
        </section>
      )}

      {/* All other tasks / 其余任务 */}
      {rest.length > 0 && (
        <section className="task-section">
          <div className="section-header">
            <ClipboardList size={12} />
            All Tasks
            <span className="section-count">{tasks.length}</span>
          </div>
          <div className="task-list">
            {rest.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onSelect={onSelect} />
            ))}
          </div>
        </section>
      )}

      {/* Edge case: all results are already in the upcoming section */}
      {/* 边缘情况：所有结果都已在即将到期区块中 */}
      {rest.length === 0 && upcoming.length > 0 && (
        <section className="task-section">
          <div className="section-header">
            <ClipboardList size={12} />
            All Tasks
            <span className="section-count">{tasks.length}</span>
          </div>
          <p className="section-note">All results are shown in the upcoming section above.</p>
        </section>
      )}
    </div>
  );
}
