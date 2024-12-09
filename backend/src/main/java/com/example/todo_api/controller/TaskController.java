package com.example.todo_api.controller;

import com.example.todo_api.model.Task;
import com.example.todo_api.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    // injecte le service pour accéder aux méthodes métiers
    @Autowired
    private TaskService taskService;

    // GET /api/tasks - retourne la liste de toutes les tâches
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // POST /api/tasks - créer une nouvelle tâche
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    // GET /api/tasks/{id} - retourne la tâche correspondant à l'ID
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    // PUT /api/tasks/{id} - met à jour la tâche correspondant à l'ID
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    // DELETE /api/tasks/{id} - supprime la tâche correspondant à l'ID
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @DeleteMapping("/deleteAll")
    public void deleteAllTasks() {
        taskService.deleteAllTasks();
    }

    // GET /api/tasks/search?searchTerm={searchTerm} - recherche les tâches
    // correspondant au terme de recherche
    @GetMapping("/search")
    public List<Task> searchTasks(@RequestParam String searchTerm) {
        return taskService.searchTasks(searchTerm);
    }

    // GET /api/tasks/searchByDate?start=2024-12-05T00:00:00&end=2024-12-06T23:59:59
    @GetMapping("/searchByDate")
    public List<Task> searchTasksByDate(@RequestParam String start, @RequestParam String end) {
        try {
            LocalDateTime startDate = LocalDateTime.parse(start);
            LocalDateTime endDate = LocalDateTime.parse(end);
            return taskService.searchTasksByDate(startDate, endDate);
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format");
        }
    }

    // GET/api/tasks/searchTasksByTag?tag={tag}- recherche les tâches correspondant
    // au tag
    @GetMapping("/searchTasksByTag")

    public List<Task> searchTasksByTag(@RequestParam String tag) {
        return taskService.searchTasksByTag(tag);
    }

    // GET /api/tasks/tags - retourne la liste des tags
    @GetMapping("/tags")
    public List<String> getTags() {
        return taskService.getTags();
    }
}
