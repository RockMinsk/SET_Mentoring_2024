#!/bin/bash
# TODO [KS]: script implementation is in progress

# NOTE. Define variables
organization=$1
project=$2
repositoryId=$3
pullRequestId=$4
apiVersion=5.1

# NOTE. Create a personal access token at https://dev.azure.com/{yourorganization}/_usersSettings/tokens
# NOTE. Make sure it has full access to Code (read & write).
pat=$5

# NOTE. Use CURL command to update pull request to auto-complete
curl -X PATCH \
  https://${organization}.dev.azure.com/${project}/_apis/git/repositories/${repositoryId}/pullrequests/${pullRequestId}?api-version=${apiVersion} \
  -H 'Content-Type: application/json' \
  -u :${pat} \
  -d '{
    "autoCompleteSetBy": { "id": "00000002-0000-8888-8000-000000000000" },
    "completionOptions": {
      "mergeCommitMessage": "Merging PR",
      "deleteSourceBranch": true,
      "squashMerge": true
    }
  }'