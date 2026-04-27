export function parsePositiveNumber(value: unknown, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${field} deve ser um número maior que zero`);
  }
  return parsed;
}

export function parseNonNegativeNumber(value: unknown, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${field} deve ser um número maior ou igual a zero`);
  }
  return parsed;
}

export function parsePercentage(value: unknown, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`${field} deve estar entre 0 e 100`);
  }
  return parsed;
}

export function parseDateInput(value: unknown, field: string): Date {
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${field} inválida`);
  }
  return parsed;
}

export function parseEnumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new Error(`${field} inválido`);
  }
  return value as T;
}

export function isValidDateInput(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const parsed = new Date(String(value));
  return !Number.isNaN(parsed.getTime());
}
