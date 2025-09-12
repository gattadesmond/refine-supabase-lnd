import React, { useEffect } from "react";
import { DateField, Edit, useForm, SaveButton, DeleteButton } from "@refinedev/antd";
import { Form, Input, Switch, Space } from "antd";
import EditorJSForm from "../../components/EditorJS/EditorJSForm";
import { Select } from "antd/lib";
import slugify from "slugify";

export const StoriesEdit = () => {
    const { formProps, saveButtonProps, form, query: queryResult } = useForm({
        redirect: false, // Không redirect sau khi save
    });

    // Watch title changes and auto-generate slug using slugify
    const title = Form.useWatch('title', form);
    const slug = Form.useWatch('slug', form);
    const createDate = queryResult?.data?.data?.created_at;
    const updateDate = queryResult?.data?.data?.updated_at;

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
        <Edit saveButtonProps={saveButtonProps} >
            <Form {...formProps} layout="vertical" >

                <div className="tw:grid  tw:grid-cols-[1fr_260px] tw:gap-10  ">
                    <div className=" ">
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

                    </div>

                    <div className="tw:relative  tw:bg-gray-50 tw:-m-5 tw:p-5">
                        <div className="tw:sticky tw:top-20">
                            <div className="tw:mb-6  tw:flex tw:flex-nowrap tw:gap-4">
                                <DeleteButton
                                    recordItemId={queryResult?.data?.data?.id}
                                />

                                <SaveButton  {...saveButtonProps} className="tw:w-full" >Lưu</SaveButton>

                            </div>
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

                            Ngày tạo : <DateField value={createDate} format="DD/MM/YYYY HH:mm" />
                            Ngày chỉnh sửa : <DateField value={updateDate} format="DD/MM/YYYY HH:mm" />

                            <Form.Item
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
                            </Form.Item>
                        </div>

                    </div>

                </div>


            </Form>
        </Edit>
    );
};
