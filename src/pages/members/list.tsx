import { List, useTable, CreateButton, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Card, Avatar, Tag, Space, Typography, Row, Col, Statistic } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from "@ant-design/icons";

import {
    useList,
} from "@refinedev/core";

const { Title, Text } = Typography;

export const MembersList = () => {
    const { tableProps } = useTable({
        sorters: {
            initial: [
                {
                    field: "created_at",
                    order: "desc",
                },
            ],
        },
    });

    const {
        result: { data: membersData },
    } = useList({
        resource: "members",
        pagination: {
            mode: "off", // Lấy tất cả dữ liệu không phân trang
        },
        meta: {
            select: "id, status"
        },
    });

    const totalCount = membersData?.length;
    const activeCount = membersData.filter((member) => member.status === "active").length;
    const disabledCount = membersData.filter((member) => member.status === "disabled").length;


    const columns = [
        {
            title: "Thành viên",
            dataIndex: "name",
            key: "name",
            render: (text: string, record: any) => (
                <Space>
                    <Avatar
                        src={record.avatar}
                        icon={<UserOutlined />}
                        size="large"
                    />
                    <div>
                        <div className="tw-font-medium tw-text-gray-900">{text}</div>
                        <div className="tw-text-sm tw-text-gray-500">{record.email}</div>
                    </div>
                </Space>
            ),
        },

        {
            title: "Liên hệ",
            dataIndex: "phone",
            key: "phone",
            render: (phone: string) => (
                <Space direction="vertical" size={0}>
                    <Space size={4}>
                        <PhoneOutlined className="tw-text-gray-400" />
                        <Text className="tw-text-sm">{phone || "Chưa cập nhật"}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const statusConfig = {
                    active: { color: "green", text: "Hoạt động" },
                    inactive: { color: "red", text: "Không hoạt động" },
                    pending: { color: "orange", text: "Chờ duyệt" }
                };
                const config = statusConfig[status as keyof typeof statusConfig] || { color: "default", text: status };
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: "Ngày tham gia",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, record: any) => (
                <Space>
                    <EditButton hideText size="small" recordItemId={record.id} />
                    <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
            ),
        },
    ];

    return (
        <div className="tw-p-6">
            <div className="tw-mb-6">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                    <div>
                        <Title level={2} className="tw-mb-2">
                            <TeamOutlined className="tw-mr-2" />
                            Quản lý thành viên
                        </Title>
                        <Text type="secondary">
                            Quản lý thông tin và quyền hạn của các thành viên trong tổ chức
                        </Text>
                    </div>
                    <CreateButton type="primary" size="large">
                        Thêm thành viên
                    </CreateButton>
                </div>

                {/* Statistics Cards */}
                <Row gutter={16} className="tw-mb-6">
                    <Col span={6}>
                        <Card className="tw-text-center">
                            <Statistic
                                title="Tổng thành viên"
                                value={totalCount|| 0}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="tw-text-center">
                            <Statistic
                                title="Đang hoạt động"
                                value={activeCount || 0}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>

                    <Col span={6}>
                        <Card className="tw-text-center">
                            <Statistic
                                title="Dừng hoạt động"
                                value={disabledCount || 0}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#fa8c16" }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Card className="tw-shadow-lg tw-mt-10">
                <Table
                    {...tableProps}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        ...tableProps.pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} thành viên`,
                    }}
                    className="tw-rounded-lg"
                />
            </Card>
        </div>
    );
};
