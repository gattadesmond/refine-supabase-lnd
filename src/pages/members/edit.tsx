import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Row, Col, Avatar,  Divider } from "antd";
import { UserOutlined,  MailOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const { Option } = Select;

export const MembersEdit = () => {
    const { formProps, saveButtonProps, query: queryResult } = useForm();
    const memberData = queryResult?.data?.data;

    return (
        <Edit
            title="Edit member"
            saveButtonProps={saveButtonProps}
        >
            <Form
                {...formProps}
                layout="vertical"
                size="large"
                className="tw:max-w-4xl"
                initialValues={{
                    full_name: memberData?.full_name,
                    email: memberData?.email,
                    user_name: memberData?.user_name,
                    avatar_url: memberData?.avatar_url,
                    department: memberData?.department,
                    title: memberData?.title,
                    slogan: memberData?.slogan,
                    status: memberData?.status,
                }}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <div className="tw:text-center tw:mb-6">
                            <Avatar
                                size={120}
                                src={memberData?.avatar_url}
                                icon={<UserOutlined />}
                                className="tw:mb-4"
                            />
                            {/* <div>
                                <Upload>
                                    <Button icon={<UploadOutlined />} type="dashed">
                                        Thay đổi ảnh đại diện
                                    </Button>
                                </Upload>
                            </div> */}
                        </div>
                    </Col>
                </Row>

                <Divider orientation="left">Thông tin cơ bản</Divider>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="full_name"
                            rules={[
                                { required: true, message: "Vui lòng nhập họ và tên" },
                                { min: 2, message: "Tên phải có ít nhất 2 ký tự" }
                            ]}
                        >
                            <Input
                                placeholder="Nhập họ và tên đầy đủ"
                                prefix={<UserOutlined className="tw:text-gray-400" />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                { type: "email", message: "Email không hợp lệ" }
                            ]}
                        >
                            <Input
                                placeholder="example@company.com"
                                prefix={<MailOutlined className="tw:text-gray-400" />}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Username"
                            name="user_name"
                            rules={[
                                { required: true, message: "Vui lòng nhập username" },
                                { min: 2, message: "Username phải có ít nhất 2 ký tự" }
                            ]}
                        >
                            <Input
                                placeholder="Nhập username"
                                prefix={<UserOutlined className="tw:text-gray-400" />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Avatar URL"
                            name="avatar_url"
                        >
                            <Input
                                placeholder="https://example.com/avatar.jpg"
                                prefix={<UserOutlined className="tw:text-gray-400" />}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Phòng ban"
                            name="department"
                        >
                            <Input placeholder="Phòng ban làm việc" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Chức vụ"
                            name="title"
                        >
                            <Input placeholder="Chức vụ công việc" />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left">Quyền hạn và trạng thái</Divider>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="active">Hoạt động</Option>
                                <Option value="disabled">Không hoạt động</Option>
                                <Option value="pending">Chờ duyệt</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Slogan"
                            name="slogan"
                        >
                            <ReactQuill 
                                theme="snow"
                                placeholder="Nhập slogan cá nhân..."
                                style={{ 
                                    height: "120px",
                                    marginBottom: "42px"
                                }}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline'],
                                        [{ 'color': [] }, { 'background': [] }],
                                        [{ 'align': [] }],
                                        ['clean']
                                    ]
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>


           
            </Form>
        </Edit>
    );
};
