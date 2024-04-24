import { ImageStorageClient } from './ImageStorageClient';
import { ImageDatabaseClient } from './ImageDatabaseClient';
import { ImageData } from '../helpers/ImageData';
import { logger } from '../helpers/loggerConfig';
import { ImageStatus } from '../models/Image';

class ImageService {
    private imageData: ImageData;
    private storageClient: ImageStorageClient;
    private dbClient!: ImageDatabaseClient;

    constructor() {
        this.imageData = new ImageData();
        this.storageClient = new ImageStorageClient();
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

        return Promise.all([
            this.dbClient.create(image),
            this.storageClient.create(file)
        ]);
    }

    public async get(file: string): Promise<any> {
        return this.storageClient.read(file);
    }

    public async getAll(): Promise<any> {
        return this.storageClient.getImages();
    }

    public async delete(file: string): Promise<any> {
        return this.storageClient.delete(file);
    }

    public async search(label: string): Promise<any> {
        // Implement your search logic here
    }
}

export default ImageService;
