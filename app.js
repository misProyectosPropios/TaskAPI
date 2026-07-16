const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const app = express();
const port = 3000;

app.use(express.json());

taskList = []

function addTask(title, done) {
    let id = taskList.length;
    taskList.push({
        "id": taskList.length,
        "title": title,
        "done": done
    })
    return taskList;
}

function removeTaskInPos(pos) {
    taskList.splice(index, 1);
}

function positionOfIdInList(id) {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == id) {
           return i; 
        }
    }
    return -1;
}

function writeDone(index, done) {
    if (done) {
        taskList[index].title = done;
    }
}

function writeTitle(index, title) {
    if (title) {
        taskList[index].title = title;
    }
}

function sendError(res, errorMessage) {
    res.status(400);
    res.send({ "error": errorMessage });
}

function unknowId(res) {
    res.status(400);
    res.send("Unknown id");
}

function resNoContent(res) {
    res.status(204);
    res.send("No content");
}


addTask("Clean the bathroom", true);
addTask("Cook chicken nuggets", false);
addTask("Study computability", false);

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks", "/tasks/:id"] });
});

app.get('/tasks', (req, res) => {
    res.send(taskList);
});

app.get('/tasks/:id', (req, res) => {
    var id = req.params.id 
    let pos = positionOfIdInList(id);
    if (pos !== -1) {
        res.status(200);
        res.send(taskList[i]);
        return
    }
    sendError(res, `Task ${id} not found`)
});

app.get('/health', (req, res) => {
    res.json({ 'status' : "ok"});
});

app.post('/tasks', (req, res) => {
    const title = req.body.title    
    if (!title) {
        sendError(res, `There's no title in the body of the request`);
        return;
    }
    addTask(title, false);
    res.status(201);
    res.json({"status": "Created"});
})

app.put('/tasks/:id', (req, res) => {
    const title = req.body.title
    const done = req.body.done 
    
    if (!title || !done) {
        sendError(res, "There's no title or done")
        return;
    }
    
    let pos = positionOfIdInList(id);
    
    if (pos === -1) {
        unknowId(res, "Unknown id task");
        return;
    }
    writeTitle(pos, title);
    writeDone(pos, done);
    res.status(204);
    res.json(taskList[i]);
});

app.delete('/tasks:id', (req, res) => {
    var id = req.params.id 
    let pos = positionOfIdInList(id);
    if (pos === -1) {
        unknowId(res, "Unknown id task");
        return;
    }

    removeTaskInPos(pos)
    resNoContent(res);

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
}); 




