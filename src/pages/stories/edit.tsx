import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Checkbox } from "antd";
import EditorJSForm from "../../components/EditorJS/EditorJSForm";

export const StoriesEdit = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Id"
                    name={["id"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input readOnly disabled />
                </Form.Item>
             
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
                            required: false,
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
                            required: false,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Featured"
                    valuePropName="checked"
                    name={["featured"]}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Checkbox>Featured</Checkbox>
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
