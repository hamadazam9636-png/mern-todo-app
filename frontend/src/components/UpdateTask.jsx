import { useState,useEffect } from "react"
import "../style/addTask.css"
import { useNavigate, useParams } from "react-router-dom"
function AddTask() {
    const [taskData,setTaskData] = useState()
    const {id} = useParams()
    const navigate = useNavigate()
    const handleSubmit=(event)=>{
        event.preventDefault();
    }
    useEffect(() => {
     getTask(id)
    }, [])
    const getTask= async(id)=>{
    let task = await fetch('/task/'+id,{
       credentials:"include",
    })
    task =await task.json()
    if (task.result) {
        setTaskData(task.result)
    }
    }
    const updateTask=async()=>{
      console.log("Data Updated",{taskData})
      let task =await fetch("/update-task",{
        method:"put",
        credentials:"include",
        body:JSON.stringify(taskData),
        headers:{"Content-Type":"Application/Json"}
      })
      task =await task.json();
      if (task) {
        navigate("/")
      }
    }
  return (
    <div className="container">
        <h1>Update Task</h1>
      <form action="" onSubmit={handleSubmit}>
        <label >Title</label>
        <input value={taskData?.title} onChange={(e)=>setTaskData({...taskData,title:e.target.value})} type="text" name="title" placeholder="Enter Task Title" />
        <label >Description</label>
        <textarea value={taskData?.description} onChange={(e)=>setTaskData({...taskData,description:e.target.value})} rows={4} name="description" placeholder="Enter Task Description"></textarea>
        <button onClick={updateTask} className="submit">Update Task</button>
      </form>
    </div>
  )
}

export default AddTask
