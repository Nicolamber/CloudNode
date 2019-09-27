# CloudNode
Trabajo practico 3 de la materia Cloud computing realizado por los alumnos:
 - Nicolas Lambertucci
 - Nahuel Valencia



var params = {
    TableName: 'envioLambVal',
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH',
        }
    ],
    GlobalSecondaryIndexes: [ 
        { 
            IndexName: 'envios_pendientes_index', 
            KeySchema: [
                { 
                    AttributeName: 'id',
                    KeyType: 'HASH',
                },
                {  
                    AttributeName: 'pendiente', 
                    KeyType: 'RANGE', 
                }
            ],
            Projection: { 
                ProjectionType: 'KEYS_ONLY'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
    ],
    AttributeDefinitions: [ 
        {
            AttributeName: 'id',
            AttributeType: 'S'
        },
        {
          AttributeName: 'pendiente',
          AttributeType: 'S'
        }
    ],
     ProvisionedThroughput: { 
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1, 
     }
};

dynamodb.createTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response

});


//ejemplo de uno de los valores insertados 

var params = {
    TableName: 'envioLambVal',
    Item: {
        id:"1",
        fechaAlta:"2019-08-30",
        destino:"Mendoza",
        email: "mendozatesting@gmail.com",
        pendiente:"pendiente"
    }
};
docClient.put(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
