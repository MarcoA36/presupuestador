'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { User, ChevronDown, ChevronUp } from 'lucide-react'
import type { ClientInfo } from '@/lib/quote-types'

interface ClientSectionProps {
  client: ClientInfo
  onChange: (client: ClientInfo) => void
}

export function ClientSection({ client, onChange }: ClientSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 h-auto hover:bg-muted/50"
      >
        <div className="flex items-center gap-2 text-lg font-semibold">
          <User className="w-5 h-5" />
          Datos del cliente
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>
      {isExpanded && (
        <CardContent className="pt-0 pb-6">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Nombre del Cliente</FieldLabel>
              <Input
                value={client.name}
                onChange={(e) => onChange({ ...client, name: e.target.value })}
                placeholder="Nombre del cliente o empresa"
              />
            </Field>
            <Field>
              <FieldLabel>Notas (Opcional)</FieldLabel>
              <Textarea
                value={client.notes}
                onChange={(e) => onChange({ ...client, notes: e.target.value })}
                placeholder="Notas adicionales sobre el cliente o proyecto..."
                rows={3}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      )}
    </Card>
  )
}
