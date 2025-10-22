import { useState, useEffect } from "react";
import { useList, useCreate, useUpdate, useDelete } from "@refinedev/core";
import { 
  Button, 
  Typography, 
  Row,
  Col,
  Popconfirm,
  Input,
  Form,
  Modal,
  List
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { QuizQuestion } from "../../types/quiz";

const { Title, Text } = Typography;

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface QuizQuestionsProps {
  quizId: number;
}

interface QuestionModalProps {
  visible: boolean;
  question: QuizQuestion | null;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
  onDelete?: (questionId: number) => void;
}

// ============================================================================
// MAIN COMPONENT: QuizQuestions
// ============================================================================

export const QuizQuestions = ({ quizId }: QuizQuestionsProps) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // ============================================================================
  // REFINE HOOKS
  // ============================================================================
  
  const { mutate: createQuestion } = useCreate();
  const { mutate: updateQuestion } = useUpdate();
  const { mutate: deleteQuestion } = useDelete();

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  
  const questionsQuery = useList<QuizQuestion>({
    resource: "quiz_questions",
    filters: [
      {
        field: "quiz_id",
        operator: "eq",
        value: quizId,
      },
    ],
    sorters: [
      {
        field: "order_index",
        order: "asc",
      },
    ],
    queryOptions: {
      enabled: !!quizId,
    },
  });

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  // Load questions when data changes
  useEffect(() => {
    if (questionsQuery.result?.data) {
      setQuestions(questionsQuery.result.data);
    }
  }, [questionsQuery.result?.data]);

  // ============================================================================
  // MODAL FUNCTIONS
  // ============================================================================
  
  const openModal = (question?: QuizQuestion) => {
    if (question) {
      setEditingQuestion(question);
    } else {
      const newQuestion: QuizQuestion = {
        id: Date.now(),
        quiz_id: quizId,
        question: "",
        correct_answer: "",
        reason: "",
        order_index: questions.length + 1,
      };
      setEditingQuestion(newQuestion);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingQuestion(null);
  };

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================
  
  const saveQuestion = (question: QuizQuestion) => {
    const { id, ...questionData } = question;
    
    try {
      if (questions.find(q => q.id === question.id)) {
        // Update existing question
        updateQuestion({
          resource: "quiz_questions",
          id: id,
          values: questionData,
        });
        
        // Update local state
        setQuestions(questions.map(q => 
          q.id === question.id ? question : q
        ));
      } else {
        // Create new question
        createQuestion({
          resource: "quiz_questions",
          values: questionData,
        });
        
        // Add to local state with temporary ID
        setQuestions([...questions, question]);
        
      }
      
      closeModal();
    } catch (error) {
      // Refine sẽ tự động hiển thị error notification
    }
  };

  const removeQuestion = (questionId: number) => {
    try {
      // Always try to delete from database
      deleteQuestion({
        resource: "quiz_questions",
        id: questionId,
      });
      
      // Remove from local state
      setQuestions(questions.filter(q => q.id !== questionId));
      
    } catch (error) {
      // Refine sẽ tự động hiển thị error notification
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="tw:space-y-6">
      {/* ========================================================================
          HEADER SECTION
      ========================================================================== */}
      <div className="tw:flex tw:justify-between tw:items-center tw:bg-white tw:rounded-lg tw:shadow-sm tw:p-4">
        <div className="tw:flex tw:items-center tw:space-x-3">
          <Title level={4} className="tw:mb-0 tw:text-gray-800">
            Quản lý câu hỏi
          </Title>
          <div className="tw:bg-blue-100 tw:text-blue-800 tw:px-3 tw:py-1 tw:rounded-full tw:text-sm tw:font-medium">
            {questions.length} câu hỏi
          </div>
        </div>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => openModal()}
          className="tw:bg-blue-600 tw:border-blue-600 hover:tw:bg-blue-700"
        >
          Thêm câu hỏi
        </Button>
      </div>

      {/* ========================================================================
          QUESTIONS LIST
      ========================================================================== */}
      <div className="tw:bg-white tw:rounded-lg tw:shadow-sm tw:overflow-hidden">
        <List
          dataSource={questions}
          renderItem={(question, index) => (
            <List.Item className="tw:border-b tw:border-gray-100 tw:last:border-b-0">
              <div className="tw:w-full tw:py-4">
                {/* Question Header */}
                <div className="tw:flex tw:justify-between tw:items-start tw:mb-3">
                  <div className="tw:flex-1">
                    <div className="tw:flex tw:items-center tw:space-x-3 tw:mb-2">
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
                      onClick={() => openModal(question)}
                      className="tw:text-blue-600 hover:tw:bg-blue-50"
                    >
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Xóa câu hỏi này?"
                      onConfirm={() => removeQuestion(question.id)}
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
            </List.Item>
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
      </div>

      {/* ========================================================================
          QUESTION MODAL
      ========================================================================== */}
      <QuestionModal
        visible={modalVisible}
        question={editingQuestion}
        onSave={saveQuestion}
        onCancel={closeModal}
        onDelete={removeQuestion}
      />
    </div>
  );
};

// ============================================================================
// QUESTION MODAL COMPONENT
// ============================================================================

const QuestionModal = ({ visible, question, onSave, onCancel, onDelete }: QuestionModalProps) => {
  // ============================================================================
  // STATE & FORM
  // ============================================================================
  
  const [form] = Form.useForm();

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  useEffect(() => {
    if (question) {
      form.setFieldsValue(question);
    } else {
      form.resetFields();
    }
  }, [question, form]);


  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleSave = () => {
    form.validateFields()
      .then((values) => {
        const updatedQuestion: QuizQuestion = {
          ...question!,
          ...values,
        };
        onSave(updatedQuestion);
      })
      .catch(() => {
        // Form validation sẽ hiển thị error messages tự động
      });
  };

  const handleDelete = () => {
    if (question && onDelete) {
      onDelete(question.id);
      onCancel();
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <Modal
      title={
        <div className="tw:flex tw:items-center tw:space-x-2">
          <span>{question?.id ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}</span>
          {question && (
            <div className="tw:bg-blue-100 tw:text-blue-800 tw:px-2 tw:py-1 tw:rounded tw:text-sm">
              ID: {question.id}
            </div>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={onCancel} className="tw:mr-2">
          Hủy
        </Button>,
        question && onDelete && (
          <Popconfirm
            key="delete"
            title="Xóa câu hỏi này?"
            onConfirm={handleDelete}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger className="tw:mr-2">
              Xóa
            </Button>
          </Popconfirm>
        ),
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <div className="tw:space-y-6">
        {/* ========================================================================
            QUESTION FORM
        ========================================================================== */}
        <Form form={form} layout="vertical" className="tw:space-y-4">
          {/* Question Content */}
          <div className="tw:bg-gray-50 tw:p-4 tw:rounded-lg">
            <Form.Item
              label={<span className="tw:font-medium tw:text-gray-700">Câu hỏi</span>}
              name="question"
              rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Nhập câu hỏi..." 
                className="tw:border-gray-300 focus:tw:border-blue-500"
              />
            </Form.Item>
          </div>

          {/* Question Settings */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="tw:font-medium tw:text-gray-700">Thứ tự</span>}
                name="order_index"
                rules={[{ required: true, message: "Vui lòng nhập thứ tự" }]}
              >
                <Input 
                  type="number" 
                  placeholder="Thứ tự hiển thị" 
                  className="tw:border-gray-300 focus:tw:border-blue-500"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
              label={<span className="tw:font-medium tw:text-gray-700">Đáp án đúng</span>}
              name="correct_answer"
            >
              <Input 
                placeholder="Nhập đáp án đúng"
                className="tw:border-gray-300 focus:tw:border-blue-500"
              />
            </Form.Item>
            </Col>
          </Row>

          {/* Explanation */}
          <Form.Item
            label={<span className="tw:font-medium tw:text-gray-700">Giải thích</span>}
            name="reason"
          >
            <Input.TextArea 
              rows={2} 
              placeholder="Giải thích đáp án (tùy chọn)" 
              className="tw:border-gray-300 focus:tw:border-blue-500"
            />
          </Form.Item>
        </Form>

      </div>
    </Modal>
  );
};