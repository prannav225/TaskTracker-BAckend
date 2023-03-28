const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
mongoose.set('strictQuery', false);

const PORT = 3002;

const TaskTracker = require('./model/tasks')


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Establishing database connection using Mongoose
const dbURL = "mongodb://localhost:27017/tasktracker"
mongoose.connect(dbURL).then(() => {
    console.log('Connected to Database');
})


//add-data to database
app.post('/home', async (req, res) => {
    try {
        const existTask = await TaskTracker.findOne({ tname: req.body.tname }).exec();
        if (existTask) {
            res.send({ message: "Task Already Exist... Try Adding another task" })
            return;
        }

        let taskdata = new TaskTracker({
            tname: req.body.tname,
            sdate: req.body.sdate,
            edate: req.body.edate,
            priority: req.body.priority,
            addedon: req.body.addedon

        })
        await taskdata.save()
        res.send({ message: "Task Added Successfully" })
    } catch {
        res.send({ message: "Error while adding TAsk" })
    }
})

//delete data from database
app.delete('/delete-data/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await TaskTracker.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            res.send(`code with ${id} has been deleted successfully`)
        } else {
            res.send(`code with ${id} not found`)
        }
    } catch (err) {
        console.error(err);
    }
})

//edit
app.get('/tasks/:id', async (req, res) => {
    let { id } = req.params
    try {
        const singleData = await TaskTracker.findById(id);
        res.send(singleData);
    } catch (err) {
        res.send(err)
    }
})
//update
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params
    await TaskTracker.updateOne({ _id: id }, {
        $set: {
            tname: req.body.tname,
            sdate: req.body.sdate,
            edate: req.body.edate,
            priority: req.body.priority,

        }
    })
})

app.get('/home-data', async (req, res) => {
    let homeData = await TaskTracker.find()
    res.send(homeData)
})

app.listen(PORT, () => {
    console.log(`Running at ${PORT}`);
})