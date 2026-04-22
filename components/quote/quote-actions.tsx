'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Printer, RotateCcw } from 'lucide-react'

interface QuoteActionsProps {
  onExport: () => void
  onReset: () => void
}

export function QuoteActions({ onExport, onReset }: QuoteActionsProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onExport} size="lg" className="gap-2">
            <Printer className="w-5 h-5" />
            Exportar / Imprimir
          </Button>
          <Button onClick={onReset} variant="outline" size="lg" className="gap-2">
            <RotateCcw className="w-5 h-5" />
            Nuevo Presupuesto
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
