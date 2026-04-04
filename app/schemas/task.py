"""
Pydantic schemas for request validation and response serialisation.
Pydantic schema 定义 —— 用于 API 请求的参数验证和响应序列化。

FastAPI 使用这些 schema 来：
1. 自动验证请求体（POST/PUT）
2. 生成 /docs 的交互式文档
3. 序列化 JSON 响应
"""

from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    """
    Schema for creating a new task (POST /tasks).
    创建新任务时使用的请求体 schema。
    客户端提交这些字段，id 和时间戳由服务端自动生成。
    """

    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title",
        examples=["COMPSCI732 Tech Tutorial Report"],
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional longer description of the task",
        examples=["Write a 2000-word tutorial report on FastAPI"],
    )
    course: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Course code this task belongs to",
        examples=["COMPSCI732"],
    )
    due_date: date = Field(
        ...,
        description="Due date in ISO format (YYYY-MM-DD)",
        examples=["2026-05-01"],
    )
    priority: Literal["low", "medium", "high"] = Field(
        default="medium",
        description="Task priority level",
        examples=["high"],
    )
    completed: bool = Field(
        default=False,
        description="Whether the task is completed",
    )


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task (PUT /tasks/{task_id}).
    更新任务时使用的请求体 schema。
    所有字段都是可选的，只需传入想要修改的字段（部分更新）。
    """

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    course: Optional[str] = Field(default=None, min_length=1, max_length=50)
    due_date: Optional[date] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    completed: Optional[bool] = None


class TaskResponse(BaseModel):
    """
    Schema for task responses returned to the client.
    返回给客户端的任务响应 schema，包含所有字段（含 id 和时间戳）。
    """

    # Allow building from plain objects (not just dicts)
    # 允许从非字典对象（如内部 Task 类实例）构建此 schema
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str]
    course: str
    due_date: date
    priority: Literal["low", "medium", "high"]
    completed: bool
    created_at: datetime
    updated_at: datetime
