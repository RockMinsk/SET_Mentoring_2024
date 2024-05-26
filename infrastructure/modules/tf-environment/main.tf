resource "azurerm_resource_group" "rg" {
  name     = "${var.prefix}-rg-${var.timestamp}"
  location = var.location

  lifecycle {
    ignore_changes = [name]
  }
}

resource "azurerm_container_registry" "acr" {
  name                = "${var.prefix}acr${var.timestamp}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard"
  admin_enabled       = true
}

resource "null_resource" "docker_push" {
  triggers = {
    always_run = timestamp()
  }

  depends_on = [azurerm_container_registry.acr]

  provisioner "local-exec" {
    command     = <<EOF
    set -e && \
    docker build -t ${azurerm_container_registry.acr.login_server}/${var.acr_image_name} ../web-app/. && \
    az acr login --name ${azurerm_container_registry.acr.name} && \
    docker push ${azurerm_container_registry.acr.login_server}/${var.acr_image_name}
    EOF
    interpreter = ["/bin/sh", "-c"]
  }
}

resource "azurerm_storage_account" "storage" {
  name                     = "${var.prefix}storage${var.timestamp}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"
}

resource "azurerm_storage_container" "storage-container" {
  name                  = "${var.prefix}-storage-container-${var.timestamp}"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "private"
}

data "azurerm_storage_account_blob_container_sas" "storage-container-sas" {
  connection_string = azurerm_storage_account.storage.primary_connection_string
  container_name    = azurerm_storage_container.storage-container.name
  https_only        = true

  #  TODO [KS]: remove below code and uncomment the next one after fixing defect https://github.com/Azure/azure-rest-api-specs/issues/18631
  start  = "2024-05-10"
  expiry = "2024-06-10"
  #  start  = timestamp()
  #  expiry = timeadd(timestamp(), "720h")

  permissions {
    read   = true
    add    = false
    create = false
    write  = false
    delete = false
    list   = false
  }
}

resource "azurerm_cosmosdb_account" "cosmosdb" {
  name                = "${var.prefix}-cosmosdb-${var.timestamp}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  # NOTE. Only one free account (F0) available for subscription
  free_tier_enabled   = true

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }

  timeouts {
    create = "15m"
    delete = "15m"
  }
}

resource "azurerm_cosmosdb_sql_database" "cosmosdb-database" {
  name                = "${var.prefix}-cosmosdb-database-${var.timestamp}"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name
  throughput          = 400
}

resource "azurerm_cosmosdb_sql_container" "cosmosdb-container" {
  name                = "${var.prefix}-cosmosdb-container-${var.timestamp}"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name
  database_name       = azurerm_cosmosdb_sql_database.cosmosdb-database.name
  partition_key_path  = "/id"
  throughput          = 400
}

resource "azurerm_servicebus_namespace" "sb-namespace" {
  name                = "${var.prefix}-sb-namespace-${var.timestamp}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard"
}

resource "azurerm_servicebus_topic" "sb-topic" {
  name                = "${var.prefix}-sb-topic-${var.timestamp}"
  namespace_id        = azurerm_servicebus_namespace.sb-namespace.id
  enable_partitioning = true
}

resource "azurerm_cognitive_account" "cv" {
  name                = "${var.prefix}-cv-${var.timestamp}"
  location            = var.location2
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "ComputerVision"
  # NOTE. Only one free account (F0) available for subscription
  sku_name = "F0"

  tags = {
    ENV = "Test"
  }
}

resource "azurerm_application_insights" "func-insights" {
  name                = "${var.prefix}-appinsights-${var.timestamp}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location2
  application_type    = "web"
}
