output "rg_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.rg.name
}

output "rg_location" {
  description = "The location of the resource group"
  value       = azurerm_resource_group.rg.location
}

output "acr_login_server" {
  description = "The login server of the azure container registry"
  value       = azurerm_container_registry.acr.login_server
}

output "acr_admin_username" {
  description = "The admin username in the azure container registry"
  value       = azurerm_container_registry.acr.admin_username
}

output "acr_admin_password" {
  description = "The admin password in the azure container registry"
  value       = azurerm_container_registry.acr.admin_password
}

output "docker_push" {
  description = "Triggers a change when docker push completes within the tf-environment module"
  value       = null_resource.docker_push.triggers
}

output "storage_account_name" {
  description = "The name of the storage account"
  value       = azurerm_storage_account.storage.name
}

output "storage_account_primary_access_key" {
  description = "The primary access key of the storage account"
  value       = azurerm_storage_account.storage.primary_access_key
}

output "storage_container_name" {
  description = "The name of the storage container"
  value       = azurerm_storage_container.storage-container.name
}

output "storage_container_sas" {
  description = "The shared access signature of the storage account blob container"
  value       = data.azurerm_storage_account_blob_container_sas.storage-container-sas.sas
}

output "cosmosdb_account_endpoint" {
  description = "The endpoint of the cosmos db account"
  value       = azurerm_cosmosdb_account.cosmosdb.endpoint
}

output "cosmosdb_account_primary_key" {
  description = "The primary key of the cosmos db account"
  value       = azurerm_cosmosdb_account.cosmosdb.primary_key
}

output "cosmosdb_sql_database_name" {
  description = "The name of the cosmos db sql database"
  value       = azurerm_cosmosdb_sql_database.cosmosdb-database.name
}

output "cosmosdb_sql_container_name" {
  description = "The name of the cosmos db sql container"
  value       = azurerm_cosmosdb_sql_container.cosmosdb-container.name
}

output "servicebus_namespace_primary_conn_str" {
  description = "The primary connection string of the service bus namespace"
  value       = azurerm_servicebus_namespace.sb-namespace.default_primary_connection_string
}

output "servicebus_topic_name" {
  description = "The name of the service bus topic"
  value       = azurerm_servicebus_topic.sb-topic.name
}

output "servicebus_topic_id" {
  description = "The ID of the service bus topic"
  value       = azurerm_servicebus_topic.sb-topic.id
}

output "cognitive_account_endpoint" {
  description = "The endpoint of the cognitive account"
  value       = azurerm_cognitive_account.cv.endpoint
}

output "cognitive_account_primary_access_key" {
  description = "The primary access key of the cognitive account"
  value       = azurerm_cognitive_account.cv.primary_access_key
}

output "appinsights_instrumentation_key" {
  description = "The instrumentation key of the application insights"
  value       = azurerm_application_insights.func-insights.instrumentation_key
}

output "appinsights_connection_string" {
  description = "The connection string of the application insights"
  value       = azurerm_application_insights.func-insights.connection_string
}