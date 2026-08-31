import {
  PAYER_REGISTRY,
  getPayerById,
  getPayersByState,
  getRequiredFields,
  getDenialStrategy,
} from '../payer-registry'
import { PayerId } from '@/types'

describe('Payer Registry & Knowledge Base', () => {
  test('Every payer has at least one submission method', () => {
    Object.values(PAYER_REGISTRY).forEach((payer) => {
      expect(payer.submission_methods).toBeDefined()
      expect(payer.submission_methods.length).toBeGreaterThan(0)
    })
  })

  test('Every required form field has an extraction_hint', () => {
    Object.values(PAYER_REGISTRY).forEach((payer) => {
      payer.required_form_fields.forEach((field) => {
        expect(field.extraction_hint).toBeDefined()
        expect(field.extraction_hint.trim().length).toBeGreaterThan(0)
      })
    })
  })

  test('No payer is missing primary fax number', () => {
    Object.values(PAYER_REGISTRY).forEach((payer) => {
      expect(payer.fax_numbers).toBeDefined()
      expect(payer.fax_numbers.primary).toBeDefined()
      expect(payer.fax_numbers.primary.length).toBeGreaterThan(5)
    })
  })

  test('getPayerById throws error for invalid payer IDs', () => {
    expect(() => getPayerById('invalid-payer' as PayerId)).toThrow(
      'Payer configuration not found for payer ID: "invalid-payer"'
    )
  })

  test('getDenialStrategy returns null gracefully for unknown denial codes', () => {
    const strategy = getDenialStrategy('star-plus', 'UNKNOWN_999')
    expect(strategy).toBeNull()
  })

  test('getDenialStrategy returns DenialCode object for valid denial codes', () => {
    const strategy = getDenialStrategy('star-plus', 'A001')
    expect(strategy).not.toBeNull()
    expect(strategy?.code).toBe('A001')
    expect(strategy?.reason).toBe('Not medically necessary')
    expect(strategy?.typical_overturn_rate).toBeGreaterThan(0)
  })

  test('getPayersByState returns Texas payers', () => {
    const txPayers = getPayersByState('TX')
    expect(txPayers.length).toBeGreaterThanOrEqual(4)
  })

  test('getRequiredFields filters non-required fields', () => {
    const requiredFields = getRequiredFields('star-plus')
    requiredFields.forEach((field) => {
      expect(field.required).toBe(true)
    })
  })
})
