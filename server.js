var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var bcrypt = require('bcrypt')
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get('/', function (req, res){
    res.send('Todo Rest API');
});
app.get('/todos', function (req, res){
    var query = req.query;
    var where = {};

    if(query.hasOwnProperty('completed') && query.completed === 'true'){
        where.completed = true;
    }
    else if(query.hasOwnProperty('completed') && query.completed === 'false'){
        where.completed = false;
    }
    if(query.hasOwnProperty('q') && query.q.length > 0 ){
        where.description = {
            $like: '%' + query.q + '%'
        };
    }
    db.todo.findAll({where: where}).then(function(todos){
        res.json(todos);
    }, function(e){
        res.status(500).send();
    });

});
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    db.todo.findById(todoId).then(function(todo){
        if(todo){
            res.json(todo.toJSON());
        }
        else {
            res.status(404).send();
        }

    }, function(e){
        res.status(500).send();
    })
});
app.post('/todos', function (req, res){
    var body = _.pick(req.body, 'description', 'completed');
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send();
    }

    body.description = body.description.trim();
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e);
    });
});
app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    db.todo.destroy({
        where:{
            id: todoId
        }
    }).then(function(rowsDeleted){
        if(rowsDeleted === 0){
            res.status(404).json({
                error: "No to do ID"
            });
        }
        else {
            res.status(204).send();
        }
    }, function(){
        res.status(500).send();
    });
});

app.put('/todos/:id', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
    var validAttibutes = {};
    if(body.hasOwnProperty('completed')){
        validAttibutes.completed = body.completed;

    }
    if(body.hasOwnProperty('description')){

        validAttibutes.description = body.description;

    }
    var todoId = parseInt(req.params.id, 10);
    db.todo.findById(todoId).then(function(todo){
        if(todo){
            return todo.update(
        validAttibutes);
        }
        else {
            res.status(404).send();
        }

    }, function(){
        res.status(500).send();
    }).then(function(todo){
        console.log(todo.toJSON());
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).send();
    });
});
app.post('/users', function(req, res){
    var body = _.pick(req.body, 'email', 'password');
    db.users.create(body).then(function(user){
        res.json(user.toPublicJSON());
    }, function(e){
        res.status(400).json(e);
    })

});
app.post('/users/login', function(req, res){
    var body = _.pick(req.body, 'email', 'password');
    db.users.authenticate(body).then(function(user){
        res.json(user.toPublicJSON());
    }, function(e){
        console.log("No not here")
        res.status(401).send();
    });

});

db.sequelize.sync({force: true}).then(function(){
    app.listen(PORT, function(){
        console.log('Server listening on ' + PORT);
    });
});
