var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/sqlite-database.sqlite'
});
console.log(__dirname);

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync().then(function(){
    console.log('Everything is synced');
    Todo.create({
        description: 'Walking my dog',
        completed: false
    }).then(function(todo){
        console.log('finished');
        console.log(todo);
    });
});