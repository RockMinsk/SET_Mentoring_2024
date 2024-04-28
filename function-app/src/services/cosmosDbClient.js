const { CosmosClient } = require("@azure/cosmos");

require("dotenv").config();

const endpoint = process.env.AZURE_COSMOS_DB_ACCOUNT_URI || '';
const key = process.env.AZURE_COSMOS_DB_ACCOUNT_ACCESS_KEY || '';

const client = new CosmosClient({ endpoint, key });
const database = client.database(process.env.AZURE_COSMOS_DB_DATABASE_ID);
const container = database.container(process.env.AZURE_COSMOS_DB_CONTAINER_ID);

async function updateItemLabels(id, newLabels) {
    try {
        if (!id) {
            return console.error('Cannot update item in Cosmos DB. No id provided');
        }

        const { resource: currItem } = await container.item(id, id).read();
        if (!currItem) {
            return console.log(`Item with id ${id} not found.`);
        }

        if (newLabels) {
            currItem.labels = newLabels;
            currItem.timeUpdated = new Date();
            currItem.status = 'recognition_completed';            
        } else {
            currItem.timeUpdated = new Date();
            currItem.status = 'recognition_failed';
        }

        const { resource: updatedItem } = await container.item(id, id).replace(currItem);
    
        return console.log(`Item "${updatedItem.id}" updated successfully by using labels: ${updatedItem.labels}.`);
    } catch (error) {
        return console.error(`Error updating item "${id}": `, error);
    }
}

module.exports = { updateItemLabels };
