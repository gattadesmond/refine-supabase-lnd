import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// ============================================================================
// INTERFACES
// ============================================================================

interface QuestionsHeaderProps {
  questionsCount: number;
  onAddQuestion: () => void;
}

// ============================================================================
// QUESTIONS HEADER COMPONENT
// ============================================================================

export const QuestionsHeader: React.FC<QuestionsHeaderProps> = ({
  questionsCount,
  onAddQuestion,
}) => {
  return (
    <div className="tw:flex tw:justify-between tw:items-center">
      <div className="tw:flex tw:items-center tw:space-x-3">
        <div className="tw:text-lg tw:font-medium">
          Quản lý câu hỏi
        </div>
        {questionsCount > 0 && (
          <Tag color="blue">
            {questionsCount} câu hỏi
          </Tag>
        )}
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddQuestion}
        className="tw:bg-blue-600 tw:border-blue-600 hover:tw:bg-blue-700"
      >
        Thêm câu hỏi
      </Button>
    </div>
  );
};
