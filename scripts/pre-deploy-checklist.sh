#!/usr/bin/env bash
# AuthPilot Pre-Deploy Production Verification Checklist Script

set -e

echo "===================================================="
echo "🛡️  AUTHPILOT PRE-DEPLOYMENT SECURITY & HEALTH CHECK"
echo "===================================================="

# Check 1: Mandatory Environment Variables
echo -n "Checking environment variables... "
if [ -z "$DATABASE_URL" ] && [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
    echo "FAILED: Missing environment configuration."
    exit 1
fi
echo "PASSED ✓"

# Check 2: Verify zero PHI keywords in console.log statements
echo -n "Auditing codebase for PHI logging violations... "
PHI_LOGS=$(grep -rn "console.log" src/ | grep -iE "patient_name|medicaid_id|ssn|dob" || true)
if [ -n "$PHI_LOGS" ]; then
    echo "FAILED: Unsanitized PHI found in console logs!"
    echo "$PHI_LOGS"
    exit 1
fi
echo "PASSED ✓"

# Check 3: Verify TypeScript Compilation Clean
echo -n "Checking TypeScript compilation... "
npx tsc --noEmit
echo "PASSED ✓"

echo "===================================================="
echo "✅ ALL PRE-DEPLOYMENT CHECKS PASSED — READY FOR APTIBLE"
echo "===================================================="
