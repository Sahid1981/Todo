import { useState } from 'react'
import './App.css'
function App() 
  const [task, setState] = useState('')
  const [tasks, setTasks] = useState([])
  const addTask = (event) => {
    event.preventDefault()
    const description = task.trim()
    if (!description) return
    setTasks(currentTasks => [...currentTasks, description])
    setTask('')
  }
  const deleyteTask = (delete) => {
    setTasks(currentTasks => currentTasks.filter(item => item !== delete))
  }
  return (
    <div id="container">
      <h3>Todos</h3>
      <form onSubmit={addTask}>
        <input placeholder='Add new task' 
          value={task}
          onChange={event => setTask(event.target.value)}
        />
      </form>
      <ul>
        {
          tasks.map(item => (
            <li key={item}>{item}</li>
          ))
        }
      </ul>
    </div>
  )
}
export default App
