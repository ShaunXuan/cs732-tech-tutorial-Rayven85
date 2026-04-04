"""
In-memory storage for tasks.
内存存储层 —— 使用 Python 字典模拟数据库，项目重启后数据会重置。
这种方式适合教学演示，不需要配置任何数据库。
"""

from typing import Optional
from app.models.task import Task

# The main data store: a dict mapping task ID -> Task object
# 主数据存储：字典，key 是任务 ID，value 是 Task 对象
_tasks: dict[str, Task] = {}


def get_all() -> list[Task]:
    """Return all tasks as a list. / 返回所有任务列表。"""
    return list(_tasks.values())


def get_by_id(task_id: str) -> Optional[Task]:
    """Return a single task by ID, or None if not found. / 根据 ID 查找任务，不存在则返回 None。"""
    return _tasks.get(task_id)


def add(task: Task) -> Task:
    """Insert a new task into the store. / 将新任务写入存储。"""
    _tasks[task.id] = task
    return task


def update(task: Task) -> Task:
    """Overwrite an existing task entry. / 用新对象覆盖已有任务条目。"""
    _tasks[task.id] = task
    return task


def delete(task_id: str) -> None:
    """Remove a task from the store by ID. / 根据 ID 从存储中删除任务。"""
    _tasks.pop(task_id, None)


def clear() -> None:
    """Remove all tasks — used in tests to reset state. / 清空所有任务，主要用于测试重置。"""
    _tasks.clear()
