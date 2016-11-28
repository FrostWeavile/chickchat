#!/usr/bin/env bash

set -e

CWD=$(cd $(dirname $0) ; pwd)
REPO_ROOT=$(cd $CWD/.. ; pwd)

function log_date() {
  echo -n "$(date +'%Y-%m-%d %H:%M:%S')"
}

function log_info() {
  local msg=$@
  log_date
  echo " [INFO] ${msg}"
}

function log_error() {
  local msg=$@
  log_date
  echo " [ERROR] ${msg}"
}

aws_cli=$(which aws 2> /dev/null)
if [ -z "${aws_cli}" ] ; then
  log_error "Could not find aws cli."
  exit 1
fi

ARTIFACT_NAME=api_backend.zip
ARTIFACT=${REPO_ROOT}/${ARTIFACT_NAME}

if [ ! -f ${ARTIFACT} ] ; then
  log_error "Could not find artifact at: ${ARTIFACT}"
  log_error "Run 'yarn package' before deploying."
  exit 1
fi

AWS="${aws_cli} --output json --region us-west-2"

S3_BUCKET=chickchat-artifact
artifact_cnt=$($AWS s3api list-buckets --query "Buckets[?Name == '$S3_BUCKET'].Name[] | length(@)")

if [ $artifact_cnt = "0" ] ; then
  log_info "Creating s3 bucket named: ${S3_BUCKET}"
  $AWS s3api create-bucket \
    --bucket ${S3_BUCKET} \
    --create-bucket-configuration 'LocationConstraint=us-west-2'
  $AWS s3api put-bucket-versioning \
    --bucket ${S3_BUCKET} \
    --versioning-configuration 'Status=Enabled'
fi

S3_ARTIFACT=s3://${S3_BUCKET}/${ARTIFACT_NAME}
$AWS s3 cp ${ARTIFACT} ${S3_ARTIFACT}
log_info "Uploaded ${ARTIFACT_NAME} to ${S3_ARTIFACT}"

SWAGGER_NAME=swagger.yaml
SWAGGER=${REPO_ROOT}/${SWAGGER_NAME}
S3_SWAGGER=s3://${S3_BUCKET}/${SWAGGER_NAME}
$AWS s3 cp ${SWAGGER} ${S3_SWAGGER}
log_info "Uploaded ${SWAGGER_NAME} to ${S3_SWAGGER}"

STACK_NAME=chickchat-api
log_info "Packaging cloud formation..."
$AWS cloudformation package \
  --template-file aws-sam.yaml \
  --output-template-file rendered-aws-sam.yaml \
  --s3-bucket ${S3_BUCKET} \
  --kms-key-id ${KMS_KEY_ARN}
log_info "Deploying cloudformation stack: ${STACK_FORMATION}"
$AWS cloudformation deploy \
  --template-file rendered-aws-sam.yaml \
  --capabilities CAPABILITY_IAM \
  --stack-name ${STACK_NAME} \
  || true
log_info "Deployed cloudformation stack: ${STACK_FORMATION}"

$AWS lambda update-function-code \
  --function-name chickchat-api-AppFunction-12CWVAN7CQV1G \
  --s3-bucket ${S3_BUCKET} \
  --s3-key ${ARTIFACT_NAME} \
  --publish
