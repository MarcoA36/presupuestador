'use client'

import { useState, useEffect } from 'react'
import { QuoteHeader } from '@/components/quote/quote-header'
import { ClientSection } from '@/components/quote/client-section'
import { QuoteItems } from '@/components/quote/quote-items'
import { QuoteFooter } from '@/components/quote/quote-footer'
import { QuoteActions } from '@/components/quote/quote-actions'
import { QuotePreview } from '@/components/quote/quote-preview'
import { PrintLayout } from '@/components/quote/print-layout'
import type { CompanyInfo, ClientInfo, QuoteRow } from '@/lib/quote-types'
import { saveToLocalStorage, loadFromLocalStorage, isSubtotalRow } from '@/lib/quote-types'

const initialCompany: CompanyInfo = {
  name: '',
  phone: '',
  email: '',
  address: '',
  logo: null,
}

const initialClient: ClientInfo = {
  name: '',
  notes: '',
}

const initialRows: QuoteRow[] = [
  { id: crypto.randomUUID(), description: '', price: 0 },
]

export default function QuoteGenerator() {
  const [company, setCompany] = useState<CompanyInfo>(initialCompany)
  const [client, setClient] = useState<ClientInfo>(initialClient)
  const [rows, setRows] = useState<QuoteRow[]>(initialRows)
  const [terms, setTerms] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromLocalStorage()
    if (stored) {
      setCompany(stored.company)
      setClient(stored.client)
      setRows(stored.rows.length > 0 ? stored.rows : initialRows)
      setTerms(stored.terms)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on changes
useEffect(() => {
  if (!isLoaded) return

  const timeout = setTimeout(() => {
    saveToLocalStorage({ company, client, rows, terms })
  }, 800) // podés bajar a 300 si querés más responsive

  return () => clearTimeout(timeout)
}, [company, client, rows, terms, isLoaded])

  const handleExport = () => {
    window.print()
  }

  const handleReset = () => {
    if (confirm('¿Seguro que deseas crear un nuevo presupuesto? Los datos del cliente y articulos seran borrados.')) {
      // Preserve company data, reset everything else
      setClient(initialClient)
      setRows([{ id: crypto.randomUUID(), description: '', price: 0 }])
      setTerms('')
      // Save with preserved company data
      saveToLocalStorage({ company, client: initialClient, rows: [{ id: crypto.randomUUID(), description: '', price: 0 }], terms: '' })
    }
  }

  // Count only non-subtotal items for preview visibility
  const itemCount = rows.filter((row) => !isSubtotalRow(row)).length
  const showPreview = itemCount > 1

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-muted/30 py-8 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </main>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-muted/30 py-8 px-4 print:hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Generador de Presupuestos</h1>
            <p className="text-muted-foreground">
              Crea presupuestos profesionales para tu negocio
            </p>
          </div>

          {/* Header Section */}
          <QuoteHeader company={company} onChange={setCompany} />

          {/* Client Section */}
          <ClientSection client={client} onChange={setClient} />

          {/* Quote Items */}
          <QuoteItems rows={rows} onChange={setRows} />

          {/* Footer */}
          <QuoteFooter terms={terms} onChange={setTerms} />

          {/* Live Preview */}
          {/* {showPreview && (
            <QuotePreview
              company={company}
              client={client}
              rows={rows}
              terms={terms}
            />
          )} */}

          {/* Actions */}
          <QuoteActions onExport={handleExport} onReset={handleReset} />
        </div>
      </main>

      {/* Print Layout - Only visible when printing */}
      <PrintLayout
        company={company}
        client={client}
        rows={rows}
        terms={terms}
      />
    </>
  )
}
