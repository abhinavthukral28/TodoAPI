var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore')
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());
app.get('/', function (req, res){
    res.send('Todo Rest API');
});
app.get('/todos', function (req, res){
    res.json(todos);
});
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    if(matchedTodo){
        res.json(matchedTodo);
    }
    else {
        res.status(404).send();
    }
});
app.post('/todos', function (req, res){
    var body = _.pick(req.body, 'description', 'completed');
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send();
    }

    body.description = body.description.trim();

    body.id = todoNextId++;
    todos.push(body);
    console.log('description');
    res.json(body);



});
app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    if(matchedTodo){
        console.log(todos);
        todos = _.without(todos, matchedTodo);
        console.log(todos);
        res.json(matchedTodo);
    }
    else {
        res.status(404).json({"error": "No todos with given id found"});
    }
});

app.put('/todos/:id', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
    var validAttibutes = {};
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttibutes.completed = body.completed;

    }
    else if(body.hasOwnProperty('completed')){
        return res.status(400).send();
    }
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttibutes.description = body.description;

    }
    else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    }
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    if(matchedTodo){
        _.extend(matchedTodo, validAttibutes);
        res.json(matchedTodo);
    }
    else {
        return res.status(404).json({"error": "No todos with given id found"});
    }
});
app.listen(PORT, function(){
    console.log('Server listening on ' + PORT);
});