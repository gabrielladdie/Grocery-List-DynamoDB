const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand
} = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({ region: 'us-east-1' })

const documentClient = DynamoDBDocumentClient.from(client)

const TableName = 'groceryList';


// CREATE

async function createItem(Item){
    const command =new PutCommand({
        TableName,
        Item
    });
    try{
        const response = await documentClient.send(command);
        console.log(response);
        return response.itemName;
    } catch (err){
        console.log(err);
    }
}

// READ
async function getItem(Key) {
    const command = new GetCommand({
        TableName,
        Key
    })
    try {
        const response = await documentClient.send(command)
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}

// UPDATE
async function updateItem(itemName, quantity, price, purchased){
    const command = new UpdateCommand({
        TableName,
        Key: {itemName},
        UpdateExpression: "set quantity = :quantity, price = :price, purchased = :purchased",
        ExpressionAttributeValues: {
            ":quantity": quantity,
            ":price": price,
            ":purchased": purchased
        }
    })

    try{
        const response = await documentClient.send(command)
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}

// DELETE
async function deleteItem(itemName){
    const command = new DeleteCommand({
        TableName,
        Key: {itemName}
    })
    try{
        const response = await documentClient.send(command)
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}

module.exports = { 
    createItem,
    getItem,
    updateItem,
    deleteItem
}