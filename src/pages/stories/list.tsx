import React from "react";
import { BaseRecord, getDefaultFilter, useNavigation } from "@refinedev/core";
import {
    useTable,
    List,
    EditButton,
    DateField,
    BooleanField,
    FilterDropdown,
} from "@refinedev/antd";

import { Table, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PostStatus } from "../../components/PostStatus";

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
                    render={(value: string) => <div className="tw-nowrap">{value}</div>}
                />

                <Table.Column
                    dataIndex={["categories_id"]}
                    title={<div className="tw:whitespace-nowrap">Chuyên mục</div>}
                    render={(value: string) => <div className="tw:whitespace-nowrap">{value}</div>}
                />
                <Table.Column
                    dataIndex={["created_at"]}
                    title={<div className="tw:whitespace-nowrap">Thời gian</div>}
                     render={(value: string) => <div className="tw:whitespace-nowrap"><DateField value={value} format="DD/MM/YYYY HH:mm"/></div>}
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
