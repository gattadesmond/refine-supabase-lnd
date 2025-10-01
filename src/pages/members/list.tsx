import { List, useTable, CreateButton, EditButton, DeleteButton, ShowButton, FilterDropdown, getDefaultFilter } from "@refinedev/antd";
import { Table, Card, Avatar, Tag, Space, Typography, Row, Col, Statistic, Input } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, TeamOutlined, SearchOutlined } from "@ant-design/icons";

import {
    useList,
} from "@refinedev/core";

const { Text } = Typography;

export const MembersList = () => {
    const { tableProps, filters } = useTable({
        syncWithLocation: false,
        sorters: {
            initial: [
                {
                    field: "created_at",
                    order: "desc",
                },
            ],
        },
        filters: {
            initial: [
              {
                field: "email",
                operator: "contains",
                value: "",
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (text: string, record: any) => {
                return (<Space>
                    <Avatar src={record.avatar_url} icon={<UserOutlined />} size="large" />
                    <div>
                        <div className="tw:font-medium tw:text-gray-900">{text}</div>
                        <div className="tw:text-sm tw:text-gray-500">{record.full_name}</div>
                    </div>
                </Space>);
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            filterIcon: (filtered) => (
                <SearchOutlined
                    style={{
                        color: filtered ? "#1890ff" : undefined,
                    }}
                />
            ),
            defaultFilteredValue: getDefaultFilter("email", filters, "contains"),
            filterDropdown: (props) => (
                <FilterDropdown {...props}>
                    <Input placeholder="Search by email" />
                </FilterDropdown>
            ),
            render: (email: string) => (
                <Space direction="vertical" size={0}>
                    <Space size={4}>
                        <MailOutlined className="tw:text-gray-400" />
                        <Text className="tw:text-sm">{email || "Chưa cập nhật"}</Text>
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
                    active: { color: "green", text: "Active" },
                    inactive: { color: "red", text: "Inactive" },
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
