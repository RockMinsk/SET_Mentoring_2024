import { CosmosClient, Container } from '@azure/cosmos';
import { Image } from '../models/Image';
import { logger } from '../helpers/loggerConfig';
import { Logger } from 'winston';
import 'dotenv/config';

export class ImageDatabaseClient {
    private container!: Container;
    private client!: CosmosClient;

    private constructor(endpoint: string, key: string) {
        this.client = new CosmosClient({ endpoint, key});
    }

    public static async connect(): Promise<ImageDatabaseClient> {
        const cosmosDBAccountURI = process.env.AZURE_COSMOS_DB_ACCOUNT_URI;
        const cosmosDBAccessKey = process.env.AZURE_COSMOS_DB_ACCOUNT_ACCESS_KEY;

        if (!cosmosDBAccountURI || !cosmosDBAccessKey) {
            throw new Error('Azure Cosmos DB account URI and Access key must be valid');
        }

        const dbClientInstance = new ImageDatabaseClient(cosmosDBAccountURI, cosmosDBAccessKey);

        const { database } = await dbClientInstance.client.databases.createIfNotExists({
            id: process.env.AZURE_COSMOS_DB_DATABASE_ID!,
            throughput: 400
        });
        const { container } = await database.containers.createIfNotExists({
            id: process.env.AZURE_COSMOS_DB_CONTAINER_ID!,
            partitionKey: { paths: ['/id'] }
        });

        dbClientInstance.container = container;

        return dbClientInstance;
    }

    public async create(image: Image): Promise<string|undefined> {
        const { resource } = await this.container.items.create<Image>(image);
        logger.info(`Information about file "${resource?.objectPath}" added to the Azure Cosmos DB. Item ID: ${resource?.id}`);
        return resource?.id;
    }

    public async getImages(): Promise<string[]> {
        const querySpecification = {
            query: `SELECT c.id, c.objectPath FROM c`
        };
        const { resources } = await this.container.items.query(querySpecification).fetchAll();
        const imageInfo: any[] = resources.map(item => {
            return {
                id: item.id,
                url: `${item.objectPath}?${process.env.AZURE_STORAGE_ACCOUNT_SHARED_ACCESS_TOKEN}`
            }  
        });
        return imageInfo;
    }

    public async getImagesByLabel(label: string): Promise<string[]> {
        if (!label) {
            return this.getImages();
        } else {
            const querySpecification = {
                query: `SELECT c.id, c.objectPath FROM c WHERE ARRAY_CONTAINS(c.labels, @label)`,
                parameters: [
                    {
                        name: '@label',
                        value: label 
                    }
                ]
            };
            const { resources } = await this.container.items.query(querySpecification).fetchAll();
            const imageInfo: any[] = resources.map(item => {
                return {
                    id: item.id,
                    url: `${item.objectPath}?${process.env.AZURE_STORAGE_ACCOUNT_SHARED_ACCESS_TOKEN}`
                }
            });
            return imageInfo;
        }
    }

    public async getTagsForImage(id: string): Promise<string[]> {
        const querySpecification = {
            query: `SELECT c.labels FROM c WHERE c.id = @id`,
            parameters: [
                { name: "@id", value: id }
            ]
        };
    
        const { resources } = await this.container.items.query(querySpecification).fetchNext();
        const labels = resources[0]?.labels || [];  
        return labels;
    }

    public async getImageNameById(id: string): Promise<string> {
        const querySpecification = {
            query: `SELECT c.objectPath FROM c WHERE c.id = @id`,
            parameters: [
                { name: "@id", value: id }
            ]
        };
    
        const { resources } = await this.container.items.query(querySpecification).fetchNext();
        const fileName = resources[0]?.objectPath.split('/').pop() || [];  
        return fileName;
    }

    public async read(id: number): Promise<Image|undefined|null> {
        try {
            const { resource } = await this.container.item(id.toString()).read<Image>();
            return resource;
        }
        catch (err) {
            if (err instanceof Error && 'code' in err && err['code'] === 404)
                return null;
            else
                throw err;
        }
    }

    public async update(image: Image): Promise<void> {
        await this.container.item(image.id.toString()).replace<Image>(image);
    }

    public async delete(id: string): Promise<void|Logger> {   
        const { item } = await this.container.item(id, id).delete();
        return logger.info(`Item with id "${item.id}" deleted from Cosmos DB.`);
    }

    public async deleteAll(): Promise<void> {
        const { resources: items } = await this.container.items.readAll().fetchAll();

        items.forEach(async (item) => {
            if (item.id !== undefined) {
                const { item: delItem } = await this.container.item(item.id, item.id).delete();
                logger.info(`Item with id "${delItem.id}" deleted from Cosmos DB.`);
            } else {
                logger.error('Trying to delete an item without an id from Cosmos DB.');
            }
        });
    }
}