import React, { useEffect } from "react";
import {
  DateField,
  Edit,
  useForm,
  SaveButton,
  DeleteButton,
  useSelect,
} from "@refinedev/antd";
import { Form, Input, Switch, DatePicker } from "antd";
import EditorJSForm from "../../components/EditorJS/EditorJSForm";
import { Select } from "antd/lib";
import slugify from "slugify";
import PostStatus from "../../components/PostStatus";
import {
  HttpError,
} from "@refinedev/core";

type Event = {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  description: string;
  content: string;
  cover_image_url: string;
  event_date: string;
  location: string;
  status: "draft" | "published" | "preview";
  featured: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  // Single organizer relationship
  organizer_id: number;
};

export const EventsEdit = () => {
  const {
    formProps,
    saveButtonProps,
    form,
    query: queryResult,
  } = useForm<Event, HttpError, Event>({
    resource: "events",
    redirect: false, // Không redirect sau khi save
    queryMeta: {
      select: "*", // Simple select without complex relationships
    },
  });

  // Get categories data using useSelect hook
  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "title", // Field name to display in options
    optionValue: "id", // Field name to use as value
    defaultValue: queryResult?.data?.data?.category_id, // Set default value to current category
    meta: {
      select: "id, title, description, slug, categories_post_types!inner(post_type_id)",
    },
    filters: [
      {
        field: "categories_post_types.post_type_id",
        operator: "eq",
        value: 2, // Events post type
      },
    ],
  });

  // Get members data using useSelect hook
  const { selectProps: memberSelectProps } = useSelect({
    resource: "members",
    optionLabel: "full_name", // Field name to display in options
    optionValue: "id", // Field name to use as value
    defaultValue: queryResult?.data?.data?.organizer_id,
  });

  // Watch title changes and auto-generate slug using slugify
  const title = Form.useWatch("title", form);
  const slug = Form.useWatch("slug", form);
  const status = queryResult?.data?.data?.status;
  const coverImage = Form.useWatch("cover_image_url", form);
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
      <Form<Event> {...formProps} layout="vertical">
        <div className="tw:grid  tw:grid-cols-[1fr_260px] tw:gap-10  ">
          <div className="relative z-10 ">
            <Form.Item
              label={
                <div className="tw:flex tw:items-center tw:gap-3">
                  <span>Tiêu đề sự kiện</span>
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
              Url sự kiện : <span className="tw:font-mono">{slug || ""}</span>
            </div>

            <Form.Item
              className="tw:hidden"
              label="Đường dẫn sự kiện"
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
              label="Mô tả ngắn sự kiện"
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
                label="Người tổ chức"
                name={["organizer_id"]}
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select
                  {...memberSelectProps}
                  placeholder="Chọn người tổ chức"
                  allowClear
                  className="tw:w-[200px]"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Ngày sự kiện"
              name={["event_date"]}
              // rules={[
              //   {
              //     required: true,
              //   },
              // ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                className="tw:w-full"
                placeholder="Chọn ngày và giờ sự kiện"
              />
            </Form.Item>

            <Form.Item
              label="Địa điểm"
              name={["location"]}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input placeholder="Nhập địa điểm tổ chức sự kiện" />
            </Form.Item>

            <Form.Item
              label="Content"
              name={["content"]}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <EditorJSForm placeholder="Nhập nội dung sự kiện..." />
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
                    <Select.Option value="published">Xuất bản</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Sự kiện nổi bật"
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
                <div className="tw:space-y-3">
                  <Input
                    value={coverImage}
                    placeholder="Nhập URL hình ảnh..."
                    className="tw:font-mono tw:text-sm"
                  />
                  {coverImage && (
                    <div className="tw:border tw:border-gray-200 tw:rounded-lg tw:p-3 ">
                      <div className="tw:text-xs tw:text-gray-600 tw:mb-2">
                        Preview:
                      </div>
                      <img
                        src={coverImage}
                        alt="Cover preview"
                        className="tw:max-w-full tw:h-auto tw:max-h-48 tw:rounded-md tw:shadow-sm"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const errorDiv =
                            target.nextElementSibling as HTMLElement;
                          if (errorDiv) {
                            target.style.display = "none";
                            errorDiv.style.display = "flex";
                          }
                        }}
                      />
                      <div
                        className="tw:hidden tw:items-center tw:justify-center tw:h-24 tw:bg-gray-100 tw:rounded-md tw:text-xs tw:text-gray-500"
                        style={{ display: "none" }}
                      >
                        Không thể tải hình ảnh
                      </div>
                    </div>
                  )}
                </div>
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