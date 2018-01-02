var express = require('express')
var config = require('./config/index.js')

var app = express();

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port,function(err){
	if(err){
		console.log(err)
		return
	}
	console.log('listen'+port)
})



