"use client"

import axios from "axios";
import { useEffect, useState } from "react"

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
};

export default function DisplayPage(){
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        status: "pending"
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/`,{withCredentials: true});
            if (res.data.tasks) {
                setTasks(res.data.tasks);
            } else if (Array.isArray(res.data)) {
                setTasks(res.data);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]); 
        }
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        if (!newTask.title.trim() || !newTask.description.trim()) return;
        
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/add`, newTask,{withCredentials: true});
            const addedTask = res.data.task || res.data;
            setTasks([...tasks, addedTask]);
            
            setNewTask({
                title: "",
                description: "",
                status: "pending"
            });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}`,{withCredentials: true});
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

   
    const toggleTaskCompletion = async (task: Task) => {
        try {
            const updatedStatus = task.status === "completed" ? "pending" : "completed";
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${task._id}`, 
                { ...task, status: updatedStatus },
                { withCredentials: true }
            );

            const updatedTask = res.data.task || res.data;
            setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask({
            ...newTask,
            [name]: value
        });
    };

    return (
        <section>
            <div className="main">
                <div className="container">
                    <h1>Task Manager</h1>
                    
                    <form onSubmit={addTask} className="flex gap-3">
                        <div className="form-group">
                            <label htmlFor="title">Title:</label>
                            <input 
                                type="text" 
                                id="title" 
                                name="title"
                                value={newTask.title} 
                                onChange={handleInputChange}
                                placeholder="Enter task title"
                                className="form-control" 
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input 
                                type="text" 
                                id="description" 
                                name="description"
                                value={newTask.description} 
                                onChange={handleInputChange}
                                placeholder="Enter task description"
                                className="form-control" 
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select 
                                id="status" 
                                name="status"
                                value={newTask.status} 
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">ADD TASK</button>
                        </div>
                    </form>
                    
                    <div className="display">
                        <h2>Tasks:</h2>
                        {tasks && tasks.length > 0 ? (
                            <ul>
                                {tasks.map((task) => (
                                    <li key={task._id} className="todo-item">
                                        <div 
                                            onClick={() => toggleTaskCompletion(task)} 
                                            className={`cursor-pointer ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
                                        >
                                            <h3>{task.title}</h3>
                                            <p>{task.description}</p>
                                            <span className={`status ${task.status}`}>
                                                Status: {task.status}
                                            </span>
                                        </div>
                                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tasks yet</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
