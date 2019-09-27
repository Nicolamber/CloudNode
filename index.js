const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  endpoint: "http://dynamodb:8000",
  region: "us-west-2",
  credentials: {
    accessKeyId: "2456",
    secretAccessKey: "2456"
  }
});
const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  service: dynamodb
});

const getEnviosPendientes = async () => {
  try {
    var params = {
      TableName: "Envio",
      IndexName: "idPendiente",
      Limit: 20
    };
    return new Promise((resolve, reject) => {
      docClient.scan(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  } catch (e) {
    console.log("TCL: getEnviosPendientes -> e", e);
  }
};

const createEnvio = async body => {
  try {
    var params = {
      TableName: "Envio",
      Item: {
        // a map of attribute name to AttributeValue
        id: Date.now().toString(),
        fechaAlta: new Date().toJSON(),
        destino: body.destino,
        email: body.email,
        pendiente: "si"
      }
    };
    return new Promise((resolve, reject) => {
      docClient.put(params, (err, data) => {
        if (err) reject(err);
        else resolve("Se ha creado con exito!");
      });
    });
  } catch (e) {
    console.log("TCL: e", e);
  }
};

const getEnvio = async id => {
  try {
    var params = {
      TableName: "Envio",
      //IndexName: 'id', // optional (if querying an index)
      KeyConditionExpression: "id = :var", // a string representing a constraint on the attribute
      ExpressionAttributeValues: {
        // a map of substitutions for all attribute values
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
    console.log("TCL: getEnviosPendientes -> e", e);
  }
};

const setEnvioEntregado = async id => {
  const idParsed = id.toString()
  try {
    var params = {
      TableName: "Envio",
      Key: { id: idParsed },
      UpdateExpression: "remove pendiente"
    };
    return new Promise((resolve, reject) => {
      docClient.update(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  } catch (e) {
    console.log("TCL: getEnviosPendientes -> e", e);
  }
};

exports.handler = async event => {
  try {
    const id = (event.pathParameters || {}).id || false;
    const body = JSON.parse(event.body);

    switch (event.resource) {
      case "/envios":
        return { body: JSON.stringify(await createEnvio(body)) };
        break;
      case "/envios/pendientes":
        return { body: JSON.stringify(await getEnviosPendientes()) };
      case "/envios/{id}":
        return { body: JSON.stringify(await getEnvio(id)) };
        break;
      case "/envios/{id}/entregado":
        return { body: JSON.stringify(await setEnvioEntregado(id)) };
        break;

      default:
        break;
    }
  } catch (e) {
    console.log("TCL: e", e);
  }
};