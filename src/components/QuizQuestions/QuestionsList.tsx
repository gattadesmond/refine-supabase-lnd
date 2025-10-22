import React, { createContext, useContext, useMemo } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import type { DragEndEvent, DraggableAttributes } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, List, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { GetProps } from 'antd';
import type { QuizQuestion } from './types';


// ============================================================================
// SORTABLE LIST ITEM CONTEXT
// ============================================================================

interface SortableListItemContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
}

const SortableListItemContext = createContext<SortableListItemContextProps>({});

// ============================================================================
// DRAG HANDLE COMPONENT
// ============================================================================

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners, attributes } = useContext(SortableListItemContext);

  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
    />
  );
};

// ============================================================================
// SORTABLE LIST ITEM COMPONENT
// ============================================================================

const SortableListItem: React.FC<GetProps<typeof List.Item> & { itemKey: number }> = (props) => {
  const { itemKey, style, ...rest } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemKey });

  const listStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const memoizedValue = useMemo<SortableListItemContextProps>(
    () => ({ setActivatorNodeRef, listeners, attributes }),
    [setActivatorNodeRef, listeners, attributes],
  );

  return (
    <SortableListItemContext.Provider value={memoizedValue}>
      <List.Item {...rest} ref={setNodeRef} style={listStyle} />
    </SortableListItemContext.Provider>
  );
};

// ============================================================================
// INTERFACES
// ============================================================================

interface QuestionsListProps {
  questions: QuizQuestion[];
  onEdit: (question: QuizQuestion) => void;
  onDelete: (questionId: number) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

// ============================================================================
// QUESTIONS LIST COMPONENT
// ============================================================================

export const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  onEdit,
  onDelete,
  onDragEnd,
}) => {
  return (
    <div className="tw:grid tw:grid-cols-1 tw:gap-4">
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
        id="quiz-questions-drag-sorting"
      >
        <SortableContext items={questions.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <List
            dataSource={questions}
            bordered={false}
            renderItem={(question, index) => (
              <SortableListItem key={question.id} itemKey={question.id}  style={{ border: 'none', padding: '6px 0' }}>
                <div className="tw:w-full tw:p-3 tw:bg-white tw:rounded-lg tw:shadow-sm tw:border tw:border-gray-100">
                  {/* Question Header */}
                  <div className="tw:flex tw:justify-between tw:items-center tw:space-x-3 ">
                    <div className="tw:shrink-0">
                      <div className="tw:flex tw:items-center tw:space-x-3 ">
                        <DragHandle />
                      </div>
                    </div>
                    <div className="tw:flex-1 tw:text-gray-800 tw:font-medium">

                      <Tag color="processing">Câu {index + 1}</Tag>

                      {question.question || "Chưa có nội dung câu hỏi"}
                    </div>

                    {/* Action Buttons */}
                    <div className="tw:flex tw:shrink-0 tw:space-x-2 tw:ml-4">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(question)}
                      >
                        Sửa
                      </Button>
                      <Popconfirm
                        title="Xóa câu hỏi này?"
                        onConfirm={() => onDelete(question.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </SortableListItem>
            )}
            locale={{
              emptyText: (
                <div className="tw:text-center tw:py-12">
                  <div className="tw:text-gray-400 tw:text-lg tw:mb-2">
                    Chưa có câu hỏi nào
                  </div>
                  <div className="tw:text-gray-500 tw:text-sm">
                    Nhấn "Thêm câu hỏi" để bắt đầu
                  </div>
                </div>
              )
            }}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};
