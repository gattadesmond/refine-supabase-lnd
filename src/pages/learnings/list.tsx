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
  ShowButton,
  DateField,
  ImageField,
  FilterDropdown,
} from "@refinedev/antd";

import { Table, Space, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PostStatus } from "../../components/PostStatus";

export const LearningMaterialList = () => {
  const { tableProps, filters } = useTable({
    resource: "learnings",
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
              <Input placeholder="Tìm kiếm theo tiêu đề" />
            </FilterDropdown>
          )}
          render={(value: string, record: BaseRecord) => {
            return (
              <a
                href={record.id ? editUrl("learnings", record.id) : "#"}
                className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap tw:font-semibold tw:text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
              >
                {value}
              </a>
            );
          }}
        />
        
        <Table.Column
          dataIndex={["cover_image_url"]}
          title={<div className="tw:whitespace-nowrap">Ảnh bìa</div>}
          render={(value: string) => (
            <div className="tw:whitespace-nowrap">
              <ImageField 
                style={{ maxWidth: "60px", maxHeight: "40px", borderRadius: "4px" }} 
                value={value} 
              />
            </div>
          )}
        />

        <Table.Column
          dataIndex={["category_id"]}
          title={<div className="tw:whitespace-nowrap">Chuyên mục</div>}
          render={(value) => {
            const category = categoriesData?.find((item) => item.id === value);
            return (
              <div className="tw:whitespace-nowrap">
                <Button
                  type="link"
                  color="default"
                  size="small"
                  className="tw:p-0 tw:h-auto tw:font-normal tw:!text-sky-500 tw:hover:text-sky-700 tw:hover:underline"
                  href={value ? editUrl("categories", value) : "#"}
                  disabled={!value}
                >
                  {category?.title || "Chưa phân loại"}
                </Button>
              </div>
            );
          }}
        />

        <Table.Column
          dataIndex={["status"]}
          title="Trạng thái"
          render={(value: string) => <PostStatus status={value} />}
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
          dataIndex={["published_at"]}
          title={<div className="tw:whitespace-nowrap">Thời gian xuất bản</div>}
          render={(value: string) => (
            <div className="tw:whitespace-nowrap">
              {value ? <DateField value={value} format="DD/MM/YYYY HH:mm" /> : "-"}
            </div>
          )}
        />

        <Table.Column
          title=""
          dataIndex="actions"
          render={(_, record: BaseRecord) => {
            return (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};
