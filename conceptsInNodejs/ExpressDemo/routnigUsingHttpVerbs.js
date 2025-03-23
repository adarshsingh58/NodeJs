var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.get('/',function(req,res){
res.send('<html><body>Hello World</body></html>');	
});

app.listen(port);