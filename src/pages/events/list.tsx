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
  BooleanField,
  FilterDropdown,
} from "@refinedev/antd";

import { Table, Space, Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PostStatus } from "../../components/PostStatus";

export const EventsList = () => {
  const { tableProps, filters } = useTable({
    resource: "events_overview",
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
              <Typography.Link
                onClick={() => {
                  if (record.id) {
                    go({
                      to: {
                        resource: "events",
                        action: "edit",
                        id: record.id,
                      },
                      type: "push",
                    });
                  }
                }}
                className="tw:max-w-[200px] tw:overflow-hidden tw:text-ellipsis tw:whitespace-nowrap tw:font-semibold tw:text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
              >
                {value}
              </Typography.Link>
            );
          }}
        />
        <Table.Column
          dataIndex={["category"]}
          title={<div className="tw:whitespace-nowrap">Chuyên mục</div>}
          render={(value) => {
            return (
              <div className="tw:whitespace-nowrap">
                {value?.slug ? (
                  <Typography.Link
                    onClick={() => {
                      go({
                        to: {
                          resource: "categories",
                          action: "edit",
                          id: value.id,
                        },
                        type: "push",
                      });
                    }}
                    className="tw:p-0 tw:h-auto tw:font-normal tw:!text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
                  >
                    {value?.title || "Chưa phân loại"}
                  </Typography.Link>
                ) : (
                  <span className="tw:text-gray-500">Chưa phân loại</span>
                )}
              </div>
            );
          }}
        />

        {/* <Table.Column
          dataIndex={["organizer_name"]}
          title={<div className="tw:whitespace-nowrap">Người tổ chức</div>}
          render={(organizerName: string) => {
            return (
              <div className="tw:whitespace-nowrap">
                {organizerName}
              </div>
            );
          }}
        />
       */}
        <Table.Column
          dataIndex={["start_at"]}
          title={<div className="tw:whitespace-nowrap">Ngày sự kiện</div>}
          render={(value: string) => (
            <div className="tw:whitespace-nowrap">
              <DateField value={value} format="DD/MM/YYYY HH:mm" />
            </div>
          )}
        />
        <Table.Column
          dataIndex={["location"]}
          title={<div className="tw:whitespace-nowrap">Địa điểm</div>}
          render={(location: string) => (
            <div className="tw:whitespace-nowrap">
              {location}
            </div>
          )}
        />
        <Table.Column
          dataIndex={["created_at"]}
          title={<div className="tw:whitespace-nowrap">Thời gian tạo</div>}
          render={(value: string) => (
            <div className="tw:whitespace-nowrap">
              <DateField value={value} format="DD/MM/YYYY HH:mm" />
            </div>
          )}
        />

        <Table.Column
          dataIndex={["status"]}
          title="Trạng thái"
          render={(value: string) => <PostStatus status={value} />}
        />
        <Table.Column
          dataIndex={["featured"]}
          title="Featured"
          render={(value: boolean) => <BooleanField value={value} />}
        />

        {/* <Table.Column dataIndex="view_count" title="View" /> */}
        <Table.Column
          title=""
          dataIndex="actions"
          render={(_, record: BaseRecord) => {
            return (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};