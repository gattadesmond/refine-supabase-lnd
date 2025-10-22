import { createContext } from 'react';
import type { SortableListItemContextProps } from './types';

// ============================================================================
// SORTABLE LIST ITEM CONTEXT
// ============================================================================

export const SortableListItemContext = createContext<SortableListItemContextProps>({});
