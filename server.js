var express = require('express');
var app = express();
app.use(express.static('static'));
app.PORT = 8080;
app.listen(app.PORT, function(err){
	if(err)
		console.log('Erro ao subir servidor!');
	else
		console.log('Servidor escutando na porta ' + app.PORT);
});

app.get('/', function(req, res){
	res.sendFile(__dirname+'/views/index.html');
})