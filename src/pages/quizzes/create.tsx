import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { Quiz } from "../../types/quiz";

export const QuizzesCreate = () => {
  const { formProps, saveButtonProps } = useForm<Quiz>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tiêu đề Quiz"
          name="title"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tiêu đề quiz",
            },
          ]}
        >
          <Input placeholder="Nhập tiêu đề quiz" />
        </Form.Item>
        
        <Form.Item
          label="Mô tả"
          name="description"
        >
          <Input.TextArea 
            placeholder="Nhập mô tả quiz (tùy chọn)"
            rows={4}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
