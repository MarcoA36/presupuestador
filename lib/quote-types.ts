export interface QuoteItem {
  id: string
  description: string
  price: number
}

export interface SubtotalRow {
  id: string
  type: 'subtotal'
  value: number
  description?: string
}

export type QuoteRow = QuoteItem | SubtotalRow

export function isSubtotalRow(row: QuoteRow): row is SubtotalRow {
  return 'type' in row && row.type === 'subtotal'
}

export interface CompanyInfo {
  name: string
  phone: string
  email: string
  address: string
  logo: string | null
}

export interface ClientInfo {
  name: string
  notes: string
}

export interface QuoteData {
  company: CompanyInfo
  client: ClientInfo
  rows: QuoteRow[]
  terms: string
}

const STORAGE_KEY = 'quote-generator-data'

export function saveToLocalStorage(data: QuoteData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving to localStorage:', e)
  }
}

export function loadFromLocalStorage(): QuoteData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      // Migrate old data format (quantity + unitPrice) to new format (price only)
      if (data.rows) {
        data.rows = data.rows.map((row: QuoteRow | { quantity?: number; unitPrice?: number }) => {
          if ('type' in row && row.type === 'subtotal') {
            return row // SubtotalRow stays the same
          }
          // Check if it's old format with quantity and unitPrice
          if ('unitPrice' in row && 'quantity' in row) {
            const oldRow = row as { id: string; description: string; quantity: number; unitPrice: number }
            return {
              id: oldRow.id,
              description: oldRow.description,
              price: oldRow.quantity * oldRow.unitPrice,
            }
          }
          // Already in new format or has price
          if ('price' in row) {
            return row
          }
          // Fallback: create with price 0
          return { ...row, price: 0 }
        })
      }
      return data
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e)
  }
  return null
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Error clearing localStorage:', e)
  }
}
