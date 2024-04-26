import { ItemDefinition } from '@azure/cosmos';

export enum ImageStatus {
    NEW = "new",
    RECOGNITION_FAILED = "recognition_failed",
    RECOGNITION_COMPLETED = "recognition_completed"
}

export interface Image extends ItemDefinition {
    id: string;
    objectPath: string;
    objectSize: string;
    timeAdded: Date;
    timeUpdated: Date;
    labels: string[];
    status: ImageStatus;
}