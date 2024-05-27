#!/bin/bash

if [ "$1" == "dev" ]; then
  terraform workspace select dev || terraform workspace new dev
  terraform init
  terraform apply -auto-approve -var-file='tf-dev/terraform.tfvars'
elif [ "$1" == "qa" ]; then
  terraform workspace select qa || terraform workspace new qa
  terraform init
  terraform apply -auto-approve -var-file='tf-qa/terraform.tfvars'
elif [ "$1" == "prod" ]; then
  terraform workspace select prod || terraform workspace new prod
  terraform init
  terraform apply -auto-approve -var-file='tf-prod/terraform.tfvars'
else
  echo "Usage: $0 {dev|qa|prod}"
  exit 1
fi

APP_URL=$(terraform output -raw webapp_url)
echo "##vso[task.setvariable variable=appUrl]$APP_URL"