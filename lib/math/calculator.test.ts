/**
 * Testes unitários para o calculador financeiro
 * Para executar: npm install --save-dev jest @types/jest ts-jest
 * E configurar jest.config.js
 */

import { calculateVivantFlow, validatePropertyInput, type PropertyInput } from './calculator';

describe('calculateVivantFlow', () => {
  it('deve calcular corretamente o fluxo financeiro básico', () => {
    const input: PropertyInput = {
      precoCota: 50000,
      quantidadeCotas: 100,
      custoMobilia: 500000,
    };

    const result = calculateVivantFlow(input);

    // VGV Total = 50.000 × 100 = 5.000.000
    expect(result.vgvTotal).toBe('R$ 5.000.000,00');
    
    // Imposto RET = 4% de 5.000.000 = 200.000
    expect(result.impostoRET).toBe('R$ 200.000,00');
    
    // VGV Líquido = 5.000.000 - 200.000 = 4.800.000
    expect(result.vgvLiquido).toBe('R$ 4.800.000,00');
    
    // Conta Escrow = 50% de 4.800.000 = 2.400.000
    expect(result.contaEscrow).toBe('R$ 2.400.000,00');
    
    // Operacional Vivant = 50% de 4.800.000 = 2.400.000
    expect(result.operacionalVivant).toBe('R$ 2.400.000,00');
    
    // Saldo Final = 2.400.000 - 500.000 = 1.900.000
    expect(result.saldoFinal).toBe('R$ 1.900.000,00');
    
    // Margem = (1.900.000 / 5.000.000) × 100 = 38%
    expect(result.margemOperacional).toBe('38.00%');
  });

  it('deve lidar com valores decimais precisos', () => {
    const input: PropertyInput = {
      precoCota: 33333.33,
      quantidadeCotas: 7,
      custoMobilia: 25000.50,
    };

    const result = calculateVivantFlow(input);
    
    // Verifica que não há erros de arredondamento
    expect(result.vgvTotal).toContain('233.333,31');
  });

  it('deve calcular margem negativa quando CAPEX > Operacional', () => {
    const input: PropertyInput = {
      precoCota: 10000,
      quantidadeCotas: 10,
      custoMobilia: 100000, // Maior que o operacional
    };

    const result = calculateVivantFlow(input);
    
    // Saldo final deve ser negativo
    expect(result.saldoFinal).toContain('-');
  });
});

describe('validatePropertyInput', () => {
  it('deve validar inputs corretos', () => {
    const input: PropertyInput = {
      precoCota: 50000,
      quantidadeCotas: 100,
      custoMobilia: 500000,
    };

    expect(validatePropertyInput(input)).toBe(true);
  });

  it('deve rejeitar preço de cota zero ou negativo', () => {
    const input: PropertyInput = {
      precoCota: 0,
      quantidadeCotas: 100,
      custoMobilia: 500000,
    };

    expect(validatePropertyInput(input)).toBe(false);
  });

  it('deve rejeitar quantidade de cotas zero ou negativa', () => {
    const input: PropertyInput = {
      precoCota: 50000,
      quantidadeCotas: -10,
      custoMobilia: 500000,
    };

    expect(validatePropertyInput(input)).toBe(false);
  });

  it('deve aceitar CAPEX zero', () => {
    const input: PropertyInput = {
      precoCota: 50000,
      quantidadeCotas: 100,
      custoMobilia: 0,
    };

    expect(validatePropertyInput(input)).toBe(true);
  });

  it('deve rejeitar CAPEX negativo', () => {
    const input: PropertyInput = {
      precoCota: 50000,
      quantidadeCotas: 100,
      custoMobilia: -1000,
    };

    expect(validatePropertyInput(input)).toBe(false);
  });
});
