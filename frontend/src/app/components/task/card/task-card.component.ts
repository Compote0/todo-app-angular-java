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
    @Output() taskDeleted = new EventEmitter<number>();

    expanded: boolean = false;
    isEditing: boolean = false;
    editableTask: any = {};

    constructor(private taskService: TaskService) { }

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
            error: (err) => console.error('Erreur lors de la sauvegarde de la tâche', err),
        });
    }

    deleteTask() {
        this.taskService.deleteTask(this.task.id).subscribe({
            next: () => {
                this.taskDeleted.emit(this.task.id);
            },
            error: (err) => console.error('Erreur lors de la suppression de la tâche', err),
        });
    }

    getTagColor(tag: string): string {
        return this.tagColors[tag] || '#ddd';
    }
}
