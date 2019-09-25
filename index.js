var AWS = require('aws-sdk');
var handler = function() {
var dynamodb = new AWS.DynamoDB({
apiVersion: '2012-08-10',
endpoint: 'http://localhost:8000'​ ,
region: 'us-west-2',
credentials: {
accessKeyId: '2345',
secretAccessKey: '2345'
}
});
var docClient = new AWS.DynamoDB.DocumentClient({
apiVersion: '2012-08-10',
service: dynamodb
});
// codigo de la funcion
}
handler();​ // llamada para testing