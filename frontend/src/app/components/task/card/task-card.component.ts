import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.scss'],
    imports: [CommonModule, FormsModule],
    providers: [TaskService],
})
export class TaskCardComponent {
    @Input() task: any;
    @Input() tagColors: Record<string, string> = {};
    @Output() taskUpdated = new EventEmitter<any>();
    @Output() deleteTask = new EventEmitter<number>();
    @Output() deleteTaskRequested = new EventEmitter<any>();

    expanded: boolean = false;
    isEditing: boolean = false;
    editableTask: any = {};

    constructor(private taskService: TaskService) { }

    toggleTaskCompletion(event: Event) {
        event.stopPropagation();
        const updatedTask = { ...this.task, completed: !this.task.completed };
        this.taskService.updateTask(updatedTask.id, updatedTask).subscribe({
            next: (updatedTaskFromBackend) => {
                this.task = updatedTaskFromBackend;
                this.taskUpdated.emit(updatedTaskFromBackend);
            },
            error: (err) => console.error('Error updating task completion:', err),
        });
    }

    requestTaskDeletion(event: Event) {
        event.stopPropagation();
        this.deleteTaskRequested.emit(this.task);
    }

    toggleExpand() {
        this.expanded = !this.expanded;
    }

    startEditing(event: Event) {
        event.stopPropagation();
        this.isEditing = true;
        this.editableTask = { ...this.task };
    }

    cancelEditing() {
        this.isEditing = false;
        this.editableTask = {};
    }

    saveTask() {
        this.taskService.updateTask(this.task.id, this.editableTask).subscribe({
            next: (updatedTask) => {
                this.taskUpdated.emit(updatedTask);
                this.isEditing = false;
            },
            error: (err) => console.error('Error saving task:', err),
        });
    }

    getTagColor(tag: string): string {
        return this.tagColors[tag] || '#ddd';
    }
}
