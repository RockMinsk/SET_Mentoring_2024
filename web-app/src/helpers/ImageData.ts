import { Image, ImageStatus } from '../models/Image';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

export class ImageData {

	public getImageFromFile(file: Express.Multer.File, labels: string[], status: ImageStatus): Image {
		const imageId = uuidv4();
	
		const image: Image = {
			id: imageId,
			objectPath: `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${file.originalname}`,
			objectSize: this.bytesToSize(file.size),
			timeAdded: new Date(),
			timeUpdated: new Date(),
			labels: labels,
			status: status
		};
	
		return image;
	}

	private bytesToSize(bytes: number): string {
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		if (bytes === 0) return '0 Byte';
		const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
		return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
	}
}
