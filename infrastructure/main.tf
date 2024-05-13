module "tf_environment" {
  source = "./modules/tf-environment"

  prefix         = var.prefix
  location       = var.location
  location2      = var.location2
  acr_image_name = var.acr_image_name
  timestamp      = local.timestamp
}

module "tf-application" {
  source = "./modules/tf-application"

  prefix                                = var.prefix
  location                              = var.location
  location2                             = var.location2
  acr_image_name                        = var.acr_image_name
  asa_file_uploading_method             = var.asa_file_uploading_method
  timestamp                             = local.timestamp
  acr_admin_password                    = module.tf_environment.acr_admin_password
  acr_admin_username                    = module.tf_environment.acr_admin_username
  acr_login_server                      = module.tf_environment.acr_login_server
  docker_push                           = module.tf_environment.docker_push
  appinsights_connection_string         = module.tf_environment.appinsights_connection_string
  appinsights_instrumentation_key       = module.tf_environment.appinsights_instrumentation_key
  cognitive_account_endpoint            = module.tf_environment.cognitive_account_endpoint
  cognitive_account_primary_access_key  = module.tf_environment.cognitive_account_primary_access_key
  cosmosdb_account_endpoint             = module.tf_environment.cosmosdb_account_endpoint
  cosmosdb_account_primary_key          = module.tf_environment.cosmosdb_account_primary_key
  cosmosdb_sql_container_name           = module.tf_environment.cosmosdb_sql_container_name
  cosmosdb_sql_database_name            = module.tf_environment.cosmosdb_sql_database_name
  rg_location                           = module.tf_environment.rg_location
  rg_name                               = module.tf_environment.rg_name
  servicebus_namespace_primary_conn_str = module.tf_environment.servicebus_namespace_primary_conn_str
  servicebus_topic_id                   = module.tf_environment.servicebus_topic_id
  servicebus_topic_name                 = module.tf_environment.servicebus_topic_name
  storage_account_name                  = module.tf_environment.storage_account_name
  storage_account_primary_access_key    = module.tf_environment.storage_account_primary_access_key
  storage_container_name                = module.tf_environment.storage_container_name
  storage_container_sas                 = module.tf_environment.storage_container_sas
}
