var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
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


const validIssueStatus = {
	New:true,
	Open:true,
	Assigned:true,
	Fixed:true,
	Verified: true,
	Closed: true,
};

const issueFieldType = {
	status:'required',
	owner:'required',
	effort:'optional',
	created:'required',
	completionDate:'optional',
	title:'required',
};

function validateIssue(issue){
	for(const field in issueFieldType){
		const type = issueFieldType[field];
		if(!type){
			delete issue[field];
		} else if (type === 'required' && !issue[field]){
			return `${field} is required.`;
		}
	}
	if(!validIssueStatus[issue.status])
		return `${issue.status} is not a valid status.`;
	return null;
}


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
})

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
	const err = validateIssue(newIssue);
	if(err){
		res.status(422).json({message: `Invalid request: ${err}`});
		return;
	}
	/*issues.push(newIssue);
	res.json(newIssue);*/
	db.collection('issues').insertOne(newIssue).then(result => {
		db.collection('issues').find({_id: result.insertedId}).limit(1).next();
	}).then(newIssue =>{
		res.json(newIssue);
	}).catch(err => {
		console.log(err);
		res.status(500).json({message:`Internal Server Error ${err}`});
	})
})

app.get('/teste/', function(req,res){
	res.json('Teste');
});