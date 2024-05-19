require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
// 接入oauth
const passport = require('passport')
const session = require('express-session')
const GitHubStrategy = require('passport-github2').Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});


// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
  clientID: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_SECRET_KEY,
  callbackURL: `${process.env.HOST}/connect/github/callback`
},
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


const port = 8080
// 随笔路由
const diary = require('./diary')
// 设置路由
const setting = require('./setting')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Oauth后半部分
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'thankwsx', saveUninitialized: false, resave: false
}))
app.use(passport.initialize());
app.use(passport.session());

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/connect/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/', (req, res) => {
  res.send('Hello World!' + req.user.displayName);
})

app.get('/login', (req, res) => {
  res.send('<a href="/auth/github">Login with GitHub</a>');
})

app.use('/diary', ensureAuthenticated, diary)
app.use('/setting', ensureAuthenticated, setting)

app.get('/health', (req, res) => {
  res.send('status: 200');
})

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  // console.log('Not login:', req);
  res.redirect('/login')
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
