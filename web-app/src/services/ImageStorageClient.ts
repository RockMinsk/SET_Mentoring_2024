import {
    StorageSharedKeyCredential,
    BlobServiceClient,
    ContainerClient,
    BlobUploadCommonResponse
} from '@azure/storage-blob';
import fs from "fs";
import path from "path";
import { pipeline } from 'stream';
import { promisify } from 'util';
import { logger } from '../helpers/loggerConfig';
import 'dotenv/config';

const pipelineAsync = promisify(pipeline);

const ONE_MINUTE = 60 * 1000;

export class ImageStorageClient {

    private readonly storageAccountName: string;
    private readonly accountAccessKey: string;
    private readonly blobServiceClient: BlobServiceClient;

    constructor() {
        if (!process.env.AZURE_STORAGE_ACCOUNT_NAME || !process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY) {
            console.log('Error: Storage account name or access key is not defined in environment variables.');
            process.exit(1);
        }

        this.storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        this.accountAccessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
        const credential = new StorageSharedKeyCredential(this.storageAccountName, this.accountAccessKey);
        this.blobServiceClient = new BlobServiceClient(`https://${this.storageAccountName}.blob.core.windows.net`, credential);
    }

    public async showContainerNames() {
        let response = this.blobServiceClient.listContainers();
        logger.info("Containers:");
        for await (const container of response) {
            logger.info(` - ${container.name}`);
        }
    }

    public async showBlobNames() {
        const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(`${process.env.AZURE_STORAGE_CONTAINER_NAME}`);
        const response = containerClient.listBlobsFlat();
        logger.info(`Blobs in "${process.env.AZURE_STORAGE_CONTAINER_NAME}" container:`);
        for await (const blob of response) {
            logger.info(` - ${blob.name}`);
        }
    }

    public async create(file: Express.Multer.File): Promise<BlobUploadCommonResponse> {
        const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(`${process.env.AZURE_STORAGE_CONTAINER_NAME}`);
        const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
            
        const abortController = new AbortController();
        const timeout = setTimeout(() => abortController.abort(), 30 * ONE_MINUTE);
        const aborter = abortController.signal;
            
        try {
            const containerExists: boolean = await containerClient.exists();
            if (!containerExists) {
                logger.info(`Creating of Blob container "${process.env.AZURE_STORAGE_CONTAINER_NAME}"...`)
                await containerClient.create({ abortSignal: aborter });
            } else {
                logger.info(`Blob container "${process.env.AZURE_STORAGE_CONTAINER_NAME}" already exists.`)
            }
            
            const response = await blockBlobClient.uploadData(file.buffer, { abortSignal: aborter });
            
            clearTimeout(timeout);
            
            logger.info(`File "${file.originalname}" uploaded to the Azure Blob storage`);
            return response;
        } catch (error) {
            clearTimeout(timeout);
            throw error;
        }
    }

    public async read(fileName: string): Promise<void> {
        const filePath: string = path.resolve(`./tmp/downloads`, fileName);

        const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(`${process.env.AZURE_STORAGE_CONTAINER_NAME}`);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        const downloadResponse = await blockBlobClient.download(0);
        if (downloadResponse.readableStreamBody) {
            await pipelineAsync(downloadResponse.readableStreamBody, fs.createWriteStream(filePath));
            logger.info(`File "${fileName}" downloaded from the Azure Blob storage to the "${filePath}"`);
        } else {
            throw new Error('ReadableStreamBody is undefined');
        }
    }

    public async getImages() {
        const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(`${process.env.AZURE_STORAGE_CONTAINER_NAME}`);
    
        let listBlobs = containerClient.listBlobsFlat();
        let blobs = [];
        for await (const blob of listBlobs) {
            let blobUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerClient.containerName}` +
            `/${blob.name}?${process.env.AZURE_STORAGE_ACCOUNT_SHARED_ACCESS_TOKEN}`
            blobs.push(blobUrl);
        }
        return blobs;
    }

    public async delete(fileName: string): Promise<void> {
        const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(`${process.env.AZURE_STORAGE_CONTAINER_NAME}`);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        await blockBlobClient.delete();
        logger.info(`File "${fileName}" deleted from the Azure Blob storage`);
    }

    public async deleteAll(): Promise<void> {
        const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(`${process.env.AZURE_STORAGE_CONTAINER_NAME}`);

        let blobs = containerClient.listBlobsFlat();

        for await (let blob of blobs) {
            await containerClient.deleteBlob(blob.name);
            logger.info(`Blob "${blob.name}" deleted.`);
        }
    }
}

export default ImageStorageClient;