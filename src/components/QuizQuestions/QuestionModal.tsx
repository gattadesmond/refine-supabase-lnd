import {  useEffect } from "react";
import { Form, Input, Row, Col, Button, Modal, Popconfirm } from "antd";
import type { QuestionModalProps } from './types';

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
      </div>
    </Modal>
  );
};
