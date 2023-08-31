import { Component } from '@angular/core';

import { Todo } from './models/Todo';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todos: Array<Todo>;
  filterType = 'All';
  todoText = '';

  constructor(private readonly storageService: StorageService) {
    this.todos = this.storageService.getTodos();
  }

  toggleComplete(todo: Todo): void {
    todo.isCompleted = !todo.isCompleted;
    this.storageService.saveTodos(this.todos);
  }

  addTodo(event: any): void {
    event.preventDefault();

    if (this.todoText) {
      const newId = this.todos.length > 0 ? 1 : Math.max(...this.todos.map(t => t.id)) + 1;
      const todo = { id: newId, text: this.todoText, isCompleted: false };

      this.todos.push(todo);
      this.todoText = '';
      this.toggleFilterType('All');
      this.storageService.saveTodos(this.todos);
    }
  }

  deleteTodo(todo: Todo): void {
    const todoIndex = this.todos.findIndex(t => t.id === todo.id);
    this.todos.splice(todoIndex, 1);
    this.storageService.saveTodos(this.todos);
  }

  deleteAllCompleted(): void {
    this.todos = this.todos.filter(t => !t.isCompleted);
    this.storageService.saveTodos(this.todos);
  }

  toggleFilterType(filterType: string): void {
    this.filterType = filterType;
  }

  isFilterType(filterType: string): boolean {
    return this.filterType === filterType;
  }

  get numberOfTodos(): number {
    return this.filteredTodos ? this.filteredTodos.length : 0;
  }

  get filteredTodos(): Array<Todo> {
    if (!this.todos) {
      return [];
    }

    const filterPredicate: (todo: Todo) => boolean = 
      this.filterType === 'All' ? () => true : 
      this.filterType === 'Active' ? (t) => !t.isCompleted :
      (t) => t.isCompleted;

    return this.todos.filter(filterPredicate);
  }
}
