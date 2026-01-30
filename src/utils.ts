/**
 * Validates two numbers.
 * @param a - The first number to validate.
 * @param b - The second number to validate.
 * @throws {Error} If either `a` or `b` is not a number.
 */
export const validate = (a: number, b: number) => {
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Invalid input');
  }
}