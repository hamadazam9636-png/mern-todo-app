import { useState, useEffect } from "react"
import "../style/list.css"
import { Link } from "react-router-dom";
import Popup from "../components/Popup"

function List() {
  const [taskData, setTaskData] = useState([])
  const [selectedTask, setSelectedTask] = useState([])
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ type: null, targetId: null });

  useEffect(() => {
    getListData()
  }, []);

  const getListData = async () => {
    let list = await fetch('/tasks',{
      credentials:"include"
    });
    list = await list.json()
    if (list.success) {
      setTaskData(list.result)
    } else {
      setShowErrorPopup(true);
    }
  }

  const triggerDeleteSingle = (id) => {
    setDeleteConfig({ type: 'single', targetId: id });
    setShowConfirmPopup(true);
  }

  const triggerDeleteMultiple = () => {
    setDeleteConfig({ type: 'multiple', targetId: null });
    setShowConfirmPopup(true);
  }

  const handleConfirmDelete = async () => {
    setShowConfirmPopup(false); 

    if (deleteConfig.type === 'single') {
      let item = await fetch('/delete/' + deleteConfig.targetId, {
        method: "delete", credentials: "include"
      });
      item = await item.json()
      if (item.success) {
        setSelectedTask(prev => prev.filter(id => id !== deleteConfig.targetId));
        getListData()
      } else {
        setShowErrorPopup(true);
      }
    } 
    else if (deleteConfig.type === 'multiple') {
      let item = await fetch('/delete-multiple', {
        method: "delete", credentials: "include",
        body: JSON.stringify(selectedTask),
        headers: {
          "Content-Type": "Application/Json"
        }
      });
      item = await item.json()
      if (item.success) {
        setSelectedTask([]) 
        getListData()
      } else {
        setShowErrorPopup(true);
      }
    }
  }

  const selectAll = (event) => {
    if (event.target.checked) {
      let items = taskData.map((item) => item._id)
      setSelectedTask(items)
    } else {
      setSelectedTask([])
    }
  }

  const selectSingleItem = (id) => {
    if (selectedTask.includes(id)) {
      let items = selectedTask.filter((item) => item !== id)
      setSelectedTask(items)
    } else {
      setSelectedTask([id, ...selectedTask])
    }
  }

  return (
    <div className="list-page-container">
      <h1 className="list-main-title">To Do List</h1>
      
      {(taskData.length > 0 || selectedTask.length > 0) && (
        <div className="list-actions-bar">
          <label className="mobile-select-all">
            <input 
              type="checkbox" 
              onChange={selectAll} 
              checked={taskData.length > 0 && selectedTask.length === taskData.length} 
            />
            <span>Select All Tasks</span>
          </label>
          
          {selectedTask.length > 0 && (
            <button onClick={triggerDeleteMultiple} className="Delete-Multiple">
              Delete Selected ({selectedTask.length})
            </button>
          )}
        </div>
      )}

      <div className="task-grid-table">
        <div className="grid-header-row">
          <div className="grid-header-cell check-col">
            <input 
              onChange={selectAll} 
              type="checkbox" 
              checked={taskData.length > 0 && selectedTask.length === taskData.length} 
            />
          </div>
          <div className="grid-header-cell">S.No</div>
          <div className="grid-header-cell">Title</div>
          <div className="grid-header-cell">Description</div>
          <div className="grid-header-cell">Action</div>
        </div>

        {taskData && taskData.map((item, index) => (
          <div className="grid-body-row" key={item._id}>
            <div className="grid-body-cell check-col">
              <input 
                onChange={() => selectSingleItem(item._id)} 
                checked={selectedTask.includes(item._id)} 
                type="checkbox" 
              />
            </div>
            <div className="grid-body-cell serial-col">{index + 1}</div>
            <div className="grid-body-cell title-col">{item.title}</div>
            <div className="grid-body-cell desc-col">{item.description}</div>
            <div className="grid-body-cell action-col">
              <button onClick={() => triggerDeleteSingle(item._id)} className="delete-item">Delete</button>
              <Link to={"update/" + item._id} className="update-item">Update</Link>
            </div>
          </div>
        ))}
      </div>

      <Popup 
        isOpen={showConfirmPopup}
        title={deleteConfig.type === 'single' ? "Delete Task?" : "Delete Multiple Tasks?"}
        message={
          deleteConfig.type === 'single' 
            ? "Are you sure you want to delete this task?" 
            : `Are you sure you want to delete all ${selectedTask.length} selected tasks?`
        }
        onConfirm={handleConfirmDelete} 
        onCancel={() => setShowConfirmPopup(false)}  
        type="danger" 
      />
    </div>
  )
}

export default List