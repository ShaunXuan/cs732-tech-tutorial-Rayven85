"""
Internal Task model (data layer representation).
内部任务模型 —— 代表存储层中每个任务的数据结构。
这个模型用于应用内部传递数据，与 Pydantic schema 分开定义，
体现 "内部模型" 与 "API 接口模型" 的职责分离。
"""

from datetime import date, datetime
from typing import Literal, Optional


class Task:
    """
    Represents a student task/assignment.
    代表一条学生任务/作业记录。
    """

    def __init__(
        self,
        id: str,
        title: str,
        course: str,
        due_date: date,
        description: Optional[str] = None,
        priority: Literal["low", "medium", "high"] = "medium",
        completed: bool = False,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ) -> None:
        self.id = id
        self.title = title
        self.course = course
        self.due_date = due_date
        self.description = description
        self.priority = priority
        self.completed = completed
        # Default timestamps to now if not provided
        # 若未提供时间戳，默认使用当前时间
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def __repr__(self) -> str:
        return f"<Task id={self.id!r} title={self.title!r} course={self.course!r}>"
