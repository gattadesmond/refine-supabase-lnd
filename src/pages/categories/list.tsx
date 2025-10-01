import { BaseRecord } from "@refinedev/core";
import {
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  DateField,
  List,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";


export const CategoriesList = () => {
  const { tableProps } = useTable({
    resource: "categories",
    syncWithLocation: true,
    meta: {
      select: "*, categories_post_types(post_type_id, post_types(id, title))",
    },
  });

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        className="tw:rounded-lg tw:overflow-hidden"
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} categories`,
        }}
      >
        <Table.Column
          dataIndex="title"
          title="Title"
          className="tw:font-medium"
          render={(text: string) => (
            <span className="tw:text-gray-800 tw:font-semibold">
              {text}
            </span>
          )}
        />

        <Table.Column
          dataIndex="description"
          title="Description"
          ellipsis={{ showTitle: false }}
          render={(text: string) => (
            <span className="tw:text-gray-600">
              {text}
            </span>
          )}
        />

        <Table.Column
          dataIndex="categories_post_types"
          title="Types"
          render={(categoriesPostTypes: Array<{ post_type_id: number; post_types: { id: number; title: string } }>) => (
            <div className="tw:flex tw:flex-wrap tw:gap-1">
              {categoriesPostTypes && categoriesPostTypes.length > 0 ? (
                categoriesPostTypes.map((categoryPostType, index) => (
                  <Tag
                    key={index}
                    color="blue"
                    className="tw:rounded-full tw:px-3 tw:py-1"
                  >
                    {categoryPostType.post_types?.title || `Type ${categoryPostType.post_type_id}`}
                  </Tag>
                ))
              ) : (
                <Tag color="default" className="tw:rounded-full tw:px-3 tw:py-1">
                  No types
                </Tag>
              )}
            </div>
          )}
        />

        <Table.Column
          dataIndex={["created_at"]}
          title="Created At"
          render={(value: string) => (
            <DateField
              value={value}
              format="YYYY-MM-DD HH:mm"
              className="tw:text-gray-500"
            />
          )}
        />

        <Table.Column
          dataIndex={["updated_at"]}
          title="Updated At"
          render={(value: string) => (
            <DateField
              value={value}
              format="YYYY-MM-DD HH:mm"
              className="tw:text-gray-500"
            />
          )}
        />

        <Table.Column
          title="Actions"
          dataIndex="actions"
          width={120}
          render={(_, record: BaseRecord) => (
            <Space size="small">
              <EditButton
                hideText
                size="small"
                recordItemId={record.id}
                className="tw:bg-green-50 tw:border-green-200 tw:text-green-600 tw:hover:bg-green-100"
              />
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id}
                className="tw:bg-blue-50 tw:border-blue-200 tw:text-blue-600 tw:hover:bg-blue-100"
              />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                className="tw:bg-red-50 tw:border-red-200 tw:text-red-600 tw:hover:bg-red-100"
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
