package com.example.todo_api.model;

import java.time.LocalDateTime;

// Lombok est une bibliothèque qui réduit le code répétitif comme les getters, setters, etc.
import lombok.Data;

@Data // Cette annotation génère automatiquement les méthodes get, set, toString,
      // equals, et hashCode.
public class Task {

    private Long id;
    private String title;
    private String description;
    private String tag;
    private boolean completed;
    private LocalDateTime createdAt;

}
