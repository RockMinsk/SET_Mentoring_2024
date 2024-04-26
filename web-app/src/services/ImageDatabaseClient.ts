import { CosmosClient, Container } from '@azure/cosmos';
import { Image } from '../models/Image';
import { logger } from '../helpers/loggerConfig';
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
            partitionKey: { paths: ['/id']}
        });

        dbClientInstance.container = container;

        return dbClientInstance;
    }

    public async create(image: Image): Promise<string|undefined> {
        const { resource } = await this.container.items.create<Image>(image);
        logger.info(`Information about file "${resource?.objectPath}" added to the Azure Cosmos DB. Item ID: ${resource?.id}`);
        return resource?.id;
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

    public async delete(id: number): Promise<void> {
        await this.container.item(id.toString()).delete<Image>();
    }
}