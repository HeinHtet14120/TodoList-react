import './reset.css';
import './App.css';
import TodoForm from './components/TodoForm.js';
import TodoList from './components/TodoList.js';
import CheckAllAndRemaining from './components/CheckAllAndRemaining.js';
import Filter from './components/Filter.js';
import ClearCompletedBtn from './components/ClearCompletedBtn.js';
import { useCallback, useEffect, useState } from 'react';

function App() {

  let [todos,setTodos] = useState([])
  let [filteredTodos,setfilteredTodos] = useState([todos])

  useEffect(() =>{
    fetch('http://localhost:3001/todos')
    .then(res => res.json())
    .then((data) => {
      setTodos(data)
      setfilteredTodos(data)
      
    })
  },[])


  let FilterBy = useCallback((filter) =>{
    if(filter === 'All'){
      setfilteredTodos(todos)
    }
    if(filter === 'Active'){
      setfilteredTodos(todos.filter(t => !t.completed))
    }
    if(filter === 'Completed'){
      setfilteredTodos(todos.filter(t => t.completed))
    }
  },[todos])

  let addTodo = (todo)=>{
    //update data at server side
    fetch('http://localhost:3001/todos',{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body : JSON.stringify(todo)
    })

    //update data at user side
    setTodos(prevState => [...prevState,todo])
  }

  let deleteTodo = (todoId)=>{

    fetch(`http://localhost:3001/todos/${todoId}`,{
      method : "DELETE"
    })
    //client side 
    setTodos(prevState => {
      return prevState.filter(todo => {
        return todo.id !== todoId
      })
    })

  }

  let updateTodo = (todo)=>{
    fetch(`http://localhost:3001/todos/${todo.id}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body : JSON.stringify(todo)
    })

    setTodos(prevState => {
      return prevState.map(t => {
        if(t.id === todo.id){
          return todo;
        }
        return t;
      })
    })
  }

  let checkAll = () =>{

    todos.forEach(t =>{
      t.completed = true
      updateTodo(t)
    })

    //client side
    setTodos((prevState) => {
      return prevState.map(t =>{
        return {...t,completed:true}
      })
    })
  }

  let remainingItem = todos.filter(t => !t.completed).length


  let clearCompleted = () =>{

    todos.forEach(t =>{
      if(t.completed){
        deleteTodo(t.id)
      }
    })

    // todos.filter(t =>{
    //   if(t.completed == true){
    //     fetch(`http://localhost:3001/todos/${t.id}`,{
    //   method : "DELETE"
    // })
    //   }
    // })

    // setTodos(prevState => {
    //   return prevState.filter(todo => {
    //     return todo.completed === false
    //   })
    // })

    setTodos((prevState) => {
      return prevState.filter(t => !t.completed)
    })
  }

  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>

        <TodoForm addTodo={addTodo}/>
        <TodoList todos={filteredTodos} deleteTodo={deleteTodo} updateTodo={updateTodo} />
        <CheckAllAndRemaining remainingCount={remainingItem} checkAll={checkAll}/>
        
        <div className="other-buttons-container">

          <Filter FilterBy={FilterBy} />
          <ClearCompletedBtn clearCompleted={clearCompleted}/>
   
        </div>
      </div>
    </div>
  );
}

export default App;
