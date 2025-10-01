import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Upload, Button, Card, Typography, Row, Col, Avatar, Space, Divider } from "antd";
import { UserOutlined, UploadOutlined, MailOutlined, PhoneOutlined, TeamOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export const MembersEdit = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();
    const memberData = queryResult?.data?.data;

    return (
        <div className="tw:p-6">
            <div className="tw:mb-6">
                <Title level={2} className="tw:mb-2">
                    <EditOutlined className="tw:mr-2" />
                    Chỉnh sửa thông tin thành viên
                </Title>
                <Text type="secondary">
                    Cập nhật thông tin chi tiết của thành viên
                </Text>
            </div>

            <Card className="tw:shadow-lg">
                <Form
                    {...formProps}
                    layout="vertical"
                    size="large"
                    className="tw:max-w-4xl"
                    initialValues={{
                        name: memberData?.name,
                        email: memberData?.email,
                        phone: memberData?.phone,
                        role: memberData?.role,
                        status: memberData?.status,
                        department: memberData?.department,
                        notes: memberData?.notes,
                    }}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <div className="tw:text-center tw:mb-6">
                                <Avatar 
                                    size={120} 
                                    src={memberData?.avatar}
                                    icon={<UserOutlined />}
                                    className="tw:mb-4"
                                />
                                <div>
                                    <Upload>
                                        <Button icon={<UploadOutlined />} type="dashed">
                                            Thay đổi ảnh đại diện
                                        </Button>
                                    </Upload>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Divider orientation="left">Thông tin cơ bản</Divider>

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
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số điện thoại" },
                                    { pattern: /^[0-9+\-\s()]+$/, message: "Số điện thoại không hợp lệ" }
                                ]}
                            >
                                <Input 
                                    placeholder="+84 123 456 789"
                                    prefix={<PhoneOutlined className="tw:text-gray-400" />}
                                />
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

                    <Divider orientation="left">Quyền hạn và trạng thái</Divider>

                    <Row gutter={24}>
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
                        <Col span={12}>
                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                            >
                                <Select placeholder="Chọn trạng thái">
                                    <Option value="active">Hoạt động</Option>
                                    <Option value="inactive">Không hoạt động</Option>
                                    <Option value="pending">Chờ duyệt</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Thông tin bổ sung</Divider>

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
                            <div className="tw:flex tw:justify-end tw:gap-4">
                                <Button size="large">
                                    Hủy
                                </Button>
                                <Button 
                                    type="primary" 
                                    size="large"
                                    {...saveButtonProps}
                                >
                                    Cập nhật thông tin
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
};
