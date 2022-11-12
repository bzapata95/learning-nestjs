import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { search, status } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((tasks) => tasks.status === status);
    }

    if (search) {
      tasks = tasks.filter((tasks) => {
        if (
          tasks.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||tasks.description.toLocaleLowerCase().includes(search.toLocaleLowerCase()) 
        ) {
          return true;
        }
        return false
      });
    }

    return tasks;
  }

  createTask({ description, title }: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getOneById(id: string): Task {
    return this.tasks.find((d) => d.id === id);
  }

  deleteTaskById(id: string): void {
    const newData = this.tasks.filter((d) => d.id !== id);
    this.tasks = newData;
  }

  updateTaskStatus({ id, status }: UpdateTaskStatusDto): Task {
    const findIndex = this.tasks.findIndex((task) => task.id === id);

    this.tasks[findIndex] = {
      ...this.tasks[findIndex],
      status,
    };

    return this.tasks[findIndex];
  }
}
