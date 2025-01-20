#!/usr/bin/env bash

set -e

# This script starts and configures a Vault server with c4ghtransit plugin enabled
# and applies the pre-defined configuration to work with the backend server

# Dependencies
# - swift-browser-ui
# - c4ghtransit
# - go
# - vault
# - correctly set environment variables

# get the root of swift-browser-ui
SCRIPT="$(realpath $0)"
SCRIPTS=$(dirname "$SCRIPT")
ROOT=$(dirname "$SCRIPTS")

# set paths of swift-browser-ui and c4gh-transit vault plugin
C4GH_TRANSIT_DIR=${C4GH_TRANSIT_DIR:-/tmp/c4gh-transit}
SWIFT_BROWSER_UI_DIR=${SWIFT_BROWSER_UI_DIR:-$ROOT}

function initVault {
    cd "$SWIFT_BROWSER_UI_DIR"
    export VAULT_ADDR=${VAULT_URL%/v1}
    # wait for vault to be running
    wget --no-verbose --retry-connrefused --waitretry=1 --tries 10 --timeout=3 --spider "${VAULT_URL}/sys/health?standbyok=true"
    vault login token=${VAULT_TOKEN}
    vault auth enable approle
    vault secrets enable c4ghtransit
    vault policy write "$VAULT_ROLE" "$SWIFT_BROWSER_UI_DIR"/.github/config/vault_policy.hcl
    vault write auth/approle/role/"$VAULT_ROLE" \
        secret_id_ttl=0 \
        secret_id_num_uses=0 \
        token_ttl=5m \
        token_max_ttl=5m \
        token_num_uses=0 \
        token_policies="$VAULT_ROLE" \
        role_id="$VAULT_ROLE"
    vault write -format=json -f auth/approle/role/"$VAULT_ROLE"/custom-secret-id secret_id="$VAULT_SECRET"
}


# pull the plugin if the directory doesn't exist
if [ ! -d "$C4GH_TRANSIT_DIR" ]; then
    git clone ssh://git@gitlab.ci.csc.fi:10022/sds-dev/c4gh-transit.git "$C4GH_TRANSIT_DIR"
fi

# update the code and build the plugin
cd "$C4GH_TRANSIT_DIR"
git pull
mkdir -p vault/plugins
go build -v -o vault/plugins/c4ghtransit c4ghtransit/cmd/c4ghtransit/main.go

# setup vault for swift-browser-ui in the background, after the server is up
initVault 2>&1 &

# start vault server in development mode
VAULT_LOG_LEVEL=ERROR exec vault server -dev -dev-plugin-dir=vault/plugins -dev-root-token-id=${VAULT_TOKEN}
