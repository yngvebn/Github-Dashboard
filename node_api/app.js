var restify = require('restify'),
    request = require('request'),
    express = require('express'),
    app =express(),
    server = require('http').Server(app),
    path = require('path'),
    io = require('socket.io')(server),
    bodyParser = require('body-parser');

app.settings = {
    env: 'dev'
};

app.use(require('connect-livereload')());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../tmp'));


app.get('/api/test', function(req, res){
    res.send(401);
});

app.post('/api/github/accesstoken', function(req, res) {
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
    });
});

io.on('connection', function(socket){
    socket.on('disconnect', function(){ });
    console.log('client connected');

    setTimeout(function(){
        console.log('emitting first');
        io.emit('news', { text: 'WOW!' });    
    }, 3000);
    
    setTimeout(function(){
        console.log('emitting another');
        io.emit('news', { text: 'Latest news!' });    
    }, 4000);
     
});
var namespaces = {};

app.post('/api/git', function(req, res){
    res.send(200);
    console.log(req.body.repository.id);
    if(!namespaces[req.body.repository.id]){
        var nsp = io.of('/'+req.body.repository.id);
        namespaces[req.body.repository.id] = nsp;
    }
    namespaces[req.body.repository.id].emit('hook', req.body);
});

app.get('*', function(req, res) {
    console.log('sending ' + path.join(__dirname, '/../tmp/index.html'));
    res.sendFile(path.join(__dirname, '/../tmp/index.html'));

});

var port = 3334;

server.listen(port, function() {
    console.log('site started on port ' + port);
});

