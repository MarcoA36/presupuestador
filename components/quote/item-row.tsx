'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import type { QuoteItem } from '@/lib/quote-types'

interface ItemRowProps {
  item: QuoteItem
  onChange: (item: QuoteItem) => void
  onRemove: () => void
}

export function ItemRow({ item, onChange, onRemove }: ItemRowProps) {
  const [isFocused, setIsFocused] = useState(false)

  // Formateador compacto
  const compactFormatter = new Intl.NumberFormat('es-AR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })

  // Condición de formateo
  const shouldFormat =
    !isFocused &&
    typeof item.price === 'number' &&
    item.price >= 100_000

  // Valor mostrado
  const displayValue = isFocused
    ? item.price || ''
    : shouldFormat
    ? compactFormatter.format(item.price)
    : item.price || ''

  return (
    <div className="flex items-center gap-2">

      {/* Descripción */}
      <div className="flex-1 min-w-0">
        {/* <Input
          value={item.description}
          onChange={(e) =>
            onChange({ ...item, description: e.target.value })
          }
          placeholder="Descripcion"
          className="border-0 shadow-none focus-visible:ring-0 px-0 truncate"
        /> */}
        <Input
  value={item.description}
  title={item.description}
  onChange={(e) =>
    onChange({ ...item, description: e.target.value })
  }
  placeholder="Descripcion"
  className="border-0 shadow-none focus-visible:ring-0 px-0 truncate"
/>
      </div>

      {/* Precio */}
      <div className="relative w-20 sm:w-24 shrink-0">
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>

        <Input
          type="text"
          inputMode="decimal"
          value={displayValue}
            title={item.price ? item.price.toString() : ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, '')
            onChange({
              ...item,
              price: parseFloat(raw) || 0,
            })
          }}
          placeholder="0.00"
          className="text-right pl-4 pr-1 border-0 shadow-none focus-visible:ring-0"
        />
      </div>

      {/* Eliminar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}