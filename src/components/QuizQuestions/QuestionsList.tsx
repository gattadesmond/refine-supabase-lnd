import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { Button, List, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SortableListItem } from './SortableListItem';
import { DragHandle } from './DragHandle';
import type { QuizQuestion } from './types';

const { Title, Text } = Typography;

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
    <div className="tw:bg-white tw:rounded-lg tw:shadow-sm tw:overflow-hidden">
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
        id="quiz-questions-drag-sorting"
      >
        <SortableContext items={questions.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <List
            dataSource={questions}
            renderItem={(question, index) => (
              <SortableListItem key={question.id} itemKey={question.id} className="tw:border-b tw:border-gray-100 tw:last:border-b-0">
                <div className="tw:w-full tw:py-4">
                  {/* Question Header */}
                  <div className="tw:flex tw:justify-between tw:items-start tw:mb-3">
                    <div className="tw:flex-1">
                      <div className="tw:flex tw:items-center tw:space-x-3 tw:mb-2">
                        <DragHandle />
                        <div className="tw:bg-blue-100 tw:text-blue-800 tw:px-2 tw:py-1 tw:rounded tw:text-sm tw:font-medium">
                          Câu {index + 1}
                        </div>
                        {question.correct_answer && (
                          <div className="tw:bg-green-100 tw:text-green-800 tw:px-2 tw:py-1 tw:rounded tw:text-sm">
                            Đáp án: {question.correct_answer}
                          </div>
                        )}
                      </div>

                      <Title level={5} className="tw:mb-2 tw:text-gray-800">
                        {question.question || "Chưa có nội dung câu hỏi"}
                      </Title>

                      {question.reason && (
                        <Text type="secondary" className="tw:text-sm">
                          <strong>Giải thích:</strong> {question.reason}
                        </Text>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="tw:flex tw:space-x-2 tw:ml-4">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(question)}
                        className="tw:text-blue-600 hover:tw:bg-blue-50"
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
                          danger
                          icon={<DeleteOutlined />}
                          className="hover:tw:bg-red-50"
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
