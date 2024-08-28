
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./schema');
//use google console to create clinetId and clinet secret 
passport.use(new GoogleStrategy({
    clientID: "75011052741-7nr0l5q1jobo186guj4md4ku1pf187nm.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'http://localhost:4001/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    let existingUser = await User.findOne({ googleId: profile.id });
    console.log(existingUser,"existingUser")
    if (existingUser?existingUser['isAllowed']:existingUser) {
      return done(null, existingUser);
    }
    else if(!existingUser){
        const newUser = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            name: profile._json.name, 
            photos: profile._json.photos, 
            provider: profile.provider,
            isAllowed:false
        });

        await newUser.save();
       return done(null, newUser);
    }

    return done(null, null);
   
  }
));
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  done(null, id);
});
