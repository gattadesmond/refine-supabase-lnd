import {
  DateField,
  DeleteButton,
  Edit,
  SaveButton,
  useForm,
  useSelect,
} from "@refinedev/antd";
import { HttpError, useCreateMany, useDeleteMany } from "@refinedev/core";
import { Form, Input, Select, Switch } from "antd";
import { useEffect } from "react";
import slugify from "slugify";
import PostStatus from "../../components/PostStatus";
import UploadImage from "../../components/UploadImage";
import { EditorJSForm } from "../../components";

type Learning = {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  description: string;
  content: string;
  cover_image_url: string;
  status: "draft" | "published" | "preview";
  featured: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  // Quan hệ nhiều-nhiều với members thông qua learnings_authors
  authors: { id: number; value: string; label: string }[] | undefined;
};

export const LearningMaterialsEdit = () => {
  const {
    formProps,
    saveButtonProps,
    form,
    query: queryResult,
  } = useForm<Learning, HttpError, Learning>({
    redirect: false, // Không redirect sau khi save
    queryMeta: {
      select:
        "*, authors:learnings_authors(id,...members(value:id,label:full_name))", // Lấy thêm dữ liệu quan hệ authors và category
    },
  });

  const { mutate: addAuthors } = useCreateMany();

  const { mutate: removeAuthors } = useDeleteMany();

  const fetchedAuthors = queryResult?.data?.data?.authors ?? [];

  // Override formProps để thêm updated_at trước khi submit
  const enhancedFormProps = {
    ...formProps,
    onFinish: (values: Learning) => {
      const dataWithUpdatedAt = {
        ...values,
        authors: undefined, // Loại bỏ authors để tránh lỗi không mong muốn
      };
      const updatedAuthors =
        values.authors?.map((author) =>
          typeof author === "object" ? author.value : author
        ) ?? [];
      const addedAuthors = updatedAuthors.filter(
        (value) => !fetchedAuthors.some((author) => author.value === value)
      );
      if (addedAuthors.length > 0) {
        addAuthors({
          resource: "learnings_authors",
          values: addedAuthors.map((author) => ({
            story_id: queryResult?.data?.data?.id,
            author_id: author,
          })),
        });
      }
      const removedAuthors = fetchedAuthors.filter(
        (author) => !updatedAuthors?.includes(author.value)
      );
      if (removedAuthors.length > 0) {
        removeAuthors({
          resource: "learnings_authors",
          ids: removedAuthors.map((author) => author.id),
        });
      }
      return formProps.onFinish?.(dataWithUpdatedAt);
    },
  };

  // Get categories data using useSelect hook
  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "title", // Field name to display in options
    optionValue: "id", // Field name to use as value
    defaultValue: queryResult?.data?.data?.category_id ?? undefined, // Set default value to current category
    meta: {
      select:
        "id, title, description, slug, categories_post_types!inner(post_type_id)",
    },
    filters: [
      {
        field: "categories_post_types.post_type_id",
        operator: "eq",
        value: 1,
      },
    ],
  });

  // Get members data using useSelect hook
  const { selectProps: memberSelectProps } = useSelect({
    resource: "members",
    optionLabel: "full_name", // Field name to display in options
    optionValue: "id", // Field name to use as value
    defaultValue: fetchedAuthors.map(({ value }: { value: string }) => value),
  });

  // Watch title changes and auto-generate slug using slugify
  const title = Form.useWatch("title", form);
  const slug = Form.useWatch("slug", form);
  const status = queryResult?.data?.data?.status;
  const createDate = queryResult?.data?.data?.created_at;
  const updateDate = queryResult?.data?.data?.updated_at;

  useEffect(() => {
    if (title && form) {
      const slug = slugify(title, {
        lower: true, // Convert to lowercase
        strict: true, // Remove special characters
        locale: "vi", // Support Vietnamese characters
        trim: true, // Trim leading/trailing spaces
      });
      form.setFieldValue("slug", slug);
    }
  }, [title, form]);

  return (
    <Edit saveButtonProps={saveButtonProps} footerButtons={<></>}>
      <Form {...enhancedFormProps} layout="vertical">
        <div className="tw:grid  tw:grid-cols-[1fr_260px] tw:gap-10  ">
          <div className="relative z-10 ">
            <Form.Item
              label={
                <div className="tw:flex tw:items-center tw:gap-3">
                  <span>Tiêu đề bài viết</span>
                  <PostStatus status={status || "draft"} />
                </div>
              }
              name={["title"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input size="large" className="tw:font-semibold" />
            </Form.Item>

            <div className=" tw:text-gray-600 tw:-mt-4 tw:mb-4  tw:text-xs">
              Url bài viết : <span className="tw:font-mono">{slug || ""}</span>
            </div>

            <Form.Item
              className="tw:hidden"
              label="Đường dẫn bài viết"
              name={["slug"]}
              rules={[
                {
                  required: true,
                },
              ]}
              extra="URL slug được tự động tạo từ tiêu đề"
            >
              <Input className="tw:font-mono tw:text-sm" disabled />
            </Form.Item>

            <Form.Item
              label="Mô tả ngắn bài viết"
              name={["description"]}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <div className="tw:grid tw:grid-cols-2 tw:gap-4">
              <Form.Item
                label="Chuyên mục"
                name={["category_id"]}
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select
                  {...categorySelectProps}
                  placeholder="Chọn chuyên mục"
                  allowClear
                  className="tw:w-full"
                />
              </Form.Item>

              <Form.Item
                label="Tác giả"
                name={["authors"]}
                rules={[
                  {
                    required: false,
                    type: "array",
                  },
                ]}
              >
                <Select
                  {...memberSelectProps}
                  placeholder="Chọn tác giả"
                  allowClear
                  className="tw:w-[200px]"
                  mode="multiple"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Content"
              name={["content"]}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <EditorJSForm placeholder="Nhập nội dung bài viết..." />
            </Form.Item>
          </div>

          <div className="tw:relative  tw:bg-gray-50 tw:-m-5 tw:p-5">
            <div className="tw:sticky tw:top-20">
              <div className="tw:mb-6  tw:flex tw:flex-nowrap tw:gap-4">
                <DeleteButton recordItemId={queryResult?.data?.data?.id} />

                <SaveButton {...saveButtonProps} className="tw:w-full">
                  Lưu
                </SaveButton>
              </div>

              <div className="tw:grid tw:grid-cols-2 tw:gap-4">
                <Form.Item
                  label="Trạng thái"
                  name={["status"]}
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Select>
                    <Select.Option value="draft">Bản nháp</Select.Option>
                    {/* <Select.Option value="preview">Xem trước</Select.Option> */}
                    <Select.Option value="published">Xuất bản</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Bài nổi bật"
                  valuePropName="checked"
                  name={["featured"]}
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Switch />
                </Form.Item>
              </div>

              <Form.Item
                label="Hình ảnh bìa"
                name={["cover_image_url"]}
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <UploadImage />
              </Form.Item>

              <div className="tw:space-y-2">
                <div className="tw:flex tw:justify-between tw:items-center tw:py-2 3">
                  <span className="tw:text-xs tw:text-gray-600 tw:font-medium">
                    Ngày tạo:
                  </span>
                  <DateField
                    value={createDate}
                    format="DD/MM/YYYY HH:mm"
                    className="tw:text-xs tw:font-mono tw:text-gray-800"
                  />
                </div>
                <div className="tw:flex tw:justify-between tw:items-center ">
                  <span className="tw:text-xs tw:text-gray-600 tw:font-medium">
                    Cập nhật:
                  </span>
                  <DateField
                    value={updateDate}
                    format="DD/MM/YYYY HH:mm"
                    className="tw:text-xs tw:font-mono tw:text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Edit>
  );
};
