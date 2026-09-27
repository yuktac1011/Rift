package rift.verification.agent

default allow = false

allow {
    input.action_type != "delete_system_files"
    input.confidence_score > 0.8
}

deny[msg] {
    input.action_type == "delete_system_files"
    msg := "Destructive actions are prohibited"
}
