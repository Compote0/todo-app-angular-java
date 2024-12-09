import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { TaskSearchComponent } from './components/task/search/task-search.component';
import { TaskListComponent } from './components/task/list/task-list.component';
import { TaskService } from './services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [HeaderComponent, TaskSearchComponent, TaskListComponent, CommonModule],
})
export class AppComponent implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  tagColors: Record<string, string> = {};
  loading: boolean = true;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadTasks();
    this.loadTagColors();
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
        console.error('Erreur lors du chargement des tâches', err);
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
      error: (err) => console.error('Erreur lors du chargement des tags', err),
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
          console.error('Erreur lors de la recherche par tag', err);
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
          console.error('Erreur lors de la recherche textuelle', err);
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
      error: (err) => console.error('Erreur lors du rafraîchissement des tags', err),
    });
  }


  createTask() {
    const newTask = {
      title: 'Nouvelle tâche',
      description: 'Description par défaut',
      tag: 'general', // Tag par défaut
      createdAt: new Date().toISOString(),
    };

    this.taskService.addTask(newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.filteredTasks = [...this.tasks];
        console.log('Task created successfully:', task);
        this.refreshTags();
      },
      error: (err) => console.error('Erreur lors de la création de la tâche', err),
    });
  }

  deleteAllTasks() {
    this.taskService.deleteAllTasks().subscribe({
      next: () => {
        console.log('Toutes les tâches ont été supprimées');
        this.tasks = [];
        this.filteredTasks = [];
        this.refreshTags();
      },
      error: (err) => console.error('Erreur lors de la suppression de toutes les tâches', err),
    });
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.filteredTasks = [...this.tasks];
      },
      error: (err) => console.error('Erreur lors de la suppression de la tâche', err),
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

  loadTags() {
    this.taskService.getTags().subscribe({
      next: (tags) => {
        this.tagColors = {};
        tags.forEach(tag => {
          this.tagColors[tag] = this.getRandomColor();
        });
      },
      error: (err) => console.error('Erreur lors du chargement des tags', err),
    });
  }
}
