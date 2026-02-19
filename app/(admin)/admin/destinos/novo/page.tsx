import { DestinationForm } from "@/components/admin/destination-form";

export default async function NovoDestinoPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Novo Destino</h1>
        <p className="text-gray-600">Cadastre um novo destino</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <DestinationForm />
      </div>
    </div>
  );
}
