"""
FastAPI application entry point.
FastAPI 应用入口 —— 创建 app 实例，注册路由，并在启动时写入演示数据。
"""

from contextlib import asynccontextmanager
from datetime import date, datetime

from fastapi import FastAPI

from app.routers.tasks import router as tasks_router
import app.storage.in_memory as store
from app.models.task import Task


# ---------------------------------------------------------------------------
# Seed data — pre-populated on startup for demo convenience
# 演示用种子数据 —— 启动时自动写入，方便直接在 /docs 中测试
# ---------------------------------------------------------------------------
SEED_TASKS = [
    Task(
        id="demo-001",
        title="COMPSCI732 Tech Tutorial Report",
        description="Write a 2000-word tutorial report on a chosen framework and record a short demo video.",
        course="COMPSCI732",
        due_date=date(2026, 5, 1),
        priority="high",
        completed=False,
        created_at=datetime(2026, 4, 1, 9, 0, 0),
        updated_at=datetime(2026, 4, 1, 9, 0, 0),
    ),
    Task(
        id="demo-002",
        title="SOFTENG750 Final Project",
        description="Implement the full-stack web application and submit the group report.",
        course="SOFTENG750",
        due_date=date(2026, 5, 20),
        priority="high",
        completed=False,
        created_at=datetime(2026, 4, 2, 10, 0, 0),
        updated_at=datetime(2026, 4, 2, 10, 0, 0),
    ),
    Task(
        id="demo-003",
        title="COMPSCI369 Assignment 2",
        description="Solve the dynamic programming problem set.",
        course="COMPSCI369",
        due_date=date(2026, 4, 15),
        priority="medium",
        completed=True,
        created_at=datetime(2026, 3, 20, 8, 0, 0),
        updated_at=datetime(2026, 4, 3, 14, 0, 0),
    ),
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs on application startup: seeds the in-memory store with demo tasks.
    应用启动时运行：将演示任务写入内存存储，方便开箱即用地测试 API。
    """
    for task in SEED_TASKS:
        store.add(task)
    yield  # Application runs here / 应用在这里运行
    # (Shutdown logic could go here if needed) / 关闭时的清理逻辑可写在此处


# ---------------------------------------------------------------------------
# Create the FastAPI application instance
# 创建 FastAPI 应用实例，这里的 title/description/version 会显示在 /docs 页面
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Student Task Manager API",
    description=(
        "A RESTful API for managing student assignments and tasks. "
        "Built with **FastAPI** to demonstrate automatic request validation, "
        "Pydantic schemas, and auto-generated OpenAPI documentation.\n\n"
        "**Tutorial project for COMPSCI732 — University of Auckland**"
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Register the tasks router / 注册任务路由
app.include_router(tasks_router)


# ---------------------------------------------------------------------------
# Health check endpoint
# 健康检查端点 —— 用于快速确认 API 服务是否正常运行
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"], summary="Health check")
def health_check():
    """
    Returns a simple message confirming the API is running.
    返回一条简单消息，确认 API 服务正常运行。
    """
    return {
        "status": "ok",
        "message": "Student Task Manager API is running.",
        "docs": "/docs",
    }
