import { validate } from "./utils";

/**
 * Adds two numbers together.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The sum of the two numbers.
 */
export function sum(a: number, b: number) {
  validate(a, b);
  return a + b;
}

/**
 * Subtracts two numbers.
 *
 * @param a - The first number.
 * @param b - The second number.
 * @returns The result of subtracting `b` from `a`.
 */
export function sub(a: number, b: number) {
  return a - b;
}

/**
 * Divides two numbers.
 *
 * @param a - The dividend.
 * @param b - The divisor.
 * @returns The quotient of the division.
 */
export const divide = (a: number, b: number) => {
  return a / b;
};

/**
 * Calculates the power of a number.
 *
 * @param a - The base number.
 * @param b - The exponent.
 * @returns The result of raising `a` to the power of `b`.
 */
export const pow = (a: number, b: number) => {
  return Math.pow(a, b);
}

/**
 * Calculates the square root of a number.
 *
 * @param a - The number to calculate the square root of.
 * @returns The square root of the input number.
 */
export const sqrt = (a: number) => {
  return Math.sqrt(a);
}

/**
 * Calculates the absolute value of a number.
 *
 * @param a - The number to calculate the absolute value of.
 * @returns The absolute value of the input number.
 */
export const abs = (a: number) => {
  return Math.abs(a);
}

/**
 * Rounds a number to the nearest integer.
 *
 * @param a - The number to round.
 * @returns The rounded integer value.
 */
export const round = (a: number) => {
  return Math.round(a);
}