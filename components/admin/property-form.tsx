"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyCreateSchema, PropertyCreateInput } from "@/lib/validations/property-admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/image-upload";
import { FeaturesInput } from "@/components/admin/features-input";
import { SlugInput } from "@/components/admin/slug-input";
import { RichEditor } from "@/components/admin/rich-editor";
import { toast } from "sonner";

interface PropertyFormProps {
  property?: any;
  destinations: Array<{ id: string; name: string }>;
}

export function PropertyForm({ property, destinations }: PropertyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!property;
  
  const form = useForm<PropertyCreateInput>({
    resolver: zodResolver(propertyCreateSchema),
    defaultValues: property || {
      name: "",
      slug: "",
      description: "",
      location: "",
      cidade: "",
      destinoId: "",
      condominio: "",
      type: "",
      priceValue: 0,
      bedrooms: 3,
      bathrooms: 3,
      area: 200,
      fraction: "1/8",
      price: "",
      monthlyFee: "",
      weeks: "8-10",
      images: [],
      features: [],
      appreciation: "",
      status: "DISPONIVEL",
      highlight: false,
      published: false,
    }
  });
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  
  const nameValue = watch("name");
  const slugValue = watch("slug");
  const descriptionValue = watch("description");
  const imagesValue = watch("images");
  const featuresValue = watch("features");
  const highlightValue = watch("highlight");
  const publishedValue = watch("published");
  
  const onSubmit = async (data: PropertyCreateInput) => {
    setIsSubmitting(true);
    try {
      const url = isEditing 
        ? `/api/properties/${property.id}` 
        : "/api/properties";
      const method = isEditing ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        toast.success(isEditing ? "Casa atualizada!" : "Casa criada!");
        router.push("/admin/casas");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Erro ao salvar");
      }
    } catch (error) {
      toast.error("Erro ao salvar casa");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Informações Básicas
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome da Casa *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Casa Porto Rico - Marina Premium"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <SlugInput
              nameValue={nameValue}
              value={slugValue}
              onChange={(slug) => setValue("slug", slug)}
              error={errors.slug?.message}
            />
          </div>
        </div>
        
        <div>
          <Label>Descrição Completa *</Label>
          <RichEditor
            content={descriptionValue}
            onChange={(html) => setValue("description", html)}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Localização Completa *</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Porto Rico, Paraná"
            />
            {errors.location && (
              <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="cidade">Cidade *</Label>
            <Input
              id="cidade"
              {...register("cidade")}
              placeholder="Porto Rico"
            />
            {errors.cidade && (
              <p className="text-sm text-red-600 mt-1">{errors.cidade.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="destinoId">Destino *</Label>
            <Select
              value={watch("destinoId")}
              onValueChange={(value) => setValue("destinoId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um destino" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((dest) => (
                  <SelectItem key={dest.id} value={dest.id}>
                    {dest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destinoId && (
              <p className="text-sm text-red-600 mt-1">{errors.destinoId.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="condominio">Condomínio *</Label>
            <Input
              id="condominio"
              {...register("condominio")}
              placeholder="Marina Premium"
            />
            {errors.condominio && (
              <p className="text-sm text-red-600 mt-1">{errors.condominio.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="type">Tipo de Propriedade *</Label>
          <Input
            id="type"
            {...register("type")}
            placeholder="Casa de Lazer Náutica"
          />
          {errors.type && (
            <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
          )}
        </div>
      </div>
      
      {/* Características */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Características
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bedrooms">Suítes *</Label>
            <Input
              id="bedrooms"
              type="number"
              {...register("bedrooms", { valueAsNumber: true })}
              placeholder="4"
            />
            {errors.bedrooms && (
              <p className="text-sm text-red-600 mt-1">{errors.bedrooms.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="bathrooms">Banheiros *</Label>
            <Input
              id="bathrooms"
              type="number"
              {...register("bathrooms", { valueAsNumber: true })}
              placeholder="5"
            />
            {errors.bathrooms && (
              <p className="text-sm text-red-600 mt-1">{errors.bathrooms.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="area">Área (m²) *</Label>
            <Input
              id="area"
              type="number"
              {...register("area", { valueAsNumber: true })}
              placeholder="280"
            />
            {errors.area && (
              <p className="text-sm text-red-600 mt-1">{errors.area.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label>Características da Casa</Label>
          <FeaturesInput
            value={featuresValue || []}
            onChange={(features) => setValue("features", features)}
          />
          {errors.features && (
            <p className="text-sm text-red-600 mt-1">{errors.features.message}</p>
          )}
        </div>
      </div>
      
      {/* Valores */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Valores e Condições
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="priceValue">Valor (número) *</Label>
            <Input
              id="priceValue"
              type="number"
              {...register("priceValue", { valueAsNumber: true })}
              placeholder="375000"
            />
            {errors.priceValue && (
              <p className="text-sm text-red-600 mt-1">{errors.priceValue.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="price">Preço Formatado *</Label>
            <Input
              id="price"
              {...register("price")}
              placeholder="R$ 375.000"
            />
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="monthlyFee">Taxa Mensal *</Label>
            <Input
              id="monthlyFee"
              {...register("monthlyFee")}
              placeholder="R$ 2.800"
            />
            {errors.monthlyFee && (
              <p className="text-sm text-red-600 mt-1">{errors.monthlyFee.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fraction">Fração *</Label>
            <Input
              id="fraction"
              {...register("fraction")}
              placeholder="1/8"
            />
            {errors.fraction && (
              <p className="text-sm text-red-600 mt-1">{errors.fraction.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="weeks">Semanas/Ano *</Label>
            <Input
              id="weeks"
              {...register("weeks")}
              placeholder="8-10"
            />
            {errors.weeks && (
              <p className="text-sm text-red-600 mt-1">{errors.weeks.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="appreciation">Valorização *</Label>
          <Input
            id="appreciation"
            {...register("appreciation")}
            placeholder="+42% em 3 anos"
          />
          {errors.appreciation && (
            <p className="text-sm text-red-600 mt-1">{errors.appreciation.message}</p>
          )}
        </div>
      </div>
      
      {/* Imagens */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Imagens
        </h2>
        
        <ImageUpload
          value={imagesValue || []}
          onChange={(urls) => setValue("images", urls)}
          maxImages={10}
        />
        {errors.images && (
          <p className="text-sm text-red-600 mt-1">{errors.images.message}</p>
        )}
      </div>
      
      {/* Status e Publicação */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Status e Publicação
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              value={watch("status")}
              onValueChange={(value: any) => setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                <SelectItem value="ULTIMAS_COTAS">Últimas Cotas</SelectItem>
                <SelectItem value="PRE_LANCAMENTO">Pré-lançamento</SelectItem>
                <SelectItem value="VENDIDO">Vendido</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="highlight">Destacar esta casa?</Label>
              <Switch
                id="highlight"
                checked={highlightValue}
                onCheckedChange={(checked) => setValue("highlight", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Publicar agora?</Label>
              <Switch
                id="published"
                checked={publishedValue}
                onCheckedChange={(checked) => setValue("published", checked)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Botões */}
      <div className="flex gap-3 justify-end pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-vivant-navy hover:bg-vivant-navy/90"
        >
          {isSubmitting ? "Salvando..." : isEditing ? "Atualizar Casa" : "Criar Casa"}
        </Button>
      </div>
    </form>
  );
}
