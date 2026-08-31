import { PayerId } from '@/types'
import { PayerConfig, FormField, DenialCode } from '@/types/payer'
import { starPlusConfig } from './star-plus'
import { uhcTexasConfig } from './uhc-texas'
import { molinaTexasConfig } from './molina-texas'
import { aetnaTexasConfig } from './aetna-texas'
import { humanaTexasConfig } from './humana-texas'

export const PAYER_REGISTRY: Record<PayerId, PayerConfig> = {
  'star-plus': starPlusConfig,
  'uhc-texas': uhcTexasConfig,
  'molina-texas': molinaTexasConfig,
  'aetna-texas': aetnaTexasConfig,
  'humana-texas': humanaTexasConfig,
}

/**
 * Retrieve payer configuration by PayerId.
 * Throws an Error if the payer ID is invalid or not registered.
 */
export function getPayerById(id: PayerId): PayerConfig {
  const payer = PAYER_REGISTRY[id]
  if (!payer) {
    throw new Error(`Payer configuration not found for payer ID: "${id}"`)
  }
  return payer
}

/**
 * Get all payers matching a specific US state code (e.g. 'TX').
 */
export function getPayersByState(state: string): PayerConfig[] {
  const targetState = state.toUpperCase()
  return Object.values(PAYER_REGISTRY).filter((p) => p.state.toUpperCase() === targetState)
}

/**
 * Get the list of required form fields for a given payer.
 */
export function getRequiredFields(payerId: PayerId): FormField[] {
  const payer = getPayerById(payerId)
  return payer.required_form_fields.filter((f) => f.required)
}

/**
 * Retrieve appeal strategy and metadata for a specific payer denial code.
 * Returns null gracefully if the denial code is not recognized.
 */
export function getDenialStrategy(payerId: PayerId, denialCode: string): DenialCode | null {
  const payer = PAYER_REGISTRY[payerId]
  if (!payer) return null

  const denial = payer.denial_codes[denialCode]
  return denial || null
}
