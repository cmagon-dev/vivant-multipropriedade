/**
 * Normaliza telefone brasileiro para E.164: 55 + DDD + número (somente dígitos).
 * Aceita formatos com espaços, parênteses, traços, +55, etc.
 */
export function normalizePhoneToE164BR(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
    return withCountry.length >= 12 ? withCountry : `55${digits}`;
  }
  return `55${digits}`;
}

/**
 * Gera URL para abrir WhatsApp Web/App com número e mensagem pré-preenchida.
 * Funciona em desktop e mobile (wa.me).
 */
export function buildWhatsAppUrl(phoneE164: string, message: string): string {
  const num = phoneE164.replace(/\D/g, "");
  const base = `https://wa.me/${num}`;
  if (!message || !message.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}
