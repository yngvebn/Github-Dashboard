var restify = require('restify'),
    request = require('request'),
    express = require('express'),
    path 	=  require('path'),
    bodyParser = require('body-parser'),
    userSave = require('save')('user');

var server = express();
server.use(bodyParser.json());


server.use(express.static(__dirname +'/../tmp'))

server.post('/api/github/accesstoken', function(req, res) {
    var options = {
        method: 'POST',
        url: 'https://github.com/login/oauth/access_token',
        json: true,
        headers: {
            'User-Agent': 'GitHub-Dashboard'
        },
        body: req.body
    };
    console.log(options);
    request(options, function(error, response, body) {
        if (error) {
            return console.error('upload failed:', error);
        }
        res.send(body);
    })
});

server.get('*', function(req, res){
	console.log('sending '+path.join(__dirname,'/../tmp/index.html'))
    res.sendFile(path.join(__dirname,'/../tmp/index.html'));
});



var port = 3334;

server.listen(port, function(){
	console.log('site started on port '+port);
})



/*
var server = restify.createServer({
    name: 'github-db-api '
});

server
    .use(restify.fullResponse())
    .use(restify.CORS({
        origins: ['*'],
        headers: ['Access-Control-Allow-Origin']
    }))
    .use(restify.bodyParser());

server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    next();
});

// Preflight requests
server.opts('.*', function(req, res, next) {
    if (req.headers.origin && req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Cookie,Authorization, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
        res.header('Access-Control-Expose-Headers', 'Set-Cookie');
        res.header('Allow', req.headers['access-control-request-method']);
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        //req.log.info { url:req.url, method:req.headers['access-control-request-method'] }, "Preflight";
        res.send(204);
        next();
    } else {
        res.send(404);
        next();
    }
});


server.get('', function(req, res, next){
	res.send(./tmp/index.html);
});

server.post('/api/github/accesstoken', function(req, res, next) {
    var options = {
        method: 'POST',
        url: 'https://github.com/login/oauth/access_token',
        json: true,
        headers: {
            'User-Agent': 'GitHub-Dashboard'
        },
        body: req.params
    };
    console.log(options);
    request(options, function(error, response, body) {
        if (error) {
            return console.error('upload failed:', error);
        }
        res.send(201, body);
    })
});


server.listen(3334, function() {
    console.log('%s listening at %s', server.name, server.url);
});*/