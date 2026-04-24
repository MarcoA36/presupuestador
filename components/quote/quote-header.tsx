"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Building2,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import type { CompanyInfo } from "@/lib/quote-types";

interface QuoteHeaderProps {
  company: CompanyInfo;
  onChange: (company: CompanyInfo) => void;
}

export function QuoteHeader({ company, onChange }: QuoteHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...company, logo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-0">
      {/* HEADER TOGGLE (siempre visible) */}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 h-auto hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          {/* LOGO MINI */}
          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
            {company.logo ? (
              <img
                src={company.logo}
                alt="logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-5 h-5 text-muted-foreground" />
            )}
          </div>

          {/* NAME */}
          <div className="flex flex-col text-left">
            <span className="font-semibold text-sm">
              {company.name || "Tu empresa"}
            </span>
            {!isExpanded && (
              <span className="text-xs text-muted-foreground">
                {company.phone || "  Datos de la empresa"}
              </span>
            )}
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>

      {/* CONTENT */}
      {isExpanded && (
        <CardContent className="pt-0 pb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* LOGO UPLOAD */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-28 h-28 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden bg-muted/30"
                onClick={() => fileInputRef.current?.click()}
              >
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt="Logo"
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

              {company.logo && (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onChange({
                        ...company,
                        logo: "",
                      })
                    }
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {!company.logo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir
                </Button>
              )}
            </div>

            {/* FIELDS */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={company.name}
                onChange={(e) => onChange({ ...company, name: e.target.value })}
                placeholder="Tu Empresa S.A."
                className="md:col-span-2 text-lg font-semibold border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />

              <Input
                value={company.phone}
                onChange={(e) =>
                  onChange({ ...company, phone: e.target.value })
                }
                placeholder="+34 600 000 000"
                className="border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />

              <Input
                type="email"
                value={company.email}
                onChange={(e) =>
                  onChange({ ...company, email: e.target.value })
                }
                placeholder="contacto@empresa.com"
                className="border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />

              <Input
                value={company.address}
                onChange={(e) =>
                  onChange({ ...company, address: e.target.value })
                }
                placeholder="Dirección"
                className="md:col-span-2 border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
