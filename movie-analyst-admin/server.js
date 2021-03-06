var express = require('express'),
    app = express(),
    request = require('superagent');



//Set the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');
app.use(express.static(__dirname + '/public'));

var NON_INTERACTIVE_CLIENT_ID = 'QQsr2li5c2O3FLjRFSWMp27IIJV5Notp',
    NON_INTERACTIVE_CLIENT_SECRET = 'ceM2Ejex86f7ONKyCSq3Ct3jMgeO1z55_iIj5ohBPbMLM8iQL2_XZYUZhP-b5FS6';
//define an object that we'll use to exchange our credentials for an access token
var authData = {
    client_id: NON_INTERACTIVE_CLIENT_ID,
    client_secret: NON_INTERACTIVE_CLIENT_SECRET,
    grant_type: 'client_credentials',
    audience: 'http://movieanalystapi.com'
};

function getAccessToken(req, res, next){
    request
        .post('https://YOUR-AUTH0-DOMAIN.auth0.com/oauth/token')
        .send(authData)
        .end(function(err, res) {
            req.access_token = res.body.access_token;
            next();
        });
}



//Routes
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/movies', getAccessToken, function (req, res) {
    request
        .get('http://localhost:8080/movies')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function (err, data) {
            if (data.status == 403) {
                res.status(403).send('Forbidden');
            } else {
                var movies = data.body;
                res.render('movies', {movies: movies});
            }
        });
});

app.get('/reviewers', getAccessToken, function (req, res) {
    request
        .get('http://localhost:8080/reviewers')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function (err, data) {
            if (data.status == 403) {
                res.status(403).send('Forbidden');
            } else {
                var authors = data.body;
                res.render('authors', {authors: authors});
            }
        });
});

app.get('/publications', getAccessToken, function (req, res) {
    request
        .get('http://localhost:8080/publications')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function (err, data) {
            if (data.status == 403) {
                res.status(403).send('Forbidden');
            } else {
                var publications = data.body;
                res.render('publications', {publications: publications});
            }
        });
});

app.get('/pending', getAccessToken, function (req, res) {
    request
        .get('http://localhost:8080/pending')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function (err, data) {
            if (data.status == 403) {
                res.status(403).send('Forbidden');
            } else {
                var pending = data.body;
                res.render('pending', {pending: pending});
            }
        });
});


app.listen(4000, function () {
    console.log('Movie Analyst website is running on port 4000');
});