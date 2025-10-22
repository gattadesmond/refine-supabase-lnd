import { useEffect, useState } from "react";
import { Form, Input, Row, Col, Button, Modal, Popconfirm, List, Card, Space, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useList, useCreate, useDelete } from "@refinedev/core";
import type { QuestionModalProps, QuizOption } from './types';

// ============================================================================
// QUESTION MODAL COMPONENT
// ============================================================================

export const QuestionModal: React.FC<QuestionModalProps> = ({
  visible,
  question,
  onSave,
  onCancel,
  onDelete
}) => {
  // ============================================================================
  // STATE & FORM
  // ============================================================================

  const [form] = Form.useForm();
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [newOptionKey, setNewOptionKey] = useState('');
  const [newOptionText, setNewOptionText] = useState('');

  // ============================================================================
  // REFINE HOOKS FOR QUIZ_OPTIONS
  // ============================================================================

  const { mutate: createOption } = useCreate();
  const { mutate: deleteOption } = useDelete();

  // Fetch existing options for the question
  const existingOptions = useList<QuizOption>({
    resource: "quiz_options",
    filters: question?.id ? [
      {
        field: "question_id",
        operator: "eq",
        value: question.id,
      },
    ] : [],
    queryOptions: {
      enabled: !!question?.id && visible,
    },
  });

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (question) {
      form.setFieldsValue(question);
    } else {
      form.resetFields();
    }
    setNewOptionKey('');
    setNewOptionText('');
  }, [question, form]);

  // Load options from database when they change
  useEffect(() => {
    if (existingOptions?.result?.data) {
      setOptions(existingOptions.result.data);
    } else {
      setOptions([]);
    }
  }, [existingOptions?.result?.data]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSave = () => {
    form.validateFields()
      .then((values) => {
        const updatedQuestion = {
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

  const handleAddOption = () => {
    if (newOptionKey.trim() && newOptionText.trim() && question?.id) {
      const optionKey = newOptionKey.trim().toUpperCase();
      
      // Check for duplicate option keys
      if (options.some(option => option.option_key === optionKey)) {
        return; // Don't add duplicate keys
      }
      
      const newOption: QuizOption = {
        id: Date.now(), // Temporary ID for new options
        question_id: question.id,
        option_key: optionKey,
        text: newOptionText.trim(),
      };
      
      // Add to database
      createOption({
        resource: "quiz_options",
        values: {
          question_id: question.id,
          option_key: optionKey,
          text: newOptionText.trim(),
        },
      });
      
      // Add to local state
      setOptions([...options, newOption]);
      setNewOptionKey('');
      setNewOptionText('');
    }
  };

  const handleDeleteOption = (optionId: number) => {
    // Delete from database
    deleteOption({
      resource: "quiz_options",
      id: optionId,
    });
    
    // Remove from local state
    setOptions(options.filter(option => option.id !== optionId));
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
      width={1000}
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

          {/* Question Settings */}
          <Row gutter={16}>

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

        {/* ========================================================================
            QUIZ OPTIONS SECTION
        ========================================================================== */}
        <div className="tw:space-y-4">
          <div className="tw:flex tw:items-center tw:justify-between">
            <Typography.Title level={5} className="tw:!mb-0">
              Tùy chọn câu trả lời
            </Typography.Title>
          </div>

          {/* Add New Option */}
          {question?.id && (
            <Card className="tw:bg-gray-50">
              <div className="tw:space-y-3">
                <Typography.Text className="tw:font-medium tw:text-gray-700">
                  Thêm tùy chọn mới
                </Typography.Text>
                <Row gutter={12}>
                  <Col span={8}>
                    <Input
                      placeholder="Key (A, B, C, D...)"
                      value={newOptionKey}
                      onChange={(e) => setNewOptionKey(e.target.value)}
                      className="tw:border-gray-300 focus:tw:border-blue-500"
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      placeholder="Nội dung tùy chọn"
                      value={newOptionText}
                      onChange={(e) => setNewOptionText(e.target.value)}
                      className="tw:border-gray-300 focus:tw:border-blue-500"
                    />
                  </Col>
                  <Col span={4}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddOption}
                      disabled={
                        !newOptionKey.trim() || 
                        !newOptionText.trim() || 
                        options.some(option => option.option_key === newOptionKey.trim().toUpperCase())
                      }
                      className="tw:w-full"
                    >
                      Thêm
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card>
          )}

          {!question?.id && (
            <Card className="tw:bg-yellow-50 tw:border-yellow-200">
              <Typography.Text type="secondary">
                Lưu câu hỏi trước để có thể thêm tùy chọn câu trả lời.
              </Typography.Text>
            </Card>
          )}

          {/* Options List */}
          {options.length > 0 && (
            <Card>
              <List
                dataSource={options}
                renderItem={(option) => (
                  <List.Item
                    actions={[
                      <Popconfirm
                        key="delete"
                        title="Xóa tùy chọn này?"
                        onConfirm={() => handleDeleteOption(option.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span className="tw:bg-blue-100 tw:text-blue-800 tw:px-2 tw:py-1 tw:rounded tw:text-sm tw:font-medium">
                            {option.option_key}
                          </span>
                          <span className="tw:text-gray-800">{option.text}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          {options.length === 0 && (
            <Card className="tw:text-center tw:py-8">
              <Typography.Text type="secondary">
                Chưa có tùy chọn nào. Hãy thêm tùy chọn cho câu hỏi này.
              </Typography.Text>
            </Card>
          )}
        </div>
      </div>
    </Modal>
  );
};
