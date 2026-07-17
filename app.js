const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi.json');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
    taskList.splice(pos, 1);
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
        taskList[index].done = done;
    }
}

function writeTitle(index, title) {
    
    if (title) {
        console.log("Writing title")
        console.log(title)
        taskList[index].title = title;
    }
}

function sendResponse(res, status, send) {
    res.status(status);
    res.send(send);
}

function sendError(res, errorMessage) {
    sendResponse(res, 400, { "error": errorMessage })
}

function unknowId(res) {
    sendResponse(res, 404, "Unknown id")
}

function resNoContent(res) {
    sendResponse(res, 204, "No content")
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
        res.send(taskList[pos]);
        return
    }
    res.status(404);
    res.json({ "error": `Task ${id} not found` });
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
    const id = req.params.id 
    const title = req.body.title
    const done = req.body.done 
    if (title === undefined && done === undefined) {
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
    res.json(taskList[pos]);
});

app.delete('/tasks/:id', (req, res) => {
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




