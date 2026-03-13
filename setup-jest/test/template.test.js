import { describe, expect, it } from '@jest/globals';

const sum = (a, b) => a + b;

describe('Sum function', () => {
  it('should sum two numbers', () => {
    const firstNumber = 1;
    const secondNumber = 2;
    const expectedResult = 3;

    debugger; // <-- Debug pausa aqui, veja as variáveis no painel VARIABLES

    const result = sum(firstNumber, secondNumber);

    debugger; // <-- Pausa aqui novamente, agora veja 'result' também

    expect(result).toBe(expectedResult);
  });
});
