output "webapp_url" {
  description = "The URL of the webapp"
  value       = "https://${azurerm_linux_web_app.webapp.name}.azurewebsites.net"
}