var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
},{
    id: 2,
    description: 'Go to market',
    completed: false
}
];
app.get('/', function (req, res){
    res.send('Todo Rest API');
});
app.get('/todos', function (req, res){
    res.json(todos);
});
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    var matchedTodo;
    for(var i=0;i<todos.length;i++){
        if(todos[i].id === todoId){
            matchedTodo = todos[i];
            break;
        }
    }
    if(matchedTodo){
        res.json(matchedTodo);
    }
    else {
        res.status(404).send();
    }
});
app.listen(PORT, function(){
    console.log('Server listening on ' + PORT);
});