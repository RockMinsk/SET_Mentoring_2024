# Software Engineering in Test Global Mentoring Program: Advanced #2

## Preconditions:

- On the [Azure portal](https://portal.azure.com/) should be created:
    - Container registry;
    - App Service;
    - Service Bus Namespace;
      - Service Bus Topic;
      - Service Bus Topic subscription;
    - Blob Storage account;
        - Blob Storage container;
    - Azure Cosmos DB account;
        - Azure Cosmos DB database;
        - Azure Cosmos DB container;
    - Function App;
      - Function (Azure Service Bus Topic trigger);
        - Input - Azure Service Bus;
        - Output - Azure Cosmos DB.

## Preparation:

### Local usage:

1. **Update app settings**
    - Create/update `.env` and `local.settings.json` files (see `*.example` files in the project)

2. **Install dependencies**
```bash
npm run install
```

3. **Start applications**
```bash
npm run start
```

### Cloud usage:
1. **Setup app settings on the Azure portal**
    - App Service;
    - Function App;


2. **Build docker image locally**
```bash
 docker build --tag <IMAGE_NAME> .
```

3. **Tag docker image by using Azure registry**
```bash
 docker tag <IMAGE_NAME> <AZURE_REGISTRY>/<IMAGE_NAME>
```

4. **Push docker image to Azure registry**
```bash
 docker push <AZURE_REGISTRY>/<IMAGE_NAME>
```