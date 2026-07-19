import { useState } from "react"
import "../style/addTask.css"
import Popup from "../components/Popup"
import { useNavigate } from "react-router-dom"
function AddTask() {
    const [taskData,setTaskData] = useState()
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const navigate = useNavigate();
    const handleAddTask=async(e)=>{
        let result =await fetch("/add-task",{
            method : "POST",
            body:JSON.stringify(taskData),
            headers:{
              "Content-Type":"Application/json"
            },
            credentials:"include"
        })
        result = await result.json()
        if (result.success) {
            navigate("/");
            console.log("Task Added");  
        }else{
          setShowErrorPopup(true);
        }
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
    }
  return (
    <div className="container">
        <h1>Add New Task</h1>
      <form action="" onSubmit={handleSubmit}>
        <label >Title</label>
        <input onChange={(e)=>setTaskData({...taskData,title:e.target.value})} type="text" name="title" placeholder="Enter Task Title" />
        <label >Description</label>
        <textarea onChange={(e)=>setTaskData({...taskData,description:e.target.value})} rows={4} name="description" placeholder="Enter Task Description"></textarea>
        <button onClick={handleAddTask} className="submit">Add New Task</button>
      </form>
      <Popup 
      isOpen={showErrorPopup}
      title="Error"
      message="Something went wrong. Please try again after sometime."
      onConfirm={() => setShowErrorPopup(false)} 
      onCancel={() => setShowErrorPopup(false)}  
      type="info" 
    />
    </div>
  )
}

export default AddTask
