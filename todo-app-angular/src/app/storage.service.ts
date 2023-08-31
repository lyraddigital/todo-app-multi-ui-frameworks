import { Injectable } from "@angular/core";

import { Todo } from "./models/Todo";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private defaultTodos = [        
        { id: 1, text: 'Complete the React.js todo app', isCompleted: true },
        { id: 2, text: 'Complete the Angular todo app', isCompleted: true },
        { id: 3, text: 'Complete the Vue.js todo app', isCompleted: false }
    ];

    public getTodos(): Array<Todo> {
        const storedTodos = localStorage.getItem('ld-angular-todos');
        return (storedTodos ? JSON.parse(storedTodos) : this.defaultTodos) as Array<Todo>;
    }

    public saveTodos(todos: Array<Todo>): void {
        localStorage.setItem('ld-angular-todos', JSON.stringify(todos));
    }
}