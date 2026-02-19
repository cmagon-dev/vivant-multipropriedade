"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ value, onChange, maxImages = 10 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (value.length + acceptedFiles.length > maxImages) {
      toast.error(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Upload falhou");
        }
        
        const data = await res.json();
        return data.url;
      });
      
      const urls = await Promise.all(uploadPromises);
      onChange([...value, ...urls]);
      toast.success(`${urls.length} imagem(ns) enviada(s)`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload");
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange, maxImages]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading,
  });
  
  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-4">
      {/* Grid de imagens atuais */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
              {index === 0 && (
                <Badge className="absolute bottom-2 left-2 bg-vivant-gold">
                  Principal
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Dropzone */}
      {value.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-vivant-gold bg-vivant-gold/5"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-vivant-navy animate-spin" />
              <p className="text-sm text-gray-600">Enviando imagens...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? "Solte as imagens aqui"
                  : "Arraste imagens ou clique para selecionar"}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG ou WEBP (máx 5MB cada)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
