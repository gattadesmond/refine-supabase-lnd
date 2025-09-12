import React, { useEffect } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch } from "antd";
import EditorJSForm from "../../components/EditorJS/EditorJSForm";
import { Select } from "antd/lib";
import slugify from "slugify";

export const StoriesEdit = () => {
    const { formProps, saveButtonProps, form } = useForm({
        redirect: false, // Không redirect sau khi save
    });

    // Watch title changes and auto-generate slug using slugify
    const title = Form.useWatch('title', form);
    const slug = Form.useWatch('slug', form);

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
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">

                <Form.Item
                    label="Tiêu đề bài viết"
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


                {/* <Form.Item
                    label="Chuyên mục"
                    name={["categories_id"]}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value="1">Chuyên mục 1</Select.Option>
                        <Select.Option value="2">Chuyên mục 2</Select.Option>
                    </Select>
                </Form.Item> */}
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
                        <Select.Option value="preview">Xem trước</Select.Option>
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
                <Form.Item
                    label="View Count"
                    name={["view_count"]}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Edit>
    );
};
