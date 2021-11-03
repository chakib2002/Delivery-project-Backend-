const bcrypt = require('bcrypt')
const passport= require('passport')
const  connection = require('../../API/login_queries')



var  LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField :"user",
    passwordField : "pass"
},
  async function(username,password, done) {
    const user= await connection.get_username( username )
      function handle () {
      if (!user) {
        return done(null, false);
      }
      connection.get_password(username).
      then( (user)=>{
        bcrypt.compare(password, user)
        .then((result)=>{
            if (!result) {
                return done(null, false);
            }
            return done(null, username);
        })
    })
    }
    handle();
    
  }
));

  passport.serializeUser((user, done) => {
    connection.id_ofuser(user).then( (userId)=> {
      done(null, userId);
    }

    )

});

passport.deserializeUser((userId, done) => {
    connection.userby_id(userId)
        .then((user) => {
            done(null, user);
        })
      });
        
module.exports=passport