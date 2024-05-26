# Software Engineering in Test Global Mentoring Program: Advanced #2

## Preconditions:
- Create a service connection to your subscription in Azure DevOps: `Project settings -> Pipelines -> Service connections`;
- Go to the `App registration` on the Azure portal and create a new Client secret: `App registration -> <New app registration name> -> Certificates & secrets`;
- Store ARM_CLIENT_ID and ARM_CLIENT_SECRET of the created app registration.
- Create a new group `terraform-variables` in the Azure DevOps: `Pipelines -> Library -> Variable groups`;
- Add the following variables (from the new App registration appeared after creation of the connection) in the created group:
    - ARM_CLIENT_ID
    - ARM_CLIENT_SECRET
    - ARM_SUBSCRIPTION_ID
    - ARM_TENANT_ID
- Grant permissions in the pipeline to use variables from the variable group.