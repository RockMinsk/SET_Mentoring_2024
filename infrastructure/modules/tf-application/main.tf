resource "azurerm_service_plan" "sp" {
  name                = "${var.prefix}-sp-free-${var.timestamp}"
  location            = var.rg_location
  resource_group_name = var.rg_name
  os_type             = "Linux"
  sku_name            = "F1"
}

resource "azurerm_service_plan" "sp-paid" {
  name                = "${var.prefix}-sp-paid-${var.timestamp}"
  location            = var.location2
  resource_group_name = var.rg_name
  os_type             = "Windows"
  sku_name            = "Y1"
}

resource "azurerm_linux_web_app" "webapp" {
  name                                           = "${var.prefix}-webapp-${var.timestamp}"
  location                                       = var.rg_location
  resource_group_name                            = var.rg_name
  service_plan_id                                = azurerm_service_plan.sp.id
  https_only                                     = true
  webdeploy_publish_basic_authentication_enabled = false
  ftp_publish_basic_authentication_enabled       = false

  depends_on = [var.docker_push]

  site_config {
    always_on = false
    application_stack {
      docker_image_name        = var.acr_image_name
      docker_registry_url      = "https://${var.acr_login_server}"
      docker_registry_username = var.acr_admin_username
      docker_registry_password = var.acr_admin_password
    }
  }

  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE       = "true"
    LOGGER_LEVEL                              = "debug"
    DOCKER_ENABLE_CI                          = "true"
    AZURE_STORAGE_ACCOUNT_NAME                = var.storage_account_name
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY          = var.storage_account_primary_access_key
    AZURE_STORAGE_ACCOUNT_SHARED_ACCESS_TOKEN = var.storage_container_sas
    AZURE_STORAGE_CONTAINER_NAME              = var.storage_container_name
    AZURE_STORAGE_FILE_UPLOADING_METHOD       = var.asa_file_uploading_method
    AZURE_COSMOS_DB_ACCOUNT_URI               = var.cosmosdb_account_endpoint
    AZURE_COSMOS_DB_ACCOUNT_ACCESS_KEY        = var.cosmosdb_account_primary_key
    AZURE_COSMOS_DB_DATABASE_ID               = var.cosmosdb_sql_database_name
    AZURE_COSMOS_DB_CONTAINER_ID              = var.cosmosdb_sql_container_name
    AZURE_SERVICE_BUS_CONNECTION_STRING       = var.servicebus_namespace_primary_conn_str
    AZURE_SERVICE_BUS_TOPIC_NAME              = var.servicebus_topic_name
    AZURE_SERVICE_BUS_SUBSCRIPTION_NAME       = azurerm_servicebus_subscription.sb-subscription.name
  }

  logs {
    application_logs {
      file_system_level = "Information"
    }
  }
}

#TODO [KS]: implement this resource later to automatically update Web App in case of new images
#resource "azurerm_container_registry_webhook" "cr-webhook" {
#  name                = "${var.prefix}-cr-webhook-${var.timestamp}"
#  resource_group_name = var.rg_name
#  registry_name       = azurerm_container_registry.cr.name
#  location            = var.rg_location
#
#  service_uri         = "https://${azurerm_container_registry_webhook.cr-webhook.name}/api/registry/webhook"
#  status              = "enabled"
#  scope = azurerm_container_registry.cr.name
#  actions = ["push"]
#  custom_headers      = {
#    "Content-Type" = "application/json"
#  }
#}

resource "azurerm_servicebus_subscription" "sb-subscription" {
  name                = "${var.prefix}-sb-subscription-${var.timestamp}"
  topic_id            = var.servicebus_topic_id
  max_delivery_count  = 10
  default_message_ttl = "P14DT0H0M0S"
  auto_delete_on_idle = "PT336H"
  lock_duration       = "PT1M"
}

resource "azurerm_windows_function_app" "func" {
  name                                           = "${var.prefix}-funcapp-${var.timestamp}"
  location                                       = var.location2
  resource_group_name                            = var.rg_name
  service_plan_id                                = azurerm_service_plan.sp-paid.id
  https_only                                     = true
  webdeploy_publish_basic_authentication_enabled = false
  ftp_publish_basic_authentication_enabled       = false

  depends_on = [var.docker_push]

  storage_account_name       = var.storage_account_name
  storage_account_access_key = var.storage_account_primary_access_key

  site_config {
    application_insights_key               = var.appinsights_instrumentation_key
    application_insights_connection_string = var.appinsights_connection_string
  }

  app_settings = {
    FUNCTIONS_EXTENSION_VERSION               = "~4"
    FUNCTIONS_WORKER_RUNTIME                  = "node"
    WEBSITE_NODE_DEFAULT_VERSION              = "~20"
    AzureWebJobsFeatureFlags                  = "EnableWorkerIndexing"
    AZURE_STORAGE_ACCOUNT_NAME                = var.storage_account_name
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY          = var.storage_account_primary_access_key
    AZURE_STORAGE_ACCOUNT_SHARED_ACCESS_TOKEN = var.storage_container_sas
    AZURE_STORAGE_CONTAINER_NAME              = var.storage_container_name
    AZURE_COSMOS_DB_ACCOUNT_URI               = var.cosmosdb_account_endpoint
    AZURE_COSMOS_DB_ACCOUNT_ACCESS_KEY        = var.cosmosdb_account_primary_key
    AZURE_COSMOS_DB_DATABASE_ID               = var.cosmosdb_sql_database_name
    AZURE_COSMOS_DB_CONTAINER_ID              = var.cosmosdb_sql_container_name
    AZURE_SERVICE_BUS_CONNECTION_STRING       = var.servicebus_namespace_primary_conn_str
    AZURE_SERVICE_BUS_TOPIC_NAME              = var.servicebus_topic_name
    AZURE_SERVICE_BUS_SUBSCRIPTION_NAME       = azurerm_servicebus_subscription.sb-subscription.name
    AZURE_COMPUTER_VISION_ENDPOINT            = var.cognitive_account_endpoint
    AZURE_COMPUTER_VISION_ACCESS_KEY          = var.cognitive_account_primary_access_key
    servicebuswebapi1_SERVICEBUS              = var.servicebus_namespace_primary_conn_str
  }

  #  TODO [KS]: clarify why npm install doesn't run when Azure CLI uses for publishing and run when VSCode uses ("node_modules" excluded from .functionignore because of that)
  provisioner "local-exec" {
    command     = <<EOF
  cd ../function-app
  set -e
  func azure functionapp publish ${self.name}
EOF
    interpreter = ["/bin/bash", "-c"]
  }
}

# TODO [KS]: investigate why Web App is not available without restarting (seems that restart not needed - just application becomes available not immediatly, but with some delay)
resource "null_resource" "restart_webapp" {
  triggers = {
    always_run = timestamp()
  }

  depends_on = [azurerm_linux_web_app.webapp]

  provisioner "local-exec" {
    command     = "az webapp restart --name ${azurerm_linux_web_app.webapp.name} --resource-group ${var.rg_name}"
    interpreter = ["/bin/sh", "-c"]
  }
}
