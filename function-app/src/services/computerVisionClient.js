const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');

require("dotenv").config();

const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT || '';
const key = process.env.AZURE_COMPUTER_VISION_ACCESS_KEY || '';

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const features = ['Caption','Tags'];

async function analyzeImageFromUrl(imageUrl) {
    try {
        let tags = [];
        const result = await client.path('/imageanalysis:analyze').post({
            body: {
                url: imageUrl
            },
            queryParameters: {
                features: features,
                "smartCrops-aspect-ratios": [0.9, 1.33],
            },
            contentType: 'application/json'
        });
        console.log(`Image analysis result: ${JSON.stringify(result.body)}`);
        const iaResult = result.body

        if (iaResult.tagsResult) {
            const tagsResult = iaResult.tagsResult;
            tags = tagsResult.values.filter(tag => tag.confidence > 0.9).map(tag => tag.name);
            console.log("Image analysis result (tags):", tags);
        }
        return tags;
    }
    catch (error) {
        console.error("Error:", error);
    }
}

module.exports = { analyzeImageFromUrl };
