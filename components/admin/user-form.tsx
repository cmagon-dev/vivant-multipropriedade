"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreateSchema, userUpdateSchema, UserCreateInput, UserUpdateInput } from "@/lib/validations/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface UserFormProps {
  user?: any;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!user;
  
  const form = useForm<UserCreateInput | UserUpdateInput>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userCreateSchema),
    defaultValues: user || {
      name: "",
      email: "",
      password: "",
      role: "EDITOR",
    }
  });
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  
  const [activeValue, setActiveValue] = useState(user?.active ?? true);
  
  const onSubmit = async (data: UserCreateInput | UserUpdateInput) => {
    setIsSubmitting(true);
    try {
      const url = isEditing 
        ? `/api/users/${user.id}` 
        : "/api/users";
      const method = isEditing ? "PUT" : "POST";
      
      // Se está editando e senha está vazia, não enviar senha
      const payload = isEditing && !('password' in data && data.password)
        ? { ...data, password: undefined, active: activeValue }
        : isEditing 
          ? { ...data, active: activeValue }
          : data;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        toast.success(isEditing ? "Usuário atualizado!" : "Usuário criado!");
        router.push("/admin/usuarios");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Erro ao salvar");
      }
    } catch (error) {
      toast.error("Erro ao salvar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Informações do Usuário
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="João Silva"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="joao@vivant.com.br"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="password">
            {isEditing ? "Nova Senha (deixe vazio para manter)" : "Senha *"}
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
          )}
          {isEditing && (
            <p className="text-xs text-gray-500 mt-1">
              Preencha apenas se desejar alterar a senha
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Permissões e Acesso
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role">Função *</Label>
            <Select
              value={watch("role")}
              onValueChange={(value: any) => setValue("role", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN - Acesso total</SelectItem>
                <SelectItem value="EDITOR">EDITOR - Criar e editar</SelectItem>
                <SelectItem value="VIEWER">VIEWER - Apenas visualizar</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
            )}
          </div>
          
          {isEditing && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <Label htmlFor="active">Usuário ativo?</Label>
                <p className="text-sm text-gray-500">
                  Desative para bloquear acesso
                </p>
              </div>
              <Switch
                id="active"
                checked={activeValue}
                onCheckedChange={(checked) => setActiveValue(checked)}
              />
            </div>
          )}
        </div>
        
        <div className="p-4 bg-blue-50 rounded border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Permissões por Função
          </h3>
          <ul className="text-sm text-blue-900 space-y-1">
            <li><strong>ADMIN:</strong> Acesso total, incluindo gestão de usuários</li>
            <li><strong>EDITOR:</strong> Criar, editar e publicar casas e destinos</li>
            <li><strong>VIEWER:</strong> Apenas visualizar, sem editar nada</li>
          </ul>
        </div>
      </div>
      
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
          {isSubmitting ? "Salvando..." : isEditing ? "Atualizar Usuário" : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
}
