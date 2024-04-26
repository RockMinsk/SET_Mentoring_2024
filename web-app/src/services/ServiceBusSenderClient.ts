import { ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
import { logger } from '../helpers/loggerConfig';
import 'dotenv/config';

export class ServiceBusSenderClient {
    private readonly connectionString: string;
    private client: ServiceBusClient;

    constructor() {
        this.connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING || "";
        this.client = new ServiceBusClient(this.connectionString);
    }

    public async sendMessageToTopic(topicName: string, message: ServiceBusMessage) {
        const sender = this.client.createSender(topicName);

        try {   
            await sender.sendMessages(message);
            logger.info(`Sent message to topic: ${topicName}`);
        } catch (err) {
            logger.error(`Error sending message to topic: ${topicName}`);
            throw err;
        } finally {
            await sender.close();
        }
    }
}