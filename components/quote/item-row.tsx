'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import type { QuoteItem } from '@/lib/quote-types'

interface ItemRowProps {
  item: QuoteItem
  onChange: (item: QuoteItem) => void
  onRemove: () => void
  isNewItem?: boolean // true for the last item being edited, shows add button instead of delete
  onAddItem?: () => void
}

export function ItemRow({ item, onChange, onRemove, isNewItem, onAddItem }: ItemRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      {/* Description - full width on mobile */}
      <div className="flex-1">
        <Input
          value={item.description}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          placeholder="Descripcion del articulo"
        />
      </div>
      {/* Price and action button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:flex-none sm:w-28">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={item.price || ''}
            onChange={(e) => onChange({ ...item, price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            className="text-right pl-7"
          />
        </div>
        <div className="shrink-0">
          {isNewItem ? (
            <Button
              variant="outline"
              size="icon"
              onClick={onAddItem}
              className="text-primary hover:text-primary"
              title="Agregar item"
            >
              <Plus className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
