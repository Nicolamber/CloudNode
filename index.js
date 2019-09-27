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

const getPendientes = async () => {
  try {
    var params = {
      TableName: "envioLambVal",
      IndexName: "envios_pendientes_index",
      Limit: 20
    };
    return new Promise((resolve, reject) => {
      docClient.scan(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  } catch (e) {
    console.log("Error al recuperar los envios pendientes: ", e);
  }
};

const setEnvio = async body => {
  try {
    var params = {
      TableName: "envioLambVal",
      Item: {
        id: Date.now().toString(),
        fechaAlta: new Date().toJSON(),
        destino: body.destino,
        email: body.email,
        pendiente: "x"
      }
    };
    return new Promise((resolve, reject) => {
      docClient.put(params, (err, data) => {
        if (err) reject(err);
        else resolve("Creacion exitosa");
      });
    });
  } catch (e) {
    console.log("Error de cracion en: ", e);
  }
};

const getEnvioById = async id => {
  try {
    var params = {
      TableName: "envioLambVal",
     
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
    console.log("Error al recuperar los envios pendientes: ", e);
  }
};

const setEnvioEntregadoById = async id => {
  const idParsed = id.toString()
  try {
    var params = {
      TableName: "envioLambVal",
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
    console.log("Error en los envios pendientes causado por: ", e);
  }
};

exports.handler = async event => {
  try {
    const id = (event.pathParameters || {}).id || false;
    const body = JSON.parse(event.body);

    switch (event.resource) {
      case "/envios":
        return { body: JSON.stringify(await setEnvio(body)) };
        break;
      case "/envios/pendientes":
        return { body: JSON.stringify(await getPendientes()) };
      case "/envios/{id}":
        return { body: JSON.stringify(await getEnvioById(id)) };
        break;
      case "/envios/{id}/entregado":
        return { body: JSON.stringify(await setEnvioEntregadoById(id)) };
        break;

      default:
        break;
    }
  } catch (e) {
    console.log("Error: ", e);
  }
};