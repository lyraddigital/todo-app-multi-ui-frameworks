import { useState } from 'react';

import './App.css';

const defaultTodos = JSON.parse(localStorage.getItem('ld-react-todos')) || [
  { id: 1, text: 'Complete the React.js todo app', isCompleted: false },
  { id: 2, text: 'Complete the Angular todo app', isCompleted: false },
  { id: 3, text: 'Complete the Vue.js todo app', isCompleted: false }
];

const defaultFilterType = localStorage.getItem('ld-react-filterType') || 'All';
const allFilterPredicate = (todos) => todos;
const activeFilterPredicate = (todos) => !todos.isCompleted;
const completedFilterPredicate = (todos) => todos.isCompleted;

function App() {
  const [todos, setTodos] = useState(defaultTodos);
  const [filterType, setFilterType] = useState(defaultFilterType);
  const currentFilterPredicate = 
        filterType === 'All' ? allFilterPredicate :
        filterType === 'Active' ? activeFilterPredicate : 
        completedFilterPredicate;
  const filteredTodos = todos.filter(currentFilterPredicate);
  const [todoText, setTodoText] = useState('');

  const toggleComplete = (todoId) => {
    setTodos((prevTodos) => {      
      const newTodos = [...prevTodos];
      const existingTodoIndex = prevTodos.findIndex(t => t.id === todoId);

      if (existingTodoIndex >= 0) {
        newTodos[existingTodoIndex] = { 
          ...prevTodos[existingTodoIndex],
          isCompleted: !prevTodos[existingTodoIndex].isCompleted
        };
      }

      localStorage.setItem('ld-react-todos', JSON.stringify(newTodos))

      return newTodos;
    });
  };

  const toggleFilterType = (filterType) => {
    localStorage.setItem('ld-react-filterType', filterType);
    setFilterType(filterType);
  };

  const addTodo = (e) => {
    e.preventDefault();

    if (todoText) {
      setTodos(prevTodos => {
        const newId = prevTodos.length === 0 ? 1 : Math.max(...prevTodos.map(t => t.id)) + 1;
        const todo = { id: newId, text: todoText, isCompleted: false };
  
        const newTodos = [...prevTodos, todo];        
        localStorage.setItem('ld-react-todos', JSON.stringify(newTodos));

        return newTodos;
      });

      setTodoText('');
      setFilterType('All');
    }
  };

  const deleteTodo = (todoId) => {
    setTodos(prevTodos => {
      const newTodos = prevTodos.filter(t => t.id !== todoId);
      localStorage.setItem('ld-react-todos', JSON.stringify(newTodos))

      return newTodos;
    });
  }

  const deleteAllCompleted = () => {
    setTodos(prevTodos => {
      const newTodos = prevTodos.filter(t => !t.isCompleted);
      localStorage.setItem('ld-react-todos', JSON.stringify(newTodos))

      return newTodos;
    });
  };

  const todoItemsEl = filteredTodos.map((t, i) => {
    const checkClassName = !t.isCompleted ? null : 'checked';
    
    return (
      <li key={i} className={checkClassName}>
        <button className="todoStatus" onClick={ () => toggleComplete(t.id) }>&#10003;</button>
        <span className="todoText" onClick={ () => toggleComplete(t.id) }>{ t.text }</span>
        <button className="removeTodo" onClick={ () => deleteTodo(t.id) }>
          <img className="deleteLogo" src="images/deleteTodoLogo.svg" alt="Delete Todo" />
        </button>
      </li>
    )
  });

  return (
    <main>
        <header>
          <h1>Todo</h1>
          <img id="languageLogo" src="images/languageLogo.svg" alt="React Logo" />
        </header>
        <form onSubmit={addTodo}>
          <input type="text" placeholder="Create a new todo..." onChange={(e) => setTodoText(e.target.value)} value={todoText} />
          <button type="submit" id="createTodo">+</button>
        </form>
        <div id="todoList">
          <div id="todoListHeader">
            <span>{ filteredTodos.length } items left</span>
            <ul id="todoFilters">
              <li className={ filterType === 'All' ? 'active': null }>
                <button onClick={ () => toggleFilterType('All')}>All</button>
              </li>
              <li className={ filterType === 'Active' ? 'active': null }>
                <button onClick={ () => toggleFilterType('Active')}>Active</button>
              </li>
              <li className={ filterType === 'Completed' ? 'active': null }>
                <button onClick={ () => toggleFilterType('Completed')}>Completed</button>            
              </li>
            </ul>
            <button id="clearCompleted" onClick={deleteAllCompleted}>Clear Completed</button>
          </div>
          <ul id="todoListBody">
            { todoItemsEl }
          </ul>
        </div>
      </main>
  );
}

export default App;
