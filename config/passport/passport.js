const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, db){

    const Users = db.users;
    const Statistics = db.statistics;
    const Resources = db.resources;
    const LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        Users.findById(id).then(function(user){
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, function(req, email, password, done){
            const generateHash = function(password){
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            Users.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } else {
                    const userPassword = generateHash(password);
                    const data = {
                        email: email,
                        password: userPassword,
                    };
                    Users.create(data).then(function(newUser, created){
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            Statistics.create({
                                user_id: newUser.dataValues.id
                            }).then(function(){
                                Resources.create({
                                    user_id: newUser.dataValues.id
                                }).then(function(){
                                    return done(null, newUser);
                                }).catch(function(err){
                                    console.log(`Oh boy, it broke: ${err}`);
                                });
                            }).catch(function(err){
                                console.log(`Oh boy, it broke: ${err}`);
                            });
                        }            
                    });            
                }
            });
        }
    ));

    passport.use('local-signin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, function(req, email, password, done){
            const isValidPassword = function(userpass, password){
                return bCrypt.compareSync(password, userpass);
            };
            Users.findOne({
                where: {
                    email: email
                }
            }).then(function(user){
                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password'
                    });
                }
                const userinfo = user.get();
                return done(null, userinfo);
            }).catch(function(err){
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }

    ));

};