path "c4ghtransit/keys/*" {
  capabilities = ["create", "update", "read"]
}
path "c4ghtransit/whitelist/*" {
  capabilities = ["create", "update", "read", "delete", "patch", "list"]
}
path "c4ghtransit/files/*" {
  capabilities = ["create", "update", "read", "delete", "patch", "list"]
}
