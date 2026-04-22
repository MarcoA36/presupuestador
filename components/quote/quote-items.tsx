'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Package, Calculator, Trash2 } from 'lucide-react'
import { ItemRow } from './item-row'
import type { QuoteRow, QuoteItem, SubtotalRow } from '@/lib/quote-types'
import { isSubtotalRow } from '@/lib/quote-types'

interface QuoteItemsProps {
  rows: QuoteRow[]
  onChange: (rows: QuoteRow[]) => void
}

export function QuoteItems({ rows, onChange }: QuoteItemsProps) {
  const grandTotal = rows.reduce((acc, row) => {
    if (isSubtotalRow(row)) return acc
    return acc + row.price
  }, 0)

  // Calculate running total since last subtotal (excluding the last new item)
  const calculateRunningTotal = (): number => {
    let sum = 0
    // Start from second-to-last (the last added item), go backwards until a subtotal
    for (let i = rows.length - 2; i >= 0; i--) {
      const row = rows[i]
      if (isSubtotalRow(row)) break
      sum += row.price
    }
    return sum
  }

  // Check if there are items after the last subtotal (excluding the new item being edited)
  const hasItemsAfterLastSubtotal = (): boolean => {
    // Find items between last subtotal and the last item (new item)
    for (let i = rows.length - 2; i >= 0; i--) {
      const row = rows[i]
      if (isSubtotalRow(row)) return false
      return true // Found at least one item
    }
    return false
  }

  const runningTotal = calculateRunningTotal()
  const showSubtotalSection = hasItemsAfterLastSubtotal()

  const addItem = () => {
    onChange([
      ...rows,
      { id: crypto.randomUUID(), description: '', price: 0 },
    ])
  }

  const addSubtotal = () => {
    // Insert subtotal BEFORE the last item (the new item being edited)
    const lastIndex = rows.length - 1
    const lastItem = rows[lastIndex]
    
    // Insert subtotal before the last item
    const newRows = [
      ...rows.slice(0, lastIndex),
      { id: crypto.randomUUID(), type: 'subtotal' as const, value: runningTotal, description: '' },
      lastItem,
    ]
    onChange(newRows)
  }

  const updateRow = (index: number, row: QuoteRow) => {
    const newRows = [...rows]
    newRows[index] = row
    onChange(recalculateSubtotals(newRows))
  }

  const updateSubtotalDescription = (index: number, description: string) => {
    const newRows = [...rows]
    const row = newRows[index]
    if (isSubtotalRow(row)) {
      newRows[index] = { ...row, description }
      onChange(newRows)
    }
  }

  const removeRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index)
    onChange(recalculateSubtotals(newRows))
  }

  const recalculateSubtotals = (rowsToCalc: QuoteRow[]): QuoteRow[] => {
    return rowsToCalc.map((row, index) => {
      if (isSubtotalRow(row)) {
        let sum = 0
        for (let i = index - 1; i >= 0; i--) {
          const r = rowsToCalc[i]
          if (isSubtotalRow(r)) break
          sum += r.price
        }
        return { ...row, value: sum }
      }
      return row
    })
  }

  // Find the last item row index (not subtotal) - this is the "new item" being edited
  const lastItemIndex = rows.reduce((lastIdx, row, idx) => {
    if (!isSubtotalRow(row)) return idx
    return lastIdx
  }, -1)

  // Find the index right after the last added item (where subtotal section should appear)
  // This is the index just before the last item (the new one)
  const subtotalSectionIndex = rows.length - 1

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5" />
          Articulos del Presupuesto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Header - hidden on mobile */}
        <div className="hidden sm:grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-1">
          <div className="col-span-9">Descripcion</div>
          <div className="col-span-2 text-right">Precio ($)</div>
          <div className="col-span-1"></div>
        </div>

        <Separator />

        {/* Rows */}
        <div className="space-y-3">
          {rows.map((row, index) => {
            // Check if we should show the subtotal section after this row
            const showSubtotalAfter = showSubtotalSection && index === subtotalSectionIndex - 1

            return (
              <div key={row.id}>
                {isSubtotalRow(row) ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-muted/50 rounded-md p-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Calculator className="w-4 h-4 shrink-0" />
                      <span className="font-medium text-sm whitespace-nowrap">Subtotal:</span>
                      <Input
                        value={row.description || ''}
                        onChange={(e) => updateSubtotalDescription(index, e.target.value)}
                        placeholder="(opcional)"
                        className="h-8 text-sm bg-transparent border-dashed flex-1"
                      />
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <span className="font-semibold tabular-nums text-base">
                        ${row.value.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(index)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ItemRow
                    item={row as QuoteItem}
                    onChange={(updated) => updateRow(index, updated)}
                    onRemove={() => removeRow(index)}
                    isNewItem={index === lastItemIndex}
                    onAddItem={addItem}
                  />
                )}

                {/* Running Total + Add Subtotal - appears after last added item */}
                {showSubtotalAfter && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 py-3 px-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Total parcial:</span>
                      <span className="font-semibold tabular-nums">${runningTotal.toFixed(2)}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={addSubtotal} className="w-full sm:w-auto">
                      <Calculator className="w-4 h-4 mr-2" />
                      Agregar subtotal
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        {/* Grand Total */}
        <div className="flex justify-end">
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
