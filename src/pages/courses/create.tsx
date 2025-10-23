import React, { useCallback, useEffect } from "react";
import { Create, SaveButton, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Card, Form, Typography, Input, Select } from "antd";
import slugify from "slugify";
import UploadImage from "../../components/UploadImage";

// Types
type Course = {
  id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  status: boolean;
};

// Course learnings management sẽ được xử lý trong edit page

// Main Component
export const CoursesCreate = () => {
  const { saveButtonProps, formProps, form } = useForm<Course, HttpError, Course>({
    resource: "courses",
    redirect: "edit",
  });

  // Course learnings sẽ được xử lý trong edit page sau khi tạo course

  // Watch name changes and auto-generate slug
  const name = Form.useWatch("name", form);
  const slug = Form.useWatch("slug", form);

  useEffect(() => {
    if (name && form) {
      const autoSlug = slugify(name, {
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      });
      form.setFieldValue("slug", autoSlug);
    }
  }, [name, form]);

  // Course learnings management sẽ được xử lý trong edit page

  // Refine sẽ tự động xử lý tạo course và redirect đến edit page
  // Course learnings sẽ được xử lý sau khi redirect

  return (
    <Create saveButtonProps={saveButtonProps} title={<span>Tạo khóa học mới</span>}>
      <Form<Course> {...formProps} layout="vertical">

        <div className="tw:grid tw:grid-cols-[1fr_300px] tw:gap-8 tw:mb-8">
          {/* Course Basic Info */}
          <div>
            <Card title="Thông tin cơ bản" className="tw:mb-6">

              <Form.Item
                label="Tên khóa học"
                name={["name"]}
                rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
              >
                <Input size="large" className="tw:font-semibold" />
              </Form.Item>

              <div className="tw:text-gray-600 tw:-mt-4 tw:mb-4 tw:text-xs">
                URL khóa học: <span className="tw:font-mono">{slug || ""}</span>
              </div>

              <Form.Item
                label="Trạng thái"
                name={["status"]}
                rules={[
                  {
                    required: false,
                  },
                ]}
                className="tw:max-w-[200px]"
                initialValue="draft"
              >
                <Select>
                  <Select.Option value="draft">Bản nháp</Select.Option>
                  <Select.Option value="published">Xuất bản</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                className="tw:hidden"
                label="Đường dẫn khóa học"
                name={["slug"]}
                rules={[{ required: true }]}
                extra="URL slug được tự động tạo từ tên khóa học"
              >
                <Input className="tw:font-mono tw:text-sm" disabled />
              </Form.Item>

              <Form.Item
                label="Mô tả khóa học"
                name={["description"]}
                rules={[{ required: false }]}
              >
                <Input.TextArea rows={3} placeholder="Nhập mô tả ngắn về khóa học..." />
              </Form.Item>
            </Card>
          </div>

          {/* Course Settings */}
          <div>
            <div className="tw:mb-6">
              <SaveButton {...saveButtonProps} className="tw:w-full">
                Tạo khóa học
              </SaveButton>
            </div>

            <Form.Item
              label="Hình ảnh đại diện"
              name={["thumbnail_url"]}
              rules={[{ required: false }]}
            >
              <UploadImage />
            </Form.Item>
          </div>
        </div>

        {/* Course Lessons Management sẽ được xử lý trong edit page */}
        <div className="tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-lg tw:p-4">
          <Typography.Paragraph className="tw:text-blue-800 tw:mb-0">
            💡 <strong>Lưu ý:</strong> Sau khi tạo khóa học, bạn sẽ được chuyển đến trang chỉnh sửa để thêm bài học vào khóa.
          </Typography.Paragraph>
        </div>
      </Form>
    </Create>
  );
};
