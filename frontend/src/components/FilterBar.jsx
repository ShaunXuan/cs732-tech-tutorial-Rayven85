/**
 * FilterBar — search and filter controls.
 * 过滤栏组件 —— 搜索框和各种过滤选项。
 *
 * Course dropdown shows unique PREFIXES (e.g. "COMPSCI", "SOFTENG")
 * extracted from full course codes, matching the backend's prefix-filter logic.
 * 课程下拉显示前缀（如 "COMPSCI"），与后端前缀匹配逻辑对应。
 */
import { Search, X } from "lucide-react";

// Extract leading alphabetic prefix from a course code: "COMPSCI732" → "COMPSCI"
// 用正向匹配提取开头的字母部分，比 replace 更稳健
function coursePrefix(code) {
  const match = code.match(/^[A-Za-z]+/);
  return match ? match[0].toUpperCase() : "";
}

export default function FilterBar({ filters, onChange, courses }) {
  function handle(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  function clearAll() {
    onChange({ search: "", course: "", priority: "", completed: "", sort_by: "" });
  }

  // Unique sorted prefixes — filter(Boolean) removes any empty strings
  // 去重排序后的课程前缀，filter(Boolean) 过滤掉空字符串
  const prefixes = [...new Set(courses.map(coursePrefix))].filter(Boolean).sort();

  const hasActive =
    filters.search || filters.course || filters.priority ||
    filters.completed !== "" || filters.sort_by;

  return (
    <div className="filter-bar">
      {/* Search / 搜索框 */}
      <div className="filter-search">
        <span className="search-icon-wrap">
          <Search size={13} />
        </span>
        <input
          name="search"
          value={filters.search}
          onChange={handle}
          placeholder="Search tasks by title or description…"
          className="search-input"
        />
      </div>

      <div className="filter-controls">
        {/* Course prefix filter / 课程前缀过滤 */}
        <select name="course" value={filters.course} onChange={handle} className="filter-select">
          <option value="">All courses</option>
          {prefixes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Priority filter / 优先级过滤 */}
        <select name="priority" value={filters.priority} onChange={handle} className="filter-select">
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Status filter / 完成状态过滤 */}
        <select name="completed" value={filters.completed} onChange={handle} className="filter-select">
          <option value="">All status</option>
          <option value="false">Pending</option>
          <option value="true">Completed</option>
        </select>

        {/* Sort / 排序 */}
        <select name="sort_by" value={filters.sort_by} onChange={handle} className="filter-select">
          <option value="">Sort by…</option>
          <option value="due_date">Due date</option>
          <option value="priority">Priority</option>
          <option value="created_at">Created</option>
        </select>

        {/* Clear / 清除 */}
        {hasActive && (
          <button className="btn-clear" onClick={clearAll}>
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
