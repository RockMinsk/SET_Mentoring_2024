const armResources = require('@azure/arm-resources');
const identity = require('@azure/identity');

require("dotenv").config();

let client;

beforeAll(async () => {
  const clientId = process.env['AZURE_CLIENT_ID']
  const clientSecret = process.env['AZURE_CLIENT_SECRET']
  const tenantId = process.env['AZURE_TENANT_ID']
  const subscriptionId = process.env['AZURE_SUBSCRIPTION_ID']

  const credentials = new identity.ClientSecretCredential(tenantId, clientId, clientSecret);

  client = new armResources.ResourceManagementClient(credentials, subscriptionId);
});

async function getResourcesByPrefix(prefix) {
  const allResources = await client.resources.list();
  return allResources.filter(resource => resource.name.startsWith(prefix));
}

describe('QA: Azure deployed QA resources', () => {

  test('All resources with prefix "qa" should exist', async () => {
    const resources = await getResourcesByPrefix('qa')

    expect(resources).not.toHaveLength(0);
    expect(resources).toHaveLength(10)
  });

  test('A specific resource with prefix "qa-cosmosdb" should exist', async () => {
    const resource = await getResourcesByPrefix('qa-cosmosdb')
    expect(resource).toBeDefined();
    expect(resource).toHaveLength(1)
  });
});

describe('DEV: Azure deployed Dev resources', () => {

  test('All resources with prefix "dev" should exist', async () => {
    const resources = await getResourcesByPrefix('dev')

    expect(resources).not.toHaveLength(0);
    expect(resources).toHaveLength(10)
  });

  test('A specific resource with prefix "dev-webapp" should exist', async () => {
    const resource = await getResourcesByPrefix('dev-webapp')
    expect(resource).toBeDefined();
    expect(resource).toHaveLength(1)
  });
});

describe('PROD: Azure deployed Prod resources', () => {

  test('All resources with prefix "prod" should exist', async () => {
    const resources = await getResourcesByPrefix('prod')

    expect(resources).not.toHaveLength(0);
    expect(resources).toHaveLength(10)
  });

  test('A specific resource with prefix "prod-funcapp" should exist', async () => {
    const resource = await getResourcesByPrefix('prod-funcapp')
    expect(resource).toBeDefined();
    expect(resource).toHaveLength(1)
  });
});
