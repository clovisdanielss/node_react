'use strict';
const MongoClient = require('mongodb');

function usage(){
	console.log('Usage:');
	console.log('node', __filename, '<option>');
	console.log('Where option is onde of:');
	console.log('	callbacks	Use the Callbacks paradigm');
	console.log('	promises	Use the Promises paradigm');
	console.log('	generator	Use the Generator paradigm');
	console.log('	async		Use the Async module');
}

if(process.argv.length > 3){
	console.log('Incorrect number of args');
	usage();
} else{
	if(process.argv[2] === 'callbacks'){
		testWithCallbacks();
	} else if( process.argv[2] === 'promises'){
		testWithPromises();
	} else if( process.argv[2] === 'generator'){
		testWithGenerator();
	} else if( process.argv[2] === 'async'){
		testWithAsync();
	} else{
		console.log('Invalid option: ', process.argv[2]);
		usage();
	}
}

function testWithCallbacks(){
	MongoClient.connect('mongodb://localhost/', function(err,client){
		var db = client.db('playground');
		db.collection('employees').insertOne({id:1, name: 'A. Callback'},
			function(err, result){
				console.log('Result of insert:', result.insertedId);
				db.collection('employees').find({id:1}).toArray(
					function(err, docs){
						console.log('Result of find:', docs);
						client.close();
					})
			})
	})
}

function testWithPromises(){
	let db;
	let client;
	MongoClient.connect('mongodb://localhost/').then(connection => {
		client = connection;
		db = client.db('playground');
		return db.collection('employees').insertOne({id:1, name:'B. Promises'});
	}).then(result =>{
		console.log('Result of insert:', result.insertedId);
		return db.collection('employees').find({id:1}).toArray();
	}).then(docs =>{
		console.log('Result of find:', docs);
		client.close();
	}).catch(err => {
		console.log('ERROR', err);
	})
}

function testWithGenerator(){
	const co = require('co');
	co(function*(){
		const db = yield MongoClient.connect('mongodb://localhost/');
		const result = yield db.db('playground').collection('employees').insertOne({id:1, name:'C. Generator'});
		console.log('Result of insert:', result.insertedId);
		const docs = yield db.db('playground').collection('employees').find({id:1}).toArray();
		console.log('Result of find:', docs);
		db.close();
	}).catch(err => {
		console.log('ERROR',err);
	})
}
function testWithAsync(){
	const async = require('async');
	let db;
	async.waterfall([
		next =>{
			MongoClient.connect('mongodb://localhost/',next);
		},
		(connection, next) =>{
			db = connection;
			db.db('playground').collection('employees').insertOne({id:1, name: 'D. Async'}, next);
		},
		(insertResult, next) =>{
			console.log('Insert Result:', insertResult.insertedId);
			db.db('playground').collection('employees').find({id:1}).toArray(next);
		},
		(docs,next)=>{
			console.log('Result of find:', docs);
			db.close();
			next(null, 'All done');
		}],
		(err,result)=>{
			if(err)
				console.log('ERROR',err);
			else
				console.log(result);
		})
}