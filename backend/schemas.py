from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    due_date: Optional[date] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[date] = None
    is_done: Optional[bool] = None


class TaskOut(TaskBase):
    id: int
    is_done: bool
    created_at: datetime

    class Config:
        from_attributes = True
