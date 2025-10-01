import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Upload, Button, Card, Typography, Row, Col, Avatar, Space } from "antd";
import { UserOutlined, UploadOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export const MembersCreate = () => {
    const { formProps, saveButtonProps } = useForm();
    
    console.log("🚀 ~ MembersCreate ~ formProps:", formProps);

    return (
        <Create
            title="Thêm thành viên mới"
            saveButtonProps={saveButtonProps}
        >
            <Form
                {...formProps}
                layout="vertical"
                size="large"
                className="tw:max-w-4xl"
            >
                    <Row gutter={24}>
                        <Col span={24}>
                            <div className="tw:text-center tw:mb-6">
                                <Avatar 
                                    size={120} 
                                    icon={<UserOutlined />}
                                    className="tw:mb-4"
                                />
                                <div>
                                    <Upload>
                                        <Button icon={<UploadOutlined />} type="dashed">
                                            Tải lên ảnh đại diện
                                        </Button>
                                    </Upload>
                                </div>
                            </div>
                        </Col>
                    </Row>

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

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                            initialValue="active"
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="active">Hoạt động</Option>
                                <Option value="disabled">Không hoạt động</Option>
                                <Option value="pending">Chờ duyệt</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Slogan"
                            name="slogan"
                        >
                            <Input placeholder="Slogan cá nhân" />
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Create>
    );
};
