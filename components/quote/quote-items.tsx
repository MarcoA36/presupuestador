// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { Package, Calculator, Trash2 } from "lucide-react";
// import { ItemRow } from "./item-row";
// import type { QuoteRow, QuoteItem } from "@/lib/quote-types";
// import { isSubtotalRow } from "@/lib/quote-types";

// interface QuoteItemsProps {
//   rows: QuoteRow[];
//   onChange: (rows: QuoteRow[]) => void;
// }

// export function QuoteItems({ rows, onChange }: QuoteItemsProps) {
//   // 🧠 BASE: una sola función para todo
//   const sumUntilLastSubtotal = (rows: QuoteRow[], endIndex: number) => {
//     let sum = 0;
//     for (let i = endIndex; i >= 0; i--) {
//       const r = rows[i];
//       if (isSubtotalRow(r)) break;
//       sum += r.price;
//     }
//     return sum;
//   };

//   const grandTotal = rows.reduce((acc, row) => {
//     if (isSubtotalRow(row)) return acc;
//     return acc + row.price;
//   }, 0);

//   const getItemsSinceLastSubtotal = (rows: QuoteRow[]) => {
//     const items: QuoteItem[] = [];

//     for (let i = rows.length - 1; i >= 0; i--) {
//       const row = rows[i];

//       if (isSubtotalRow(row)) break;

//       items.unshift(row as QuoteItem);
//     }

//     return items;
//   };

//   const items = getItemsSinceLastSubtotal(rows);

//   const runningTotal = items.reduce((acc, item) => acc + item.price, 0);

//   // 👉 mostrar subtotal solo si hay items reales antes del último
//   const showSubtotalSection =
//     rows.length > 0 && !isSubtotalRow(rows[rows.length - 1]);

//   const addItem = () => {
//     onChange([...rows, { id: crypto.randomUUID(), description: "", price: 0 }]);
//   };

//   const addSubtotal = () => {
//     const items = getItemsSinceLastSubtotal(rows);

//     const sum = items.reduce((acc, item) => acc + item.price, 0);

//     onChange([
//       ...rows,
//       {
//         id: crypto.randomUUID(),
//         type: "subtotal",
//         value: sum,
//         description: "",
//       },
//     ]);
//   };

//   const updateRow = (index: number, row: QuoteRow) => {
//     const newRows = [...rows];
//     newRows[index] = row;
//     onChange(recalculateSubtotals(newRows));
//   };

//   const updateSubtotalDescription = (index: number, description: string) => {
//     const newRows = [...rows];
//     const row = newRows[index];
//     if (isSubtotalRow(row)) {
//       newRows[index] = { ...row, description };
//       onChange(newRows);
//     }
//   };

//   const removeRow = (index: number) => {
//     const newRows = rows.filter((_, i) => i !== index);
//     onChange(recalculateSubtotals(newRows));
//   };

//   const recalculateSubtotals = (rowsToCalc: QuoteRow[]): QuoteRow[] => {
//     return rowsToCalc.map((row, index) => {
//       if (isSubtotalRow(row)) {
//         return {
//           ...row,
//           value: sumUntilLastSubtotal(rowsToCalc, index - 1),
//         };
//       }
//       return row;
//     });
//   };

//   const lastItemIndex = rows.reduce((lastIdx, row, idx) => {
//     if (!isSubtotalRow(row)) return idx;
//     return lastIdx;
//   }, -1);

//   const subtotalSectionIndex = rows.length - 1;

//   const canAddSubtotal = () => {
//     const items = getItemsSinceLastSubtotal(rows);
//     return items.length > 0;
//   };

//   return (
//     <Card>
//       <CardHeader className="pb-4">
//         <CardTitle className="flex items-center gap-2s">
//           Articulos del Presupuesto
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {/* Header */}
//         {/* <div className="hidden sm:grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-1">
//           <div className="col-span-9 font-bold">Descripcion</div>
//           <div className="col-span-2 text-right">Precio ($)</div>
//           <div className="col-span-1"></div>
//         </div> */}

//         {/* <Separator /> */}

//         {/* Rows */}
//         <div className="space-y-3">
//           {rows.map((row, index) => {
//             const showSubtotalAfter =
//               showSubtotalSection && index === subtotalSectionIndex - 1;

//             return (
//               <div key={row.id}>
//                 {isSubtotalRow(row) ? (
//                   <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-amber-100 rounded-md py-3 px-2">
//                     <div className="flex items-center gap-2 flex-1">
//                       {/* <Calculator className="w-4 h-4 shrink-0" /> */}
//                       <span className="font-medium text-sm whitespace-nowrap">
//                         Subtotal:
//                       </span>

//                       <Input
//                         value={row.description || ""}
//                         onChange={(e) =>
//                           updateSubtotalDescription(index, e.target.value)
//                         }
//                         placeholder="Descripción (opcional)"
//                         className="h-8 text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 flex-1"
//                       />
//                     </div>

//                     <div className="flex items-center justify-between sm:justify-end gap-2">
//                       <span className="font-semibold tabular-nums text-base">
//                         ${row.value.toFixed(2)}
//                       </span>

//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => removeRow(index)}
//                         className="text-muted-foreground hover:text-destructive shrink-0"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <ItemRow
//                     item={row as QuoteItem}
//                     onChange={(updated) => updateRow(index, updated)}
//                     onRemove={() => removeRow(index)}
//                     // isNewItem={index === lastItemIndex}
//                     // onAddItem={addItem}
//                   />
//                 )}
//               </div>
//             );
//           })}

//           {/* 🔥 Acciones */}
//           <div className="flex flex-col sm:flex-row gap-2 pt-2">
//             <Button
//               variant="default"
//               onClick={addItem}
//               // disabled={isEditingItem}
//               className="w-full sm:w-auto"
//             >
//               + Agregar
//             </Button>

//             {showSubtotalSection && (
//               <Button
//                 variant="outline"
//                 onClick={addSubtotal}
//                 disabled={!canAddSubtotal()}
//                 className="w-full sm:w-auto"
//               >
//                 <Calculator className="w-4 h-4 mr-2" />
//                 Agregar subtotal
//               </Button>
//             )}
//           </div>
//         </div>

//         <Separator />

//         <div className="flex justify-end mt-10">
//           <div className="w-full max-w-sm space-y-4">
//             {/* 🔹 Subtotal */}
//             {showSubtotalSection && (
//               <div className="rounded-lg border bg-amber-100 p-4 space-y-3">
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-medium tabular-nums">
//                     ${runningTotal.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* 🔹 Total final */}
//             <div className="rounded-lg border p-4 bg-green-100 shadow-sm">
//               <div className="flex justify-between items-center text-lg font-semibold">
//                 <span>Total</span>
//                 <span className="tabular-nums text-xl">
//                   ${grandTotal.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


'use client'

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Calculator } from "lucide-react"
import { ItemRow } from "./item-row"
import type { QuoteRow, QuoteItem } from "@/lib/quote-types"
import { isSubtotalRow } from "@/lib/quote-types"

interface QuoteItemsProps {
  rows: QuoteRow[]
  onChange: (rows: QuoteRow[]) => void
}

export function QuoteItems({ rows, onChange }: QuoteItemsProps) {

  // 🔥 SOLO calcular cuando cambia rows
  const items = useMemo(() => {
    const result: QuoteItem[] = []

    for (let i = rows.length - 1; i >= 0; i--) {
      if (isSubtotalRow(rows[i])) break
      result.unshift(rows[i] as QuoteItem)
    }

    return result
  }, [rows])

  const grandTotal = useMemo(() => {
    return rows.reduce((acc, row) => {
      if (isSubtotalRow(row)) return acc
      return acc + row.price
    }, 0)
  }, [rows])

  const runningTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price, 0)
  }, [items])

  const addItem = () => {
    onChange([
      ...rows,
      { id: crypto.randomUUID(), description: "", price: 0 }
    ])
  }

  const addSubtotal = () => {
    onChange([
      ...rows,
      {
        id: crypto.randomUUID(),
        type: "subtotal",
        value: runningTotal,
        description: ""
      }
    ])
  }

  const updateRow = (index: number, row: QuoteRow) => {
    const newRows = [...rows]
    newRows[index] = row
    onChange(newRows) // 👈 sin recalcular todo acá
  }

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Articulos del Presupuesto</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={row.id}>
              {isSubtotalRow(row) ? (
                <div className="flex items-center justify-between bg-amber-100 p-3 rounded">
                  <span className="text-sm font-medium">
                    Subtotal: ${row.value.toFixed(2)}
                  </span>

                  <Button
                    variant="ghost"
                    onClick={() => removeRow(index)}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <ItemRow
                  item={row as QuoteItem}
                  onChange={(updated) => updateRow(index, updated)}
                  onRemove={() => removeRow(index)}
                />
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={addItem}>+ Agregar</Button>

            <Button
              variant="outline"
              onClick={addSubtotal}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Subtotal
            </Button>
          </div>
        </div>

        <Separator />

        {/* Totales */}
        <div className="flex justify-end">
          <div className="w-full max-w-sm space-y-2">

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${runningTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

          </div>
        </div>

      </CardContent>
    </Card>
  )
}