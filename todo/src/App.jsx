import { useState } from 'react'
import './App.css'
function App() 
  const [task, setState] = useState('')
  const [tasks, setTasks] = useState([])
  return (
    <div id="container">
      <h3>Todos</h3>
      <form onSubmit={addTask}>
        <input placeholder='Add new task' 
          value={task}
          onChange={event => setTask(event.target.value)}
        />
      </form>
      <ul></ul>
    </div>
  )
}
export default App
