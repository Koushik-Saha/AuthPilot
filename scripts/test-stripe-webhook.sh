#!/usr/bin/env bash
# AuthPilot Stripe Webhook Forwarder Script

echo "Starting Stripe CLI Webhook listener forwarding to http://localhost:3000/api/billing/webhook..."

if ! command -v stripe &> /dev/null
then
    echo "Stripe CLI is not installed. Please install via: brew install stripe/stripe-cli/stripe"
    exit 1
fi

stripe listen --forward-to localhost:3000/api/billing/webhook
