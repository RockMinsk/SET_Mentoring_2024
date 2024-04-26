const { app } = require('@azure/functions');
const { analyzeImageFromUrl } = require('../services/computerVisionClient');

app.serviceBusTopic('ServiceBusTopicTrigger1', {
    connection: "servicebuswebapi1_SERVICEBUS",
    topicName: process.env.AZURE_SERVICE_BUS_TOPIC_NAME,
    subscriptionName: process.env.AZURE_SERVICE_BUS_SUBSCRIPTION_NAME,

    handler: async(mySbMsg1, context) => {
        context.log('Service bus topic function processed message:', mySbMsg1);
        const blobUrl = mySbMsg1?.data?.url;
        context.log(`Blob URL: ${blobUrl}`);

        try {
            const fullBlobUrl = `${blobUrl}?${process.env.AZURE_STORAGE_ACCOUNT_SHARED_ACCESS_TOKEN}`;
            return blobUrl && analyzeImageFromUrl(`${fullBlobUrl}`);
        } catch (error) {
            context.log(`Error: ${error}`);
        }
    }
});
