import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Upload, Button, Card, Typography, Row, Col, Avatar, Space } from "antd";
import { UserOutlined, UploadOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export const MembersCreate = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <div className="tw-p-6">
            <div className="tw-mb-6">
                <Title level={2} className="tw-mb-2">
                    <TeamOutlined className="tw-mr-2" />
                    Thêm thành viên mới
                </Title>
                <Text type="secondary">
                    Nhập thông tin chi tiết của thành viên mới
                </Text>
            </div>

            <Card className="tw-shadow-lg">
                <Form
                    {...formProps}
                    layout="vertical"
                    size="large"
                    className="tw-max-w-4xl"
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <div className="tw-text-center tw-mb-6">
                                <Avatar 
                                    size={120} 
                                    icon={<UserOutlined />}
                                    className="tw-mb-4"
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
                                name="name"
                                rules={[
                                    { required: true, message: "Vui lòng nhập họ và tên" },
                                    { min: 2, message: "Tên phải có ít nhất 2 ký tự" }
                                ]}
                            >
                                <Input 
                                    placeholder="Nhập họ và tên đầy đủ"
                                    prefix={<UserOutlined className="tw-text-gray-400" />}
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
                                    prefix={<MailOutlined className="tw-text-gray-400" />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số điện thoại" },
                                    { pattern: /^[0-9+\-\s()]+$/, message: "Số điện thoại không hợp lệ" }
                                ]}
                            >
                                <Input 
                                    placeholder="+84 123 456 789"
                                    prefix={<PhoneOutlined className="tw-text-gray-400" />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Vai trò"
                                name="role"
                                rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                            >
                                <Select placeholder="Chọn vai trò">
                                    <Option value="admin">Quản trị viên</Option>
                                    <Option value="manager">Quản lý</Option>
                                    <Option value="member">Thành viên</Option>
                                    <Option value="guest">Khách</Option>
                                </Select>
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
                                    <Option value="inactive">Không hoạt động</Option>
                                    <Option value="pending">Chờ duyệt</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Phòng ban"
                                name="department"
                            >
                                <Input placeholder="Phòng ban làm việc" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Ghi chú"
                                name="notes"
                            >
                                <Input.TextArea 
                                    rows={4}
                                    placeholder="Ghi chú về thành viên..."
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <div className="tw-flex tw-justify-end tw-gap-4">
                                <Button size="large">
                                    Hủy
                                </Button>
                                <Button 
                                    type="primary" 
                                    size="large"
                                    {...saveButtonProps}
                                >
                                    Tạo thành viên
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
};
