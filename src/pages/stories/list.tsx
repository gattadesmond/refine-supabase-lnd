import React from "react";
import { BaseRecord, getDefaultFilter, useNavigation, useMany } from "@refinedev/core";
import {
    useTable,
    List,
    EditButton,
    DateField,
    BooleanField,
    FilterDropdown,
} from "@refinedev/antd";

import { Table, Space, Input, Button } from "antd";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import { PostStatus } from "../../components/PostStatus";
import { compact } from "lodash";

export const StoriesList = () => {
    const { tableProps, filters } = useTable({
        syncWithLocation: false,
        filters: {
            initial: [
                {
                    field: "title",
                    operator: "contains",
                    value: "",
                },

            ],
        },
    });

    const { edit } = useNavigation();

    // Get member data for all stories
    const memberIds = compact(tableProps?.dataSource?.map((item) => item.member_id)) ?? [];

    const { result: membersData } = useMany({
        resource: "members",
        ids: memberIds,
        queryOptions: {
            enabled: memberIds.length > 0,
        },
    });

    // Get category data for all stories
    const categoryIds = compact(tableProps?.dataSource?.map((item) => item.categories_id)) ?? [];

    const { result: categoriesData } = useMany({
        resource: "categories",
        ids: categoryIds,
        queryOptions: {
            enabled: categoryIds.length > 0,
        },
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">


                <Table.Column
                    dataIndex="title"
                    title="Tiêu đề"
                    key="title"
                    filterIcon={(filtered) => (
                        <SearchOutlined
                            style={{
                                color: filtered ? "#1890ff" : undefined,
                            }}
                        />
                    )}
                    defaultFilteredValue={getDefaultFilter("title", filters, "contains")}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input placeholder="Search by title" />
                        </FilterDropdown>
                    )}

                    render={(value: string, record: BaseRecord) => {
                        return (
                            <div
                                className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap tw:font-semibold tw:cursor-pointer tw:text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
                                onClick={() => record.id && edit("stories", record.id)}
                            >
                                {value}
                            </div>
                        );
                    }}
                />
                <Table.Column
                    dataIndex={["member_id"]}
                    title={<div className="tw:whitespace-nowrap">Tác giả</div>}
                    render={(value: string) => {
                        const member = membersData?.data?.find((item) => item.id === value);
                        if (!member) {
                            return <div className="tw:whitespace-nowrap tw:text-gray-400">...</div>;
                        }
                        return (
                            <div className="tw:whitespace-nowrap">
                                <Button
                                    type="link"
                                    size="small"
                                   className="tw:p-0 tw:h-auto tw:font-normal tw:!text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
                                    onClick={() => edit("members", value)}
                                >
                                    {member.name}
                                </Button>
                            </div>
                        );
                    }}
                />

                <Table.Column
                    dataIndex={["categories_id"]}
                    title={<div className="tw:whitespace-nowrap">Chuyên mục</div>}
                    render={(value: string) => {
                        const category = categoriesData?.data?.find((item) => item.id === value);
                        if (!category) {
                            return <div className="tw:whitespace-nowrap tw:text-gray-400">...</div>;
                        }
                        return (
                            <div className="tw:whitespace-nowrap">
                                <Button
                                    type="link"
                                    color="default"
                                    size="small"
                                    className="tw:p-0 tw:h-auto tw:font-normal tw:!text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
                                    onClick={() => edit("categories", value)}
                                >
                                    {category.title}
                                </Button>
                            </div>
                        );
                    }}
                />
                <Table.Column
                    dataIndex={["created_at"]}
                    title={<div className="tw:whitespace-nowrap">Thời gian</div>}
                    render={(value: string) => <div className="tw:whitespace-nowrap"><DateField value={value} format="DD/MM/YYYY HH:mm" /></div>}
                />


                <Table.Column
                    dataIndex="status"
                    title="Trạng thái"
                    render={(value: string) => <PostStatus status={value} />}
                />
                <Table.Column
                    dataIndex={["featured"]}
                    title="Featured"
                    render={(value: boolean) => <BooleanField value={value} />}
                />



                <Table.Column dataIndex="view_count" title="View" />
                <Table.Column
                    title=""
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />

                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
