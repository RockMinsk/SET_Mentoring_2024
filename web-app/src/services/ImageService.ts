import { ImageStorageClient } from './ImageStorageClient';
import { ImageDatabaseClient } from './ImageDatabaseClient';
import { ImageData } from '../helpers/ImageData';
import { ImageStatus } from '../models/Image';
import { ServiceBusMessage } from "@azure/service-bus";
import { ServiceBusSenderClient } from './ServiceBusSenderClient';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../helpers/loggerConfig';
import 'dotenv/config';

class ImageService {
    private imageData: ImageData;
    private storageClient: ImageStorageClient;
    private dbClient!: ImageDatabaseClient;
    private serviceBusSenderClient: ServiceBusSenderClient;

    constructor() {
        this.imageData = new ImageData();
        this.storageClient = new ImageStorageClient();
        this.serviceBusSenderClient = new ServiceBusSenderClient();
    }

    public async initialize() {
        this.dbClient = await ImageDatabaseClient.connect();
    }

    public async showStorageData(): Promise<any> {
        logger.info(`Blob storage data:`);
        await this.storageClient.showContainerNames();
        await this.storageClient.showBlobNames();
    }

    public async create(file: Express.Multer.File): Promise<any> {
        if (!this.dbClient) throw new Error("Database client is not initialized.");
        const image = this.imageData.getImageFromFile(file, [], ImageStatus.NEW);

        logger.error(`MESSAGE ID: ${image.id}`);

        await Promise.all([
            this.storageClient.create(file),
            this.dbClient.create(image)
        ])

        const message: ServiceBusMessage = {
            messageId: uuidv4(),
            body: image
        };

        return this.serviceBusSenderClient.sendMessageToTopic(`${process.env.AZURE_SERVICE_BUS_TOPIC_NAME}`, message);
    }

    public async get(file: string): Promise<any> {
        return this.storageClient.read(file);
    }

    public async getAll(): Promise<any> {
        return this.dbClient.getImages();
    }

    public async delete(file: string): Promise<any> {
        return this.storageClient.delete(file);
    }

    public async search(label: string): Promise<any> {
        return this.dbClient.getImagesByLabel(label);
    }
}

export default ImageService;
