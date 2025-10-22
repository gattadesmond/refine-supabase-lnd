import {
  BaseRecord,
  getDefaultFilter,
  useGo,
} from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  DateField,
  FilterDropdown,
  CreateButton,
  ShowButton,
} from "@refinedev/antd";

import { Table, Space, Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const QuizzesList = () => {
  const { tableProps, filters } = useTable({
    resource: "quizzes",
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
          field: "title",
          operator: "contains",
          value: "",
        },
      ],
    },
  });

  const go = useGo();

  return (
    <List
      headerButtons={({ defaultButtons }) => (
        <Space>
          {defaultButtons}
        </Space>
      )}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="title"
          title="Tiêu đề Quiz"
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
              <Input placeholder="Tìm kiếm theo tiêu đề quiz" />
            </FilterDropdown>
          )}
          render={(value: string, record: BaseRecord) => {
            return (
              <div className="tw:flex tw:items-center tw:gap-3">
                <Typography.Link
                  onClick={() => {
                    if (record.id) {
                      go({
                        to: {
                          resource: "quizzes",
                          action: "edit",
                          id: record.id,
                        },
                        type: "push",
                      });
                    }
                  }}
                  className="tw:max-w-[300px] tw:overflow-hidden tw:text-ellipsis tw:whitespace-nowrap tw:font-semibold tw:text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
                >
                  {value}
                </Typography.Link>
              </div>
            );
          }}
        />
        
        <Table.Column
          dataIndex="description"
          title="Mô tả"
          render={(value: string) => (
            <div className="tw:max-w-[500px]">
              <Typography.Text
                ellipsis={{ tooltip: value }}
                className="tw:text-gray-600"
              >
                {value || "Chưa có mô tả"}
              </Typography.Text>
            </div>
          )}
        />
        
        <Table.Column
          dataIndex="created_at"
          title="Ngày tạo"
          render={(value: string) => (
            <div className="tw:whitespace-nowrap">
              <DateField value={value} format="DD/MM/YYYY HH:mm" />
            </div>
          )}
        />
        
        <Table.Column
          title=""
          dataIndex="actions"
          render={(_, record: BaseRecord) => {
            return (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <EditButton hideText size="small" recordItemId={record.id} />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};
