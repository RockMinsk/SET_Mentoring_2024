#!/bin/bash

tf_output=$(tflint . 2>&1)
chk_tf=$?
ck_output=$(checkov -d . 2>&1)
chk_ck=$?
sec_output=$(tfsec . 2>&1)
chk_sec=$?

if [ $chk_tf -ne 0 ]; then
  echo "TFLint check failed:"
  echo $tf_output
fi
if [ $chk_ck -ne 0 ]; then
  echo "Checkov check failed:"
  echo $ck_output
fi
if [ $chk_sec -ne 0 ]; then
  echo "TFSec check failed:"
  echo $sec_output
fi

if [ $chk_tf -ne 0 ] || [ $chk_ck -ne 0 ] || [ $chk_sec -ne 0 ]
then
  echo "One or more static code analysis checks failed."
  exit 1
else
  echo "Static code analysis checks passed."
  exit 0
fi