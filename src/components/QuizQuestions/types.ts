// ============================================================================
// DRAG & DROP INTERFACES
// ============================================================================

import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

export interface SortableListItemContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
}

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

export interface QuizQuestionsProps {
  quizId: number;
}

export interface QuestionModalProps {
  visible: boolean;
  question: QuizQuestion | null;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
  onDelete?: (questionId: number) => void;
}

export interface DragHandleProps {}

export interface SortableListItemProps extends React.ComponentProps<typeof import('antd').List.Item> {
  itemKey: number;
}

// Import and re-export QuizQuestion type
import type { QuizQuestion as BaseQuizQuestion } from '../../types/quiz';
export type QuizQuestion = BaseQuizQuestion;
