import { z } from 'zod';

/**
 * Validation schemas for user inputs
 */

// Color validation - hex color format
export const colorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format');

// Range validation factory
export const rangeSchema = (min: number, max: number, fieldName = 'Value') =>
  z.number()
    .min(min, `${fieldName} must be at least ${min}`)
    .max(max, `${fieldName} must be at most ${max}`);

// Slider value validation
export const sliderValueSchema = z.object({
  value: z.number(),
  min: z.number(),
  max: z.number(),
  step: z.number().optional(),
}).refine(
  (data) => data.value >= data.min && data.value <= data.max,
  { message: 'Value is outside the valid range' }
);

// Safe number clamping
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Validate and clamp number
export function validateNumber(value: number, min: number, max: number): number {
  if (isNaN(value) || !isFinite(value)) {
    return min;
  }
  return clamp(value, min, max);
}

// Validate color string
export function validateColor(color: string): string {
  const result = colorSchema.safeParse(color);
  if (!result.success) {
    return '#000000'; // Default fallback
  }
  return result.data;
}

// Validate string length
export const stringLengthSchema = (min: number, max: number) =>
  z.string()
    .min(min, `Must be at least ${min} characters`)
    .max(max, `Must be at most ${max} characters`);

// Label validation
export const labelSchema = stringLengthSchema(1, 50);

// ID validation
export const idSchema = z.string().uuid();
