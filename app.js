const express = require('express');
const app = express();
const port = 3000;


taskList = [
    { 
        "id": 1, 
        "title" : "Clean the bathroom",
        "done": true,
    },
    { 
        "id": 3, 
        "title" : "Cook chicken nuggets",
        "done": false,
    },
    { 
        "id": 2, 
        "title" : "Study computability",
        "done": false,
    },
]

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks", "/tasks/:id"] });
});

app.get('/tasks', (req, res) => {
    res.send(taskList);
});

app.get('/tasks/:id', (req, res) => {
    var id = req.params.id 
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == id) {
            res.status(200);
            res.send(taskList[i]);
            return
        }
    }
    res.status(404);
    res.send({ "error": `Task ${id} not found` });
});

app.get('/health', (req, res) => {
    res.json({ 'status' : "ok"});
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
}); 