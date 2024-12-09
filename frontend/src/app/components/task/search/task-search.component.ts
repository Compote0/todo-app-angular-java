import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';

@Component({
    standalone: true,
    selector: 'app-task-search',
    templateUrl: './task-search.component.html',
    styleUrls: ['./task-search.component.scss'],
    imports: [CommonModule, FormsModule],
})
export class TaskSearchComponent implements OnInit {
    @Output() searchCriteria = new EventEmitter<{ term: string; tag: string | null }>();
    @Output() tagColorsUpdated = new EventEmitter<Record<string, string>>(); // Ajouté

    searchTerm: string = '';
    selectedTag: string | null = null;
    tags: { name: string; color: string }[] = [];
    tagColors: Record<string, string> = {}; // Centralisation des couleurs

    constructor(private taskService: TaskService) { }

    ngOnInit() {
        this.loadTags();
    }

    loadTags() {
        this.taskService.getTags().subscribe({
            next: (data) => {
                this.tags = data.map((tag: string) => {
                    const color = this.getRandomColor();
                    this.tagColors[tag] = color;
                    return { name: tag, color };
                });
                this.tagColorsUpdated.emit(this.tagColors);
            },
            error: (err) => console.error('Erreur lors du chargement des tags', err),
        });
    }

    toggleTag(tag: string) {
        this.selectedTag = this.selectedTag === tag ? null : tag;
        this.emitSearchCriteria();
    }

    searchTasks() {
        this.emitSearchCriteria();
    }

    private emitSearchCriteria() {
        this.searchCriteria.emit({ term: this.searchTerm, tag: this.selectedTag });
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
