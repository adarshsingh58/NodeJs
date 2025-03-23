var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.get('/api/:id',function(req,res){
	res.send("<body> You asked for Api number "+req.params.id+
			"And the Query Parameter passed is: "+req.query.name+"</body>");
});

app.listen(port);