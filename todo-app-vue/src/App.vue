<template>
  <main>
    <header>
      <h1>Todo</h1>
      <img id="languageLogo" src="/images/languageLogo.svg" alt="Vue Logo" />
    </header>
    <form>
      <input aria-label="Create a new todo..." type="text" v-model="addTodoText" placeholder="Create a new todo..." />
      <button id="createTodo" @click.prevent="addTodo()">+</button>
    </form>
    <div id="todoList">
      <div id="todoListHeader">
        <span>{{ numberOfTodos }} items left</span>
        <ul id="todoFilters">
          <li :class="{ active: filterType === 'All' }">
            <button @click="toggleFilter('All')">All</button>
          </li>
          <li :class="{ active: filterType === 'Active' }">
            <button @click="toggleFilter('Active')">Active</button>
          </li>
          <li :class="{ active: filterType === 'Completed' }">
            <button @click="toggleFilter('Completed')">Completed</button>            
          </li>
        </ul>
        <button id="clearCompleted" @click="deleteAllCompleted()">Clear Completed</button>
      </div>
      <ul id="todoListBody">
        <li v-for="todo in filteredTodos" v-bind="todo" v-bind:key="todo.id" :class="{ checked: todo.isCompleted }">
          <button class="todoStatus" @click="toggleComplete(todo)">&#10003;</button>
          <span class="todoText" @click="toggleComplete(todo)">{{ todo.text }}</span>
          <button class="removeTodo">
            <img class="deleteLogo" src="/images/deleteTodoLogo.svg" alt="Delete Todo" @click="deleteTodo(todo)" />
          </button>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    const defaultTodos = [
      { id: 1, text: 'Complete the React.js todo app', isCompleted: true },
      { id: 2, text: 'Complete the Angular todo app', isCompleted: true },
      { id: 3, text: 'Complete the Vue.js todo app', isCompleted: false }
    ];

    return {
      get todos() {
        return JSON.parse(localStorage.getItem('ld-vue-todos')) || defaultTodos;
      },
      set todos(todos) {
        console.log('Setting todos');
        localStorage.setItem('ld-vue-todos', JSON.stringify(todos));
      },
      addTodoText: '',
      set filterType(filterType){
        localStorage.setItem('ld-vue-filterType', filterType);
      },
      get filterType() {
        return localStorage.getItem('ld-vue-filterType') || 'All';
      }
    };
  },
  methods: {
    toggleComplete(todo) {
      todo.isCompleted = !todo.isCompleted;
      this.todos = [...this.todos];
    },
    toggleFilter(filterType) {
      this.filterType = filterType;
    },
    addTodo() {
      if (this.addTodoText) {
        const newId = this.todos.length > 0 ? 1 : Math.max(...this.todos.map(t => t.id)) + 1;
        const todo = { id: newId, text: this.addTodoText, isCompleted: false };

        this.todos = [...this.todos, todo];
        this.addTodoText = '';
      }
    },
    deleteTodo(todo) {
      this.todos = this.todos.filter(t => t.id !== todo.id);
    },
    deleteAllCompleted() {
      this.todos = this.todos.filter(t => !t.isCompleted);
    },
    getFilteredTodos() {
      const predicate = this.filterType === 'All' ? () => true : this.filterType === 'Active' ? todo => !todo.isCompleted : todo => todo.isCompleted;
      return this.todos.filter(predicate);
    }
  },
  computed: {
    filteredTodos() {      
      return this.getFilteredTodos();
    },
    numberOfTodos() {
      return this.getFilteredTodos().length;
    }
  }
}
</script>

<style>
  :root {
    --primary-color: #435466;
    --primary-dark-color: #4DBA87;
    --light-color: #FFF;
    --alternate-color: #42b983;
    --alternate-dark-color: #5DADBD;
    --default-text-color: #777;
    --box-shadow-color: rgba(194, 195, 214, 0.5);
    --filter-hover-color: #111;
    --todo-bottom-line-color: rgba(0, 0, 0, 0.1);
    --todo-check-border-color: #CCC;
    --box-shadow-style: 30px 30px 50px var(--box-shadow-color);
  }  

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 10px;
  }

  body {
    background: linear-gradient(180deg, var(--primary-color), var(--primary-dark-color));
    background-repeat: no-repeat;
    background-size: 100vw 35vh;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1.6rem;
    color: var(--default-text-color);
  }

  #app {
    display: grid;
    justify-content: center;
  }

  main {
    width: 100%;
    min-width: 540px;
    max-width: 540px;
  }

  header {
    display: flex;
    justify-content: space-between;
    margin-top: 7rem;
    margin-bottom: 5rem;
  }

  h1 {
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 700;
    letter-spacing: 1.5rem;
    color: var(--light-color);
  }

  #languageLogo {
    width: 48px;
    height: 48px;
  }

  form {
    display: flex;
    justify-content: space-between;
    column-gap: 10px;
    background: var(--light-color);
    padding: 20px;
    box-shadow: var(--box-shadow-style);
    border-radius: 5px;
  }

  input {
    flex: 1;
    font-size: 1.8rem;
    border: 1px solid transparent;
    outline: none;
    background: transparent;
  }

  #createTodo {
    background: var(--alternate-color);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    color: var(--light-color);
    border-radius: 100%;
    border: 1px solid transparent;
    cursor: pointer;
    font-size: 2rem;
  }

  #createTodo:hover, #createTodo:active {
    background: var(--alternate-dark-color);
  }

  #todoList {
    background: var(--light-color);
    box-shadow: var(--box-shadow-style);
    padding: 20px;
    margin-top: 25px;
    border-radius: 5px;
  }

  #todoListHeader {
    display: flex;
    font-size: 1.4rem;
    justify-content: space-between;
    color: var(--default-text-color);
    padding-bottom: 15px;
  }

  #todoFilters {
    display: flex;
    column-gap: 10px;
    list-style: none;
  }

  #todoFilters button {
    font-weight: 700;
    font-size: 1.4rem;
    cursor: pointer;
    background: transparent;
    border: 1px solid transparent;
    color: var(--default-text-color);
  }

  #clearCompleted {
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    color: var(--default-text-color);
  }

  #todoFilters > li > button:hover,
  #clearCompleted:hover {
    color: var(--filter-hover-color);
  }

  #todoFilters > li.active > button {
    color: var(--alternate-color);
  }

  #todoListBody {
    list-style: none;
    margin-top: 20px;
  }

  #todoListBody > li {
    display: flex;
    font-size: 1.8rem;
    column-gap: 8px;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--todo-bottom-line-color);
  }

  #todoListBody > li:first-of-type {
    padding-top: 0;
  }

  #todoListBody > li:last-of-type {
    padding-bottom: 0;
    border-bottom: none;
  }

  #todoListBody .todoStatus {
    height: 24px;
    width: 24px;
    color: var(--light-color);
    border: 1px solid var(--todo-check-border-color);
    border-radius: 100%;
    background: transparent;
    cursor: pointer;
  }

  #todoListBody .todoStatus:hover {
    border: 1px solid var(--primary-color);
  }

  #todoListBody > li {
    cursor: pointer;
  }

  #todoListBody > li.checked .todoStatus {
    border: 1px solid var(--alternate-color);
    background: linear-gradient(135deg, var(--alternate-color), var(--alternate-dark-color));
  }

  #todoListBody > li .todoText {
    flex: 1;
  }

  #todoListBody > li.checked .todoText {
    text-decoration: line-through;
  }

  #todoListBody > li .removeTodo {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  #todoListBody > li .deleteLogo {
    opacity: 0;
    width: 18px;
    height: 18px;
    fill: var(--primary-dark-color);
    transition: opacity 200ms;
  }

  #todoListBody > li:hover .deleteLogo {
    opacity: 1;    
  }
</style>
