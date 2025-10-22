import React, { useCallback } from "react";
import { Form, Input, Divider } from "antd";
import { Quiz } from "../../types/quiz";
import { QuizQuestions } from "../../components/QuizQuestions";
import { useGo } from "@refinedev/core";
import { Edit, SaveButton, useForm, DeleteButton } from "@refinedev/antd";

export const QuizzesEdit = () => {
  const { formProps, saveButtonProps } = useForm<Quiz>({
    resource: "quizzes",
    redirect: false,
  });

  const quizId = formProps?.initialValues?.id;
  const go = useGo();
  const handleDeleteSuccess = useCallback(() => {
    go({ to: "/quizzes" });
  }, [go]);

  return (
    <Edit saveButtonProps={saveButtonProps} footerButtons={() => (
      <></>
    )}
    >
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
            rows={2}
          />
        </Form.Item>

        <div className="tw:mb-6  tw:flex tw:flex-nowrap tw:justify-end tw:gap-4">
          <DeleteButton
            recordItemId={quizId}
            onSuccess={handleDeleteSuccess}
            confirmTitle="Xác nhận xóa quizzes"
            confirmOkText="Xóa"
            confirmCancelText="Hủy"
            className="tw:flex-shrink-0"
          />

          <SaveButton {...saveButtonProps} className="">
            Lưu
          </SaveButton>
        </div>

        <Divider />

        {quizId && <QuizQuestions quizId={quizId} />}
      </Form>
    </Edit>
  );
};