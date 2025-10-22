import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Divider } from "antd";
import { Quiz } from "../../types/quiz";
import { QuizQuestions } from "../../components/QuizQuestions";

export const QuizzesEdit = () => {
  const { formProps, saveButtonProps } = useForm<Quiz>({
    resource: "quizzes",
    redirect: false,
  });

  const quizId = formProps?.initialValues?.id;

  return (
    <Edit saveButtonProps={saveButtonProps}>
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

        <Divider />
        
        {quizId && <QuizQuestions quizId={quizId} />}
      </Form>
    </Edit>
  );
};