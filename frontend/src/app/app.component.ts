import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { TaskSearchComponent } from './components/task/search/task-search.component';
import { TaskListComponent } from './components/task/list/task-list.component';
import { TaskService } from './services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    HeaderComponent,
    TaskSearchComponent,
    TaskListComponent,
    CommonModule,
    FormsModule,
  ],
})
export class AppComponent implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  tagColors: Record<string, string> = {};
  loading: boolean = true;
  showDeleteTaskModal: boolean = false;
  taskToDelete: any = null;

  showCreateModal: boolean = false;
  showDeleteAllModal: boolean = false;
  newTask = { title: '', description: '', tag: 'general', createdAt: '' };

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadTasks();
    this.loadTagColors();
  }

  toggleCreateModal() {
    this.showCreateModal = !this.showCreateModal;
  }

  toggleDeleteAllModal() {
    this.showDeleteAllModal = !this.showDeleteAllModal;
  }

  toggleDeleteTaskModal(task: any = null) {
    this.taskToDelete = task;
    this.showDeleteTaskModal = !!task;
  }

  confirmDeleteTask() {
    if (!this.taskToDelete) return;

    this.taskService.deleteTask(this.taskToDelete.id).subscribe({
      next: () => {
        this.deleteTaskFromList(this.taskToDelete.id);
        this.toggleDeleteTaskModal();
      },
      error: (err) => console.error('Error deleting the task:', err),
    });
  }

  createTaskFromModal() {
    const taskToCreate = {
      ...this.newTask,
      createdAt: new Date().toISOString(),
    };

    this.taskService.addTask(taskToCreate).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.filteredTasks = [...this.tasks];
        this.toggleCreateModal();
        this.refreshTags();
      },
      error: (err) => console.error('Error creating the task:', err),
    });
  }

  confirmDeleteAll() {
    this.deleteAllTasks();
    this.toggleDeleteAllModal();
  }

  loadTasks() {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.filteredTasks = [...this.tasks];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.loading = false;
      },
    });
  }

  loadTagColors() {
    this.taskService.getTags().subscribe({
      next: (tags) => {
        this.tagColors = tags.reduce((colors: Record<string, string>, tag: string) => {
          colors[tag] = this.getRandomColor();
          return colors;
        }, {});
      },
      error: (err) => console.error('Error loading tags:', err),
    });
  }

  onSearch(criteria: { term: string; tag: string | null }) {
    this.loading = true;

    if (criteria.tag) {
      this.taskService.searchTasksByTag(criteria.tag).subscribe({
        next: (data) => {
          this.filteredTasks = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error searching by tag:', err);
          this.loading = false;
        },
      });
    } else if (criteria.term) {
      this.taskService.searchTasks(criteria.term).subscribe({
        next: (data) => {
          this.filteredTasks = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error searching tasks:', err);
          this.loading = false;
        },
      });
    } else {
      this.filteredTasks = [...this.tasks];
      this.loading = false;
    }
  }

  refreshTags() {
    this.taskService.getTags().subscribe({
      next: (tags) => {
        this.tagColors = {};
        tags.forEach(tag => {
          this.tagColors[tag] = this.getRandomColor();
        });
      },
      error: (err) => console.error('Error refreshing tags:', err),
    });
  }

  createTask() {
    const newTask = {
      title: 'New Task',
      description: 'Default Description',
      tag: 'general',
      createdAt: new Date().toISOString(),
    };

    this.taskService.addTask(newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.filteredTasks = [...this.tasks];
        this.refreshTags();
      },
      error: (err) => console.error('Error creating the task:', err),
    });
  }

  deleteAllTasks() {
    this.taskService.deleteAllTasks().subscribe({
      next: () => {
        this.tasks = [];
        this.filteredTasks = [];
        this.refreshTags();
      },
      error: (err) => console.error('Error deleting all tasks:', err),
    });
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.filteredTasks = [...this.tasks];
      },
      error: (err) => console.error('Error deleting the task:', err),
    });
  }

  deleteTaskFromList(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.filteredTasks = [...this.tasks];
    this.refreshTags();
  }

  updateTaskInList(updatedTask: any) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index > -1) {
      this.tasks[index] = updatedTask;
      this.filteredTasks = [...this.tasks];
    }
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
