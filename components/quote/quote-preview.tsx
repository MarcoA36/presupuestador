'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye } from 'lucide-react'
import type { CompanyInfo, ClientInfo, QuoteRow } from '@/lib/quote-types'
import { isSubtotalRow } from '@/lib/quote-types'

interface QuotePreviewProps {
  company: CompanyInfo
  client: ClientInfo
  rows: QuoteRow[]
  terms: string
}

export function QuotePreview({ company, client, rows, terms }: QuotePreviewProps) {
  const grandTotal = rows.reduce((acc, row) => {
    if (isSubtotalRow(row)) return acc
    return acc + row.price
  }, 0)

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="w-5 h-5" />
          Vista Previa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-6 bg-white space-y-6 text-sm">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div className="flex items-center gap-4">
              {company.logo && (
                <img
                  src={company.logo}
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <h3 className="font-bold text-lg">{company.name || 'Tu Empresa'}</h3>
                {company.address && <p className="text-muted-foreground text-xs">{company.address}</p>}
                {company.phone && <p className="text-muted-foreground text-xs">{company.phone}</p>}
                {company.email && <p className="text-muted-foreground text-xs">{company.email}</p>}
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">PRESUPUESTO</h2>
              <p className="text-muted-foreground text-xs">
                Fecha: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          {/* Client */}
          {client.name && (
            <div className="border-b pb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Cliente</p>
              <p className="font-medium">{client.name}</p>
              {client.notes && <p className="text-muted-foreground text-xs mt-1">{client.notes}</p>}
            </div>
          )}

          {/* Items Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-semibold">Descripcion</th>
                <th className="text-right py-2 font-semibold w-24">Precio</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) =>
                isSubtotalRow(row) ? (
                  <tr key={row.id} className="bg-muted/30 border-b border-foreground">
                    <td className="py-2 font-medium">
                      Subtotal{row.description ? `: ${row.description}` : ''}
                    </td>
                    <td className="py-2 text-right font-semibold tabular-nums">
                      ${row.value.toFixed(2)}
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} className="border-b border-foreground">
                    <td className="py-2">{row.description || '-'}</td>
                    <td className="py-2 text-right tabular-nums">
                      ${row.price.toFixed(2)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end border-t pt-4">
            <div className="text-right">
              <p className="text-lg font-bold">
                Total: <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>

          {/* Terms */}
          {terms && (
            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Notas y Condiciones
              </p>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{terms}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
