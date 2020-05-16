#!/usr/bin/env bash

# Helper script forked by bot
# syncs app with revision=branch

function usage_and_exit() {
    echo "${0} [app name] [branch]"
    exit 1
}

app_name="${1}"
branch="${2}"

if [[ -z "${app_name}" || -z "${branch}" ]]; then
    usage_and_exit
fi

# 10 second timeout
argocd app sync ${app_name} --revision=${branch} --plaintext --grpc-web && argocd app wait ${app_name} --operation --timeout=10 --plaintext --grpc-web
