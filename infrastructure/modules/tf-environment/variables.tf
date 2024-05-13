variable "prefix" {
  type        = string
  description = "The prefix used for all resources in this module"
}

variable "location" {
  type        = string
  description = "The Azure location where all resources in this module should be created"
}

variable "location2" {
  type        = string
  description = "The Azure second location where some specific resources in this module should be created"
}

variable "acr_image_name" {
  type        = string
  description = "The Azure docker image name"
}

variable "timestamp" {
  type        = string
  description = "Formatted timestamp"
}