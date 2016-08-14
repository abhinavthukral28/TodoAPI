var bcrypt = require('bcrypt');
var _ = require('underscore');
module.exports = function(sequelize, DataTypes){
    return sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:{
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function(value){
                var salt = bcrypt.genSaltSync(10);
                var hashPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashPassword);


            }
        }
    }, {
        hooks: {
            beforeValidate: function(user, options){
                if(typeof user.email === 'string'){
                    user.email = user.email.toLowerCase();
                }
            }

        },
        classMethods: {
            authenticate: function(body) {
                return new Promise(function(resolve, reject) {
                    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }

                    users.findOne({
                        where: {
                            email: body.email
                        }
                    }).then(function(user) {
                        if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                            console.log("Got here!!!!!!!!!!!!!!!!!!!!!!!!")
                            return reject();
                        }

                        resolve(user);
                    }, function(e) {
                        console.log("here Hereß");
                        reject();
                    });
                });
            }
        },
        instanceMethods: {
            toPublicJSON: function (){
                var json = this.toJSON();
                return _.pick(json, 'id', 'email', 'updatedAt')
            }
        }

    });

};