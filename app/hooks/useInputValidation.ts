import { useMemo } from 'react';

/**
 * Validates learning topic input according to length rules
 * Min: 2 characters (trimmed)
 * Max: 300 characters
 */
export function useInputValidation(value: string) {
  return useMemo(() => {
    const trimmed = value.trim();
    const isValid = trimmed.length >= 2 && trimmed.length <= 300;
    
    return {
      isValid,
      trimmedValue: trimmed,
      characterCount: value.length,
    };
  }, [value]);
}

