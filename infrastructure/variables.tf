variable "prefix" {
  type        = string
  description = "The prefix used for all resources in this example"
}

variable "location" {
  type        = string
  description = "The Azure location where all resources in this example should be created"
  default     = "Poland Central"
}

variable "location2" {
  type        = string
  description = "The Azure second location where some specific resources in this example should be created"
  default     = "West Europe"
}

variable "acr_image_name" {
  type        = string
  description = "The Azure docker image name"
  default     = "webapi1:latest"
}

variable "asa_file_uploading_method" {
  type        = string
  description = "The method to upload data to Blob storage. Can be 'stream' or 'sync'"
  default     = "stream"
}

variable "afa_function_name" {
  type        = string
  description = "The function name that should be pushed to the Azure Function App"
  default     = "imageAnalisys"
}
