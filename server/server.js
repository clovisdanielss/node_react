var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const Issues = require('./issues.js');

app.use(bodyparser.json());
app.use(express.static('static'));
app.PORT = 8080;
let db;

MongoClient.connect('mongodb://localhost/').then(client => {
	db = client.db('issuetracker');
	app.listen(app.PORT, function (err) {
		if (err)
			console.log('Erro ao subir servidor!');
		else
			console.log('Servidor escutando na porta ' + app.PORT);
	});
}).catch(err =>{
	console.log('Error:',err);
})

/*Usando o webpack-server em conjunto com o servidor Express*/
if(process.env.NODE_ENV !== 'production'){
	const webpack = require('webpack');
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');

	const config = require('../webpack.config');
	config.entry.app.push('webpack-hot-middleware/client','webpack/hot/only-dev-server');
	config.plugins.push(new webpack.HotModuleReplacementPlugin());

	const bundler = webpack(config);

	app.use(webpackDevMiddleware(bundler, { noInfo:true}));
	app.use(webpackHotMiddleware(bundler, { log: console.log}));
}

app.get('/api/issues', (req,res) =>{
	db.collection('issues').find().toArray().then(issues =>{
		const metadata = {length:issues.length};
		res.json({_metadata:metadata, records:issues});
	}).catch(error =>{
		console.log(error);
		res.status(500).json({message: `Internal server error ${error}`})
	})

})

app.post('/api/issues', (req,res)=>{
	const newIssue = req.body;
	newIssue.created = new Date();
	if(!newIssue.status)
		newIssue.status = 'New';
	const err = Issues.validateIssue(newIssue);
	if(err){
		res.status(422).json({message: `Invalid request: ${err}`});
		return;
	}
	/*issues.push(newIssue);
	res.json(newIssue);*/
	db.collection('issues').insertOne(newIssue).then(result =>
		db.collection('issues').findOne({_id: result.insertedId})
	).then(newIssue =>{
		console.log(newIssue);
		res.json(newIssue);
	}).catch(err => {
		console.log(err);
		res.status(500).json({message:`Internal Server Error ${err}`});
	})
})

app.get('/teste/', function(req,res){
	res.json('Teste');
});
