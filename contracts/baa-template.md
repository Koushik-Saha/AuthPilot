> **Legal Disclaimer**: *This template was generated for reference purposes only. Have a qualified healthcare attorney review and customize this agreement prior to execution with home health agencies.*

# BUSINESS ASSOCIATE AGREEMENT (BAA)

This Business Associate Agreement ("BAA") is entered into by and between **AuthPilot, LLC** ("Business Associate") and the Covered Entity executing this agreement ("Covered Entity"), effective as of the date of execution.

## RECITALS
WHEREAS, Covered Entity is a Covered Entity as defined under the Health Insurance Portability and Accountability Act of 1996 ("HIPAA"), the Health Information Technology for Economic and Clinical Health Act ("HITECH Act"), and related regulations (45 CFR Parts 160 and 164); and

WHEREAS, Business Associate provides prior authorization automation, clinical document extraction, and electronic fax transmission services to Covered Entity, which involves the creation, receipt, maintenance, or transmission of Protected Health Information ("PHI").

NOW, THEREFORE, the parties agree as follows:

---

## 1. DEFINITIONS
Terms used, but not otherwise defined, in this BAA shall have the same meaning as given in HIPAA, the HITECH Act, and 45 CFR Parts 160 and 164.

## 2. PERMITTED USES AND DISCLOSURES OF PHI
- **Service Provision**: Business Associate may create, receive, maintain, or disclose PHI solely to perform services required for home health prior authorization (PA) packet generation, clinical justification drafting, appeal generation, and submission transmission to healthcare payers as instructed by Covered Entity.
- **Management & Administration**: Business Associate may use PHI for its proper management and legal responsibilities, provided disclosures are required by law or subject to confidentiality agreements.

## 3. OBLIGATIONS OF BUSINESS ASSOCIATE
- **Safeguards**: Business Associate shall implement administrative, physical, and technical safeguards (including AES-256 encryption at rest and TLS 1.3 in transit) that reasonably protect the confidentiality, integrity, and availability of Electronic PHI.
- **Breach Notification**: Business Associate shall notify Covered Entity without unreasonable delay, and in no event later than **72 hours** after discovery of a confirmed Breach of Unsecured PHI or Security Incident.
- **Audit Logging**: Business Associate shall maintain an automated audit log of access to Covered Entity's PHI for a minimum of six (6) years.
- **Subcontractors**: Business Associate shall ensure that any subcontractors that create, receive, maintain, or transmit PHI execute written BAAs providing at least the same level of protection. Current sub-processors include:
  1. *Anthropic, PBC* (AI Engine — Zero retention HIPAA API)
  2. *Amazon Web Services, Inc.* (Encrypted S3 Storage)
  3. *Twilio, Inc.* (Electronic Fax Transmission)
  4. *Neon, Inc.* (Managed PostgreSQL Database)

## 4. OBLIGATIONS OF COVERED ENTITY
- Covered Entity shall obtain any necessary consent or authorization from patients before transmitting PHI to Business Associate.
- Covered Entity shall not instruct Business Associate to use or disclose PHI in any manner that would violate HIPAA if performed by Covered Entity.

## 5. TERM AND TERMINATION
- **Term**: This BAA shall remain in effect for the duration of the Master Services Agreement between Covered Entity and Business Associate.
- **Return or Destruction**: Upon termination of the Master Services Agreement, Business Associate shall securely destroy or return all PHI received or created on behalf of Covered Entity within thirty (30) days.

---

## IN WITNESS WHEREOF, the parties have executed this Business Associate Agreement as of the date signed below:

### COVERED ENTITY (Agency)
**Agency Name**: __________________________________________________  
**Authorized Signature**: ___________________________________________  
**Printed Name**: _________________________________________________  
**Title**: ________________________________________________________  
**Date**: ________________________  

### BUSINESS ASSOCIATE (AuthPilot, LLC)
**Company**: AuthPilot, LLC  
**Authorized Signature**: ___________________________________________  
**Printed Name**: Koushik Saha  
**Title**: Chief Executive Officer / Founder  
**Date**: August 31, 2026  
