import React from "react";
import { BaseRecord, useMany } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DateField,
  ImageField,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export const LearningMaterialList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const {
    result: categoryData,
    query: { isLoading: categoryIsLoading },
  } = useMany({
    resource: "categories",
    ids:
      tableProps?.dataSource
        ?.map((item) => item?.category_id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="Id" />
        <Table.Column
          dataIndex={["created_at"]}
          title="Created At"
          render={(value: string) => <DateField value={value} />}
        />
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column
          dataIndex={["cover_image_url"]}
          title="Cover Image Url"
          render={(value: string) => (
            <ImageField style={{ maxWidth: "100px" }} value={value} />
          )}
        />
        <Table.Column dataIndex="status" title="Status" />
        <Table.Column
          dataIndex={["published_at"]}
          title="Published At"
          render={(value: string) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex={["updated_at"]}
          title="Updated At"
          render={(value: string) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex={["category_id"]}
          title="Category"
          render={(value) =>
            categoryIsLoading ? (
              <>Loading...</>
            ) : (
              categoryData?.data?.find((item) => item.id === value)?.title
            )
          }
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
