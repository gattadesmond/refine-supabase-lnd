import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Checkbox, Select } from "antd";
import EditorJSForm from "../../components/EditorJS/EditorJSForm";

export const StoriesCreate = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Title"
                    name={["title"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                    label="Description"
                    name={["description"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                    label="Status"
                    name={["status"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value="draft">Draft</Select.Option>
                        <Select.Option value="published">Published</Select.Option>
                        <Select.Option value="archived">Archived</Select.Option>
                    </Select>
                </Form.Item>
                
                <Form.Item
                    label="Featured"
                    valuePropName="checked"
                    name={["featured"]}
                >
                    <Checkbox>Featured</Checkbox>
                </Form.Item>
               
                <Form.Item
                    label="Content"
                    name={["content"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <EditorJSForm placeholder="Nhập nội dung bài viết..." />
                </Form.Item>
                
                <Form.Item
                    label="View Count"
                    name={["view_count"]}
                    initialValue={0}
                >
                    <Input type="number" />
                </Form.Item>
            </Form>
        </Create>
    );
};
