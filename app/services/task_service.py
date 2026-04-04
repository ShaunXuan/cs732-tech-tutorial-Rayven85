"""
Business logic for task operations.
任务的业务逻辑层 —— 负责处理过滤、排序、校验等核心逻辑，
保持路由层（router）简洁，不直接操作存储。
"""

from datetime import date, datetime, timedelta
from typing import Literal, Optional
from uuid import uuid4

from fastapi import HTTPException, status

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate
import app.storage.in_memory as store

# Priority ordering used when sorting / 优先级排序权重映射
PRIORITY_ORDER: dict[str, int] = {"low": 0, "medium": 1, "high": 2}


def list_tasks(
    course: Optional[str] = None,
    completed: Optional[bool] = None,
    sort_by: Optional[Literal["due_date", "priority", "created_at"]] = None,
) -> list[Task]:
    """
    Return all tasks, optionally filtered and sorted.
    返回所有任务，支持按课程、完成状态过滤，以及按字段排序。
    """
    tasks = store.get_all()

    # Filter by course (case-insensitive) / 按课程过滤（忽略大小写）
    if course is not None:
        tasks = [t for t in tasks if t.course.lower() == course.lower()]

    # Filter by completion status / 按完成状态过滤
    if completed is not None:
        tasks = [t for t in tasks if t.completed == completed]

    # Sort results / 排序
    if sort_by == "due_date":
        tasks.sort(key=lambda t: t.due_date)
    elif sort_by == "priority":
        # Sort high → medium → low / 从高到低优先级排序
        tasks.sort(key=lambda t: PRIORITY_ORDER[t.priority], reverse=True)
    elif sort_by == "created_at":
        tasks.sort(key=lambda t: t.created_at)

    return tasks


def get_task(task_id: str) -> Task:
    """
    Fetch a single task by ID. Raises 404 if not found.
    根据 ID 获取单个任务，找不到则抛出 404 错误。
    """
    task = store.get_by_id(task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id '{task_id}' not found.",
        )
    return task


def create_task(data: TaskCreate) -> Task:
    """
    Create a new task from validated input data.
    根据验证过的请求数据创建新任务，自动生成 id 和时间戳。
    """
    now = datetime.utcnow()
    task = Task(
        id=str(uuid4()),          # Generate a unique ID / 生成唯一 ID
        title=data.title,
        description=data.description,
        course=data.course,
        due_date=data.due_date,
        priority=data.priority,
        completed=data.completed,
        created_at=now,
        updated_at=now,
    )
    return store.add(task)


def update_task(task_id: str, data: TaskUpdate) -> Task:
    """
    Apply a partial update to an existing task.
    对已有任务进行部分更新：只更新请求体中明确提供的字段。
    """
    task = get_task(task_id)  # Will raise 404 if missing / 不存在则 404

    # Only update fields that were explicitly provided in the request body
    # 只覆盖请求体中明确设置的字段（值不为 None 的字段）
    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    if data.course is not None:
        task.course = data.course
    if data.due_date is not None:
        task.due_date = data.due_date
    if data.priority is not None:
        task.priority = data.priority
    if data.completed is not None:
        task.completed = data.completed

    task.updated_at = datetime.utcnow()  # Refresh updated timestamp / 刷新更新时间
    return store.update(task)


def delete_task(task_id: str) -> None:
    """
    Delete a task by ID. Raises 404 if not found.
    根据 ID 删除任务，找不到则抛出 404 错误。
    """
    get_task(task_id)  # Validate existence first / 先验证任务存在
    store.delete(task_id)


def get_upcoming_tasks(days: int = 7) -> list[Task]:
    """
    Return tasks due within the next `days` days (incomplete only).
    返回未来 `days` 天内到期的未完成任务，默认 7 天。
    """
    today = date.today()
    cutoff = today + timedelta(days=days)

    upcoming = [
        t for t in store.get_all()
        if not t.completed and today <= t.due_date <= cutoff
    ]
    # Sort by due date ascending / 按到期日升序排列
    upcoming.sort(key=lambda t: t.due_date)
    return upcoming


def get_stats() -> dict:
    """
    Return a summary of all tasks.
    返回任务统计摘要：总数、已完成数、未完成数、完成率等。
    """
    tasks = store.get_all()
    total = len(tasks)
    completed = sum(1 for t in tasks if t.completed)
    pending = total - completed

    # Count by priority level / 按优先级统计数量
    by_priority = {"low": 0, "medium": 0, "high": 0}
    for t in tasks:
        by_priority[t.priority] += 1

    # Collect unique course codes / 收集所有课程代码
    courses = sorted({t.course for t in tasks})

    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "completion_rate": round(completed / total * 100, 1) if total > 0 else 0.0,
        "by_priority": by_priority,
        "courses": courses,
    }
