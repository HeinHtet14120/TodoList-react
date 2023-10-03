import React, { useState } from 'react'

export default function TodoForm({addTodo}) {

    let [title,setTitle] = useState('')

    let HandleSubmit = (e) =>{
        e.preventDefault();
        let todos = {
            id : Math.floor(Math.random(100000)),
            title : title,
            completed : false
        };

        addTodo(todos)
        setTitle('')
    }
  return (
    <form action="#" onSubmit={HandleSubmit}>
          <input
            type="text"
            className="todo-input"
            placeholder="What do you need to do?"
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
        </form>
  )
}
