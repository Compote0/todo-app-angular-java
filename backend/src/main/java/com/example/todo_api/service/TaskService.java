package com.example.todo_api.service;

import com.example.todo_api.model.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService {

    private List<Task> tasks = new ArrayList<>();

    private Long nextId = 1L;

    // method to get all tasks
    public List<Task> getAllTasks() {
        return tasks;
    }

    // method to create a new task
    public Task createTask(Task task) {
        task.setId(nextId++);
        task.setCreatedAt(LocalDateTime.now());
        tasks.add(task);
        return task;
    }

    // method to get a task by id
    public Task getTaskById(Long id) {
        for (Task task : tasks) {
            if (task.getId().equals(id)) {
                return task;
            }
        }
        return null;
    }

    // method to update a task by id
    public Task updateTask(Long id, Task updatedTask) {
        Task existingTask = tasks.stream()
                .filter(task -> task.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (existingTask != null) {
            existingTask.setTitle(updatedTask.getTitle());
            existingTask.setDescription(updatedTask.getDescription());
            existingTask.setTag(updatedTask.getTag());
            existingTask.setCompleted(updatedTask.isCompleted());
            return existingTask;
        }
        return null;
    }

    // method to delete a task by id
    public void deleteTask(Long id) {
        tasks.removeIf(task -> task.getId().equals(id));
    }

    // method to delete all tasks
    public void deleteAllTasks() {
        tasks.clear();
    }

    // method to search by title or description
    public List<Task> searchTasks(String searchTerm) {
        return tasks.stream()
                .filter(task -> task.getTitle().contains(searchTerm) || task.getDescription().contains(searchTerm))
                .toList();
    }

    // method to search by date
    public List<Task> searchTasksByDate(LocalDateTime start, LocalDateTime end) {
        return tasks.stream()
                .filter(task -> task.getCreatedAt().isAfter(start) && task.getCreatedAt().isBefore(end))
                .toList();
    }

    // method to search by tag
    public List<Task> searchTasksByTag(String tag) {
        return tasks.stream()
                .filter(task -> task.getTag().equals(tag))
                .toList();
    }

    public List<String> getTags() {
        return tasks.stream()
                .map(Task::getTag)
                .distinct()
                .toList();
    }
}