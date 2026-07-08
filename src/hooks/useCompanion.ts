import {useState} from 'react';
import type {Companion} from '../types/models.types';
// Placeholder — wire to companion.service in Phase 3
export function useCompanion(companionId?: string) {
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  return {companion, isLoading};
}
