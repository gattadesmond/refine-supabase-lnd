import {
  BaseRecord,
  getDefaultFilter,
  useNavigation,
  useList,
} from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  DateField,
  BooleanField,
  FilterDropdown,
} from "@refinedev/antd";

import { Table, Space, Input, Button, Avatar } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PostStatus } from "../../components/PostStatus";

export const StoriesList = () => {
  const { tableProps, filters } = useTable({
    resource: "stories_overview",
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

  const { editUrl } = useNavigation();

  const {
    result: { data: categoriesData },
  } = useList({
    resource: "categories",
    meta: {
      select: "id, title",
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
              <a
                href={record.id ? editUrl("stories", record.id) : "#"}
                className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap tw:font-semibold tw:text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
              >
                {value}
              </a>
            );
          }}
        />
        <Table.Column
          dataIndex={["authors"]}
          title={<div className="tw:whitespace-nowrap">Tác giả</div>}
          render={(authors: { id: string; avatar_url: string }[]) => {
            return (
              <div className="tw:whitespace-nowrap">
                <Avatar.Group>
                  {authors.map((author) => (
                    <Avatar key={author.id} src={author.avatar_url} />
                  ))}
                </Avatar.Group>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex={["category_title"]}
          title={<div className="tw:whitespace-nowrap">Chuyên mục</div>}
          render={(category: string) => {
            const { id: categoryId } =
              categoriesData.find((cat) => cat.title === category) ?? {};
            return (
              <div className="tw:whitespace-nowrap">
                <Button
                  type="link"
                  color="default"
                  size="small"
                  className="tw:p-0 tw:h-auto tw:font-normal tw:!text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
                  href={categoryId ? editUrl("categories", categoryId) : "#"}
                  disabled={!categoryId}
                >
                  {category}
                </Button>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex={["created_at"]}
          title={<div className="tw:whitespace-nowrap">Thời gian</div>}
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

        <Table.Column dataIndex="view_count" title="View" />
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
