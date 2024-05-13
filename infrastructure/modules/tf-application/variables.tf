variable "prefix" {
  type        = string
  description = "The prefix used for all resources in this example"
}

variable "location" {
  type        = string
  description = "The Azure location where all resources in this example should be created"
}

variable "location2" {
  type        = string
  description = "The Azure second location where some specific resources in this example should be created"
}

variable "acr_image_name" {
  type        = string
  description = "The Azure docker image name"
}

variable "asa_file_uploading_method" {
  type        = string
  description = "The method to upload data to Blob storage. Can be 'stream' or 'sync'"
}

variable "timestamp" {
  type        = string
  description = "Formatted timestamp"
}

variable "rg_name" {
  description = "The name of the resource group"
  type        = string
}

variable "rg_location" {
  description = "The location of the resource group"
  type        = string
}

variable "acr_login_server" {
  description = "The login server of the azure container registry"
  type        = string
}

variable "acr_admin_username" {
  description = "The admin username in the azure container registry"
  type        = string
}

variable "acr_admin_password" {
  description = "The admin password in the azure container registry"
  type        = string
}

variable "docker_push" {
  description = "Variable to assign null_resource.docker_push to"
  type        = map(string)
}

variable "storage_account_name" {
  description = "The name of the storage account"
  type        = string
}

variable "storage_account_primary_access_key" {
  description = "The primary access key of the storage account"
  type        = string
}

variable "storage_container_name" {
  description = "The name of the storage container"
  type        = string
}

variable "storage_container_sas" {
  description = "The shared access signature of the storage account blob container"
  type        = string
}

variable "cosmosdb_account_endpoint" {
  description = "The endpoint of the cosmos db account"
  type        = string
}

variable "cosmosdb_account_primary_key" {
  description = "The primary key of the cosmos db account"
  type        = string
}

variable "cosmosdb_sql_database_name" {
  description = "The name of the cosmos db sql database"
  type        = string
}

variable "cosmosdb_sql_container_name" {
  description = "The name of the cosmos db sql container"
  type        = string
}

variable "servicebus_namespace_primary_conn_str" {
  description = "The primary connection string of the service bus namespace"
  type        = string
}

variable "servicebus_topic_name" {
  description = "The name of the service bus topic"
  type        = string
}

variable "servicebus_topic_id" {
  description = "The ID of the service bus topic"
  type        = string
}

variable "cognitive_account_endpoint" {
  description = "The endpoint of the cognitive account"
  type        = string
}

variable "cognitive_account_primary_access_key" {
  description = "The primary access key of the cognitive account"
  type        = string
}

variable "appinsights_instrumentation_key" {
  description = "The instrumentation key of the application insights"
  type        = string
}

variable "appinsights_connection_string" {
  description = "The connection string of the application insights"
  type        = string
}
