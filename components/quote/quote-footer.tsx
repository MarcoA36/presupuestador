'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { FileText } from 'lucide-react'

interface QuoteFooterProps {
  terms: string
  onChange: (terms: string) => void
}

export function QuoteFooter({ terms, onChange }: QuoteFooterProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5" />
          Notas y Condiciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={terms}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Agrega notas, terminos o condiciones para este presupuesto..."
          rows={4}
        />
      </CardContent>
    </Card>
  )
}
