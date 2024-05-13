# Software Engineering in Test Global Mentoring Program: Advanced #2

## Preconditions:
- Login to the Azure CLI should be done locally, so scripts can:
  - login to the Azure Container Registry and push local Web App image;
  - restart Web App application;
- Azure-functions-core-tools-4 should be installed locally, so scripts can:
  - publish function from local `function-app` to the Azure Function App;
- Install TF linters locally:
  - TFLint:
```bash
curl -Lo tflint.zip https://github.com/terraform-linters/tflint/releases/download/v0.31.0/tflint_linux_amd64.zip
unzip tflint.zip
sudo install tflint /usr/local/bin
rm tflint.zip
```
  - Checkov:
```bash
sudo apt install python3-pip
pip3 install checkov
```
  - TFSec:
```bash
curl -Lo tfsec https://github.com/tfsec/tfsec/releases/download/v0.58.14/tfsec-linux-amd64
chmod +x tfsec
sudo mv tfsec /usr/local/bin/
``` 

## Usage:

### Lint:

```bash
./lint.sh
```

### Dev environment:
 - **Deploy:**
```bash
./deploy.sh dev
```
- **Destroy:**
```bash
./destroy.sh dev
```

### QA environment:
- **Deploy:**
```bash
./deploy.sh qa
```
- **Destroy:**
```bash
./destroy.sh qa
```

### Prod environment:
- **Deploy:**
```bash
./deploy.sh prod
```
- **Destroy:**
```bash
./destroy.sh prod
```