import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { TaskCardComponent } from '../card/task-card.component';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    providers: [TaskCardComponent],
    imports: [CommonModule, TaskCardComponent],
})
export class TaskListComponent implements OnInit {
    @Input() tasks: any[] = [];
    @Input() tagColors: Record<string, string> = {};
    @Output() deleteTask = new EventEmitter<number>();
    @Output() taskUpdated = new EventEmitter<any>();
    @Output() deleteTaskRequested = new EventEmitter<any>();

    constructor(private taskService: TaskService) { }

    ngOnInit() { }

    handleDeleteTask(taskId: number) {
        this.deleteTask.emit(taskId);
    }

    handleTaskUpdated(updatedTask: any) {
        this.taskUpdated.emit(updatedTask);
    }
}
