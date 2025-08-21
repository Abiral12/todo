import Task from '../models/task.js';

export const addtask = async (req, res) => {
    try{
        const { title, description, status } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const newTask = new Task({
            title,
            description,
            status: status || "pending"
        });

        await newTask.save();
        res.status(201).json(newTask);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

export const getAllTasks = async (req, res) => {
try{
    const tasks = await Task.find();
    res.status(200).json(tasks);


}catch(err){
    res.status(500).json({message: err.message});
  }
}

export const updateTasks = async (req, res) => {
    try{
        const { id } = req.params;
    const updates = req.body;

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task: updatedTask });

    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const deleteTasks = async (req, res) => {
const { id } = req.params;
try {
 const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
}catch (err) {
    res.status(500).json({ message: err.message });
  }

}