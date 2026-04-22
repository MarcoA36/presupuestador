'use client'

import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Upload, Building2 } from 'lucide-react'
import type { CompanyInfo } from '@/lib/quote-types'

interface QuoteHeaderProps {
  company: CompanyInfo
  onChange: (company: CompanyInfo) => void
}

export function QuoteHeader({ company, onChange }: QuoteHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onChange({ ...company, logo: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-28 h-28 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden bg-muted/30"
              onClick={() => fileInputRef.current?.click()}
            >
              {company.logo ? (
                <img
                  src={company.logo}
                  alt="Logo de la empresa"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Building2 className="w-8 h-8" />
                  <span className="text-xs">Logo</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Logo
            </Button>
          </div>

          {/* Company Info */}
          <div className="flex-1">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field className="md:col-span-2">
                <FieldLabel>Nombre de la Empresa</FieldLabel>
                <Input
                  value={company.name}
                  onChange={(e) => onChange({ ...company, name: e.target.value })}
                  placeholder="Tu Empresa S.A."
                  className="text-lg font-semibold"
                />
              </Field>
              <Field>
                <FieldLabel>Telefono</FieldLabel>
                <Input
                  value={company.phone}
                  onChange={(e) => onChange({ ...company, phone: e.target.value })}
                  placeholder="+34 600 000 000"
                />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  value={company.email}
                  onChange={(e) => onChange({ ...company, email: e.target.value })}
                  placeholder="contacto@empresa.com"
                />
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel>Direccion</FieldLabel>
                <Input
                  value={company.address}
                  onChange={(e) => onChange({ ...company, address: e.target.value })}
                  placeholder="Calle Principal 123, Ciudad, 28001"
                />
              </Field>
            </FieldGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
