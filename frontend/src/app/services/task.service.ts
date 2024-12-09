import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) { }

  // get all tasks
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // get task by id
  getTaskById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // add a new task
  addTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  }

  // update a task
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task);
  }

  // delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // delete all tasks
  deleteAllTasks(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteAll`);
  }

  // search tasks
  searchTasks(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: { searchTerm },
    });
  }


  // search tasks by date
  searchTasksByDate(start: string, end: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/searchByDate`, {
      params: { start, end },
    });
  }

  // search tasks by tag
  searchTasksByTag(tag: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/searchTasksByTag`, {
      params: { tag },
    });
  }

  // get tags
  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tags`);
  }
}
