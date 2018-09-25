
const todo_list = require("../data/todo-list.js");

module.exports = function (app) {
    
    app.delete('/api/delete', function(req, res) {
        let todo = req.body.todo;
        if(Object.keys(todo_list).includes(todo)){
            delete todo_list[`${todo}`];
        };
        res.json({success: true});
    });

    app.post('/api/add', function(req, res) {
        let todo = req.body.todo;
        if(!Object.keys(todo_list).includes(todo)){
            todo_list[`${todo}`] = 0;
        };
        res.json({success: true});
    });

    app.put('/api/update', function(req, res) {
        let todo = req.body.todo;
        if(Object.keys(todo_list).includes(todo)){
            todo_list[`${todo}`] = (todo_list[`${todo}`] === 0) ? 1 : 0;
        };
        res.json({success: true});
    });

    app.get('/api/list', function(req, res) {
        res.json(todo_list);
    });
}