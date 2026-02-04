"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertyInputSchema,
  type PropertyInputFormData,
} from "@/lib/validations/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyFormProps {
  onSubmit: (data: PropertyInputFormData) => void;
}

export function PropertyForm({ onSubmit }: PropertyFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropertyInputFormData>({
    resolver: zodResolver(propertyInputSchema),
    defaultValues: {
      precoCota: 50000,
      quantidadeCotas: 100,
      custoMobilia: 500000,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Propriedade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="precoCota">Preço da Cota (R$)</Label>
            <Input
              id="precoCota"
              type="number"
              step="0.01"
              placeholder="50000.00"
              {...register("precoCota", { valueAsNumber: true })}
              className={errors.precoCota ? "border-red-500" : ""}
            />
            {errors.precoCota && (
              <p className="text-sm text-red-500">{errors.precoCota.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidadeCotas">Quantidade de Cotas</Label>
            <Input
              id="quantidadeCotas"
              type="number"
              step="1"
              placeholder="100"
              {...register("quantidadeCotas", { valueAsNumber: true })}
              className={errors.quantidadeCotas ? "border-red-500" : ""}
            />
            {errors.quantidadeCotas && (
              <p className="text-sm text-red-500">
                {errors.quantidadeCotas.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="custoMobilia">
              Custo de Mobília - CAPEX (R$)
            </Label>
            <Input
              id="custoMobilia"
              type="number"
              step="0.01"
              placeholder="500000.00"
              {...register("custoMobilia", { valueAsNumber: true })}
              className={errors.custoMobilia ? "border-red-500" : ""}
            />
            {errors.custoMobilia && (
              <p className="text-sm text-red-500">
                {errors.custoMobilia.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Calculando..." : "Calcular Análise"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
