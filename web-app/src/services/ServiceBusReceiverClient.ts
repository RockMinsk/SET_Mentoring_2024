import { delay, ProcessErrorArgs, ServiceBusClient, ServiceBusReceivedMessage } from "@azure/service-bus";
import { logger } from '../helpers/loggerConfig';
import 'dotenv/config';

export class ServiceBusReceiverClient {
    private readonly connectionString: string;
    private client: ServiceBusClient;

    constructor() {
        this.connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING || "";
        this.client = new ServiceBusClient(this.connectionString);
    }

    public async receiveMessageFromTopic(topicName: string) {
        const receiver = this.client.createReceiver(topicName, process.env.AZURE_SERVICE_BUS_SUBSCRIPTION_NAME || "");

        try {
            const myMessageHandler = async (messageReceived: ServiceBusReceivedMessage) => {
                logger.info(`Received message: ${messageReceived.body}`);
            };

            const myErrorHandler = async (error: ProcessErrorArgs) => {
                logger.error(error);
            };

            receiver.subscribe({
                processMessage: myMessageHandler,
                processError: myErrorHandler
            });

            await delay(5000);

            await receiver.close();
        } catch (err) {
            logger.error(`Error receiving message from topic: ${topicName}`);
            throw err;
        } finally {
            await this.client.close();
        }
    }

}