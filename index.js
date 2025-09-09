require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
// 接入oauth
const passport = require('passport')
const session = require('express-session')
const GitHubStrategy = require('passport-github2').Strategy;
const BeancountModel = require('./beancount/beancount.model').BeancountModel;
const { formatDate } = require('./common/util');

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
// 记账路由
const beancount = require('./beancount')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, req.body);
  next();
});
app.use(cors({
  origin: ['http://localhost:3000', 'https://aiman.jackyqi.cn', 'https://api.aiman.jackyqi.cn'],
  credentials: true,
  sameSite: 'none'
}))

// Oauth后半部分
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'thankwsx', saveUninitialized: false, resave: false,
  cookie: {
    domain: 'aiman.jackyqi.cn',
    maxAge: 1000 * 60 * 60 * 24 // save 1 day
    //domain: 'localhost:3000'
  }
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

app.get('/', ensureAuthenticated, (req, res) => {
  // res.send('Hello World!' + req.user.displayName);
  res.redirect('https://aiman.jackyqi.cn');
})

app.get('/login', (req, res) => {
  res.send('<a href="/auth/github">Login with GitHub</a>');
})

app.post('/userinfo', ensureAuthenticated, (req, res) => {
  res.json({
    code: 0,
    data: req.user,
    msg: 'ok'
  });
})

app.use('/diary', ensureAuthenticated, diary)
app.use('/setting', ensureAuthenticated, setting)
app.use('/beancount', ensureAuthenticated, beancount)

app.get('/health', (req, res) => {
  res.send('status: 200');
})

// 测试端点，用于快捷指令调试
app.post('/test', (req, res) => {
  console.log('Test endpoint called with:', req.body);
  res.json({
    code: 0,
    data: req.body,
    msg: 'Test successful'
  });
})

app.get('/logout', function (req, res) {
  req.logout();
  res.send('logout');
})

app.post('/shortcut/beancount/create', (req, res) => {
  const date = new Date();
  const fileName = formatDate(date) + '.md';
  const beancountModel = new BeancountModel();
  try {
    beancountModel.createBeancount({
      fileName: fileName,
      content: {
        date: req.body.date,
        account: req.body.account.split(':'),
        expense: req.body.expense.split(':'),
        money: req.body.money,
        payee: req.body.payee || '未知',
        desc: req.body.desc || '-',
      }
    });
    res.json({
      code: 0,
      msg: 'ok'
    })
  } catch (e) {
    res.json({
      code: 1,
      msg: 'something wrong'
    })

  }
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  // console.log('Not login:', req);
  res.json({
    code: 1,
    data: null,
    msg: 'Not login'
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
