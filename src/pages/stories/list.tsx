import React from "react";
import { BaseRecord, getDefaultFilter } from "@refinedev/core";
import {
    useTable,
    List,
    EditButton,
    ShowButton,
    DateField,
    BooleanField,
    MarkdownField,
    FilterDropdown,
} from "@refinedev/antd";

import { Table, Space, Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

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


    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="Id" render={(value: string) => <Typography.Text
                    style={{
                        whiteSpace: "nowrap",
                    }}
                >
                    #{value}
                </Typography.Text>} />

                <Table.Column
                    dataIndex="title"
                    title="Title"
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

                    render={(value: string) => {
                        return (
                            <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {value}
                            </div>
                        );
                    }}
                />
                <Table.Column
                    dataIndex={["created_at"]}
                    title="Created At"
                    render={(value: string) => <DateField value={value} />}
                />

                <Table.Column
                    dataIndex={["updated_at"]}
                    title="Updated At"
                    render={(value: string) => <DateField value={value} />}
                />

                <Table.Column dataIndex="description" title="Description" render={(value: string) => <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {value}
                </div>} />
                <Table.Column dataIndex="status" title="Status" />
                <Table.Column
                    dataIndex={["featured"]}
                    title="Featured"
                    render={(value: boolean) => <BooleanField value={value} />}
                />



                <Table.Column dataIndex="view_count" title="Lượt xem" />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
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
