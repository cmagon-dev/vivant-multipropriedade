"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { destinationCreateSchema, DestinationCreateInput } from "@/lib/validations/destination-admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SlugInput } from "@/components/admin/slug-input";
import { DestinationFeaturesInput } from "@/components/admin/destination-features-input";
import { GradientColorPicker } from "@/components/admin/gradient-color-picker";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";

interface DestinationFormProps {
  destination?: any;
}

export function DestinationForm({ destination }: DestinationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!destination;
  
  const form = useForm<DestinationCreateInput>({
    resolver: zodResolver(destinationCreateSchema),
    defaultValues: destination || {
      name: "",
      slug: "",
      state: "",
      emoji: "",
      color: "from-blue-500 to-cyan-400",
      subtitle: "",
      location: "",
      description: "",
      climate: "",
      lifestyle: "",
      features: [],
      images: [],
      appreciation: "",
      published: false,
      order: 0,
    }
  });
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, control } = form;
  
  const nameValue = watch("name");
  const slugValue = watch("slug");
  const publishedValue = watch("published");
  
  const onSubmit = async (data: DestinationCreateInput) => {
    setIsSubmitting(true);
    try {
      const url = isEditing 
        ? `/api/destinations/${destination.id}` 
        : "/api/destinations";
      const method = isEditing ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        toast.success(isEditing ? "Destino atualizado!" : "Destino criado!");
        router.push("/admin/destinos");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Erro ao salvar");
      }
    } catch (error) {
      toast.error("Erro ao salvar destino");
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
            <Label htmlFor="name">Nome do Destino *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Porto Rico"
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
              urlPrefix="/destinos/"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="state">Estado *</Label>
            <Input
              id="state"
              {...register("state")}
              placeholder="Paraná"
            />
            {errors.state && (
              <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="emoji">Emoji *</Label>
            <Input
              id="emoji"
              {...register("emoji")}
              placeholder="🚤"
              maxLength={2}
            />
            {errors.emoji && (
              <p className="text-sm text-red-600 mt-1">{errors.emoji.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="order">Ordem de Exibição na Home *</Label>
            <Input
              id="order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.order && (
              <p className="text-sm text-red-600 mt-1">{errors.order.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Define a ordem que o destino aparece na home (menor número = primeiro)
            </p>
          </div>
        </div>
        
        <div>
          <Label htmlFor="color">Gradiente Tailwind *</Label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <GradientColorPicker
                id="color"
                value={field.value}
                onChange={field.onChange}
                error={errors.color?.message as string | undefined}
              />
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="subtitle">Subtítulo *</Label>
          <Input
            id="subtitle"
            {...register("subtitle")}
            placeholder="Paraíso náutico às margens do Rio Paraná"
          />
          {errors.subtitle && (
            <p className="text-sm text-red-600 mt-1">{errors.subtitle.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="location">Localização/Distâncias *</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="120 km de Maringá | 580 km de Curitiba"
          />
          {errors.location && (
            <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
          )}
        </div>
      </div>
      
      {/* Descrições */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Descrições
        </h2>
        
        <div>
          <Label htmlFor="description">Descrição Geral *</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Conhecido como o 'Caribe Paranaense', Porto Rico oferece..."
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="climate">Clima *</Label>
          <Textarea
            id="climate"
            {...register("climate")}
            placeholder="Temperatura média de 28°C no verão. Clima perfeito para..."
            rows={3}
          />
          {errors.climate && (
            <p className="text-sm text-red-600 mt-1">{errors.climate.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="lifestyle">Estilo de Vida *</Label>
          <Textarea
            id="lifestyle"
            {...register("lifestyle")}
            placeholder="Esportes náuticos durante o dia (jet-ski, lancha, wakeboard)..."
            rows={3}
          />
          {errors.lifestyle && (
            <p className="text-sm text-red-600 mt-1">{errors.lifestyle.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="appreciation">Valorização *</Label>
          <Textarea
            id="appreciation"
            {...register("appreciation")}
            placeholder="Valorização de 42% nos últimos 3 anos. Demanda por imóveis..."
            rows={2}
          />
          {errors.appreciation && (
            <p className="text-sm text-red-600 mt-1">{errors.appreciation.message}</p>
          )}
        </div>
      </div>
      
      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Destaques do Destino (4 obrigatórios)
        </h2>
        
        <Controller
          name="features"
          control={control}
          render={({ field }) => (
            <DestinationFeaturesInput
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
        {errors.features && (
          <p className="text-sm text-red-600 mt-1">{errors.features.message as string}</p>
        )}
      </div>
      
      {/* Galeria de Imagens */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Galeria de Imagens
        </h2>
        <p className="text-sm text-gray-500">
          A primeira imagem será usada como capa do destino. Adicione até 10 imagens.
        </p>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUpload
              value={field.value ?? []}
              onChange={field.onChange}
              maxImages={10}
            />
          )}
        />
      </div>

      {/* Publicação */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Publicação
        </h2>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
          <div>
            <Label htmlFor="published">Publicar destino?</Label>
            <p className="text-sm text-gray-500">
              O destino será exibido na home e nas páginas públicas do site
            </p>
          </div>
          <Switch
            id="published"
            checked={publishedValue}
            onCheckedChange={(checked) => setValue("published", checked)}
          />
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
          {isSubmitting ? "Salvando..." : isEditing ? "Atualizar Destino" : "Criar Destino"}
        </Button>
      </div>
    </form>
  );
}
