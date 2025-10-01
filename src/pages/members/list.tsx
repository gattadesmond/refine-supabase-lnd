import { List, useTable, CreateButton, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Card, Avatar, Tag, Space, Typography, Row, Col, Statistic } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from "@ant-design/icons";

import {
    useList,
} from "@refinedev/core";

const { Text } = Typography;

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
    console.log("🚀 ~ MembersList ~ tableProps:", tableProps?.dataSource)

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
            render: (text: string, record: any) => {
                return (<Space>
                    <Avatar src={record.avatar_url} icon={<UserOutlined />} size="large" />
                    <div>
                        <div className="tw:font-medium tw:text-gray-900">{text}</div>
                        <div className="tw:text-sm tw:text-gray-500">{record.email}</div>
                    </div>
                </Space>);
            },
        },

        {
            title: "Tên",
            dataIndex: "full_name",
            key: "full_name",
            render: (fullName: string) => (
                <Space direction="vertical" size={0}>
                    <Space size={4}>
                        <Text className="tw:text-sm">{fullName || "Chưa cập nhật"}</Text>
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
        <List>
            <div className="">
                {/* Statistics Cards */}
                <Row gutter={16} className="tw:mb-6">
                    <Col span={6}>
                        <Card className="tw:text-center">
                            <Statistic
                                title="Tổng thành viên"
                                value={totalCount || 0}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="tw:text-center">
                            <Statistic
                                title="Đang hoạt động"
                                value={activeCount || 0}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>

                    <Col span={6}>
                        <Card className="tw:text-center">
                            <Statistic
                                title="Dừng hoạt động"
                                value={disabledCount || 0}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#fa8c16" }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Table
                    {...tableProps}
                    columns={columns}
                    rowKey="id"
                />
            </div>
        </List>
    );
};
