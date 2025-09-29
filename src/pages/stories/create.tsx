import React, { useEffect } from "react";
import { Create, useForm, SaveButton, useSelect } from "@refinedev/antd";
import { Form, Input, Switch } from "antd";
import EditorJSForm from "../../components/EditorJS/EditorJSForm";
import { Select } from "antd/lib";
import slugify from "slugify";
import PostStatus from "../../components/PostStatus";

export const StoriesCreate = () => {
    const { formProps, saveButtonProps, form } = useForm({
        resource: "stories",
        redirect: "edit", // Redirect sang trang edit sau khi tạo thành công
    });

    // // Get categories data using useSelect hook
    // const { selectProps: categorySelectProps } = useSelect({
    //     resource: "categories",
    //     optionLabel: "title", // Field name to display in options
    //     optionValue: "id",   // Field name to use as value
    // });


    const { selectProps: categorySelectProps } = useSelect({
        resource: "categories",
        optionLabel: "title", // Field name to display in options
        optionValue: "id", // Field name to use as value
        meta: {
          select: "id, title, description, slug, categories_post_types!inner(post_type_id)",
        },
        filters: [
          {
            field: "categories_post_types.post_type_id",
            operator: "eq",
            value: 1,
          },
        ],
      });
    console.log("🚀 ~ StoriesCreate ~ categorySelectProps:", categorySelectProps)

    // Get members data using useSelect hook
    const { selectProps: memberSelectProps } = useSelect({
        resource: "members",
        optionLabel: "full_name", // Field name to display in options
        optionValue: "id",   // Field name to use as value
    });

    // Watch title changes and auto-generate slug using slugify
    const title = Form.useWatch('title', form);
    const slug = Form.useWatch('slug', form);
    const coverImage = Form.useWatch('cover_image_url', form);

    useEffect(() => {
        if (title && form) {
            const slug = slugify(title, {
                lower: true,      // Convert to lowercase
                strict: true,     // Remove special characters
                locale: 'vi',     // Support Vietnamese characters
                trim: true        // Trim leading/trailing spaces
            });
            form.setFieldValue('slug', slug);
        }
    }, [title, form]);

    return (
        <Create saveButtonProps={saveButtonProps} footerButtons={<></>}>
            <Form {...formProps} layout="vertical" >

                <div className="tw:grid  tw:grid-cols-[1fr_260px] tw:gap-10  ">

                    <div className="relative z-10 ">
                        <Form.Item
                            label={
                                <div className="tw:flex tw:items-center tw:gap-3">
                                    <span>Tiêu đề bài viết</span>
                                    <PostStatus status="draft" />
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
                            Url bài viết : <span className="tw:font-mono">{slug || ''}</span>
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
                            <Input
                                className="tw:font-mono tw:text-sm"
                                disabled
                            />
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
                                name={["categories_id"]}
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
                                <SaveButton  {...saveButtonProps} className="tw:w-full" >Lưu</SaveButton>
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
                                    initialValue="draft"
                                >
                                    <Select>
                                        <Select.Option value="draft">Bản nháp</Select.Option>
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
                                    initialValue={false}
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
                                        <div className="tw:border tw:border-gray-200 tw:rounded-lg tw:p-3 tw:bg-gray-50">
                                            <div className="tw:text-xs tw:text-gray-600 tw:mb-2">Preview:</div>
                                            <img
                                                src={coverImage}
                                                alt="Cover preview"
                                                className="tw:max-w-full tw:h-auto tw:max-h-48 tw:rounded-md tw:shadow-sm"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    const errorDiv = target.nextElementSibling as HTMLElement;
                                                    if (errorDiv) {
                                                        target.style.display = 'none';
                                                        errorDiv.style.display = 'flex';
                                                    }
                                                }}
                                            />
                                            <div
                                                className="tw:hidden tw:items-center tw:justify-center tw:h-24 tw:bg-gray-100 tw:rounded-md tw:text-xs tw:text-gray-500"
                                                style={{ display: 'none' }}
                                            >
                                                Không thể tải hình ảnh
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Form.Item>

                            <Form.Item
                                label="View Count"
                                name={["view_count"]}
                                initialValue={0}
                                className="tw:hidden"
                            >
                                <Input type="number" />
                            </Form.Item>

                        </div>

                    </div>

                </div>

            </Form>
        </Create>
    );
};
