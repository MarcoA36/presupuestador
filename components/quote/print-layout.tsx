'use client'

import type { CompanyInfo, ClientInfo, QuoteRow } from '@/lib/quote-types'
import { isSubtotalRow } from '@/lib/quote-types'

interface PrintLayoutProps {
  company: CompanyInfo
  client: ClientInfo
  rows: QuoteRow[]
  terms: string
}

export function PrintLayout({ company, client, rows, terms }: PrintLayoutProps) {
  const grandTotal = rows.reduce((acc, row) => {
    if (isSubtotalRow(row)) return acc
    return acc + row.price
  }, 0)

  return (
    <div className="hidden print:block p-8 bg-white text-black min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
        <div className="flex items-center gap-6">
          {company.logo && (
            <img
              src={company.logo}
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{company.name || 'Tu Empresa'}</h1>
            {company.address && <p className="text-sm mt-1">{company.address}</p>}
            {company.phone && <p className="text-sm">{company.phone}</p>}
            {company.email && <p className="text-sm">{company.email}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold tracking-wide">PRESUPUESTO</h2>
          <p className="text-sm mt-2">
            Fecha: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>

      {/* Client Info */}
      {client.name && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Cliente</p>
          <p className="text-lg font-semibold">{client.name}</p>
          {client.notes && <p className="text-sm text-gray-600 mt-1">{client.notes}</p>}
        </div>
      )}

      {/* Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-3 text-sm font-bold uppercase">Descripcion</th>
            <th className="text-right py-3 text-sm font-bold uppercase w-32">Precio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
            isSubtotalRow(row) ? (
              <tr key={row.id} className="bg-gray-100 border-b border-black">
                <td className="py-3 font-semibold text-sm">
                  Subtotal{row.description ? `: ${row.description}` : ''}
                </td>
                <td className="py-3 text-right font-bold tabular-nums">
                  ${row.value.toFixed(2)}
                </td>
              </tr>
            ) : (
              <tr key={row.id} className="border-b border-black">
                <td className="py-3 text-sm">{row.description || '-'}</td>
                <td className="py-3 text-right tabular-nums font-medium">
                  ${row.price.toFixed(2)}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Grand Total */}
      <div className="flex justify-end mb-8">
        <div className="border-t-2 border-black pt-4 w-64">
          <div className="flex justify-between text-xl font-bold">
            <span>TOTAL:</span>
            <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      {terms && (
        <div className="border-t pt-6">
          <p className="text-xs uppercase tracking-wider text-gray-600 mb-2">
            Notas y Condiciones
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{terms}</p>
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-8 left-8 right-8 text-center text-xs text-gray-500 border-t pt-4">
        <p>Presupuesto generado el {new Date().toLocaleDateString('es-ES')} - Valido por 30 dias</p>
      </div>
    </div>
  )
}
