"""
Task router — defines all /tasks API endpoints.
任务路由 —— 定义所有 /tasks 相关的 API 端点。

路由层只负责 HTTP 层面的事情（参数解析、状态码、响应格式），
具体业务逻辑委托给 task_service。
"""

from typing import Literal, Optional

from fastapi import APIRouter, Query, status

from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
import app.services.task_service as service

# Create a router with the /tasks prefix and a tag for /docs grouping
# 创建带 /tasks 前缀的路由，tag 用于 /docs 页面的分组展示
router = APIRouter(prefix="/tasks", tags=["Tasks"])


# ---------------------------------------------------------------------------
# GET /tasks
# ---------------------------------------------------------------------------
@router.get(
    "/",
    response_model=list[TaskResponse],
    summary="List all tasks",
    description=(
        "Retrieve all tasks. "
        "Optionally filter by **course** or **completed** status, "
        "and sort by **due_date**, **priority**, or **created_at**."
    ),
)
def list_tasks(
    course: Optional[str] = Query(
        default=None,
        description="Filter by course code (e.g. COMPSCI732)",
        examples=["COMPSCI732"],
    ),
    completed: Optional[bool] = Query(
        default=None,
        description="Filter by completion status (true / false)",
    ),
    sort_by: Optional[Literal["due_date", "priority", "created_at"]] = Query(
        default=None,
        description="Sort results by this field",
    ),
):
    """
    Return a list of tasks.
    返回任务列表，支持过滤和排序。
    """
    tasks = service.list_tasks(course=course, completed=completed, sort_by=sort_by)
    # Convert internal Task objects to response schema
    # 将内部 Task 对象转换为响应 schema 格式
    return [TaskResponse.model_validate(t.__dict__) for t in tasks]


# ---------------------------------------------------------------------------
# GET /tasks/upcoming  (must be defined BEFORE /tasks/{task_id})
# 必须定义在 /{task_id} 路由之前，否则 "upcoming" 会被当成 task_id 匹配
# ---------------------------------------------------------------------------
@router.get(
    "/upcoming",
    response_model=list[TaskResponse],
    summary="Get upcoming tasks",
    description="Return incomplete tasks due within the next 7 days, sorted by due date.",
)
def get_upcoming_tasks():
    """
    Upcoming tasks due in the next 7 days.
    返回未来 7 天内到期的未完成任务。
    """
    tasks = service.get_upcoming_tasks(days=7)
    return [TaskResponse.model_validate(t.__dict__) for t in tasks]


# ---------------------------------------------------------------------------
# GET /tasks/stats
# ---------------------------------------------------------------------------
@router.get(
    "/stats",
    summary="Get task statistics",
    description="Return a summary of all tasks: totals, completion rate, and breakdown by priority.",
)
def get_stats():
    """
    Task summary statistics.
    返回任务统计摘要。
    """
    return service.get_stats()


# ---------------------------------------------------------------------------
# GET /tasks/{task_id}
# ---------------------------------------------------------------------------
@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Get a single task",
    description="Retrieve a task by its unique ID. Returns 404 if not found.",
)
def get_task(task_id: str):
    """
    Fetch one task by ID.
    根据 ID 获取单个任务。
    """
    task = service.get_task(task_id)
    return TaskResponse.model_validate(task.__dict__)


# ---------------------------------------------------------------------------
# POST /tasks
# ---------------------------------------------------------------------------
@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,   # Return 201 Created on success / 成功时返回 201
    summary="Create a new task",
    description=(
        "Create a new student task. "
        "FastAPI automatically validates the request body against the **TaskCreate** schema."
    ),
)
def create_task(data: TaskCreate):
    """
    Create a task with validated input.
    使用 Pydantic 验证后的数据创建任务。
    """
    task = service.create_task(data)
    return TaskResponse.model_validate(task.__dict__)


# ---------------------------------------------------------------------------
# PUT /tasks/{task_id}
# ---------------------------------------------------------------------------
@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update a task",
    description=(
        "Update an existing task. "
        "All fields are **optional** — only the fields you include will be updated."
    ),
)
def update_task(task_id: str, data: TaskUpdate):
    """
    Partial update of a task.
    部分更新任务：只修改请求体中提供的字段。
    """
    task = service.update_task(task_id, data)
    return TaskResponse.model_validate(task.__dict__)


# ---------------------------------------------------------------------------
# DELETE /tasks/{task_id}
# ---------------------------------------------------------------------------
@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,  # No response body on delete / 删除成功不返回内容
    summary="Delete a task",
    description="Delete a task by its ID. Returns 204 No Content on success.",
)
def delete_task(task_id: str):
    """
    Delete a task by ID.
    根据 ID 删除任务。
    """
    service.delete_task(task_id)
