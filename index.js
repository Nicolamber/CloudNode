var AWS = require('aws-sdk');
var handler = async (​ event​ ) => {
var dynamodb = new AWS.DynamoDB({
apiVersion: '2012-08-10',
endpoint: 'http://​dynamodb​:8000',
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

const getEnvio = async id => {
    try {
      var params = {
        TableName: "envio",
        
        KeyConditionExpression: "id = :var", 
        ExpressionAttributeValues: {
          ":var": id
        }
      };
      return new Promise((resolve, reject) => {
        docClient.query(params, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (e) {
      console.log("Error al traer los envios: ", e);
    }
  };

const getEnvioPendiente = async () => {
    try{ 
        var params = {
            TableName: "envio",
            IndexName: "envios_pendientes_index",
            Limit: 30
        };
        return new Promise((resolve,reject) =>{
            docClient.scan(params,(err,data)=>{
                if(err) reject (err);
                else resolve(data);
            });
        });
    }catch(e){
        console.log("Error al traer los envios pendientes: ", e);
    }
};

};
exports.handler = handler;