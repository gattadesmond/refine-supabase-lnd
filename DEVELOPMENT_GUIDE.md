# Development Guide

## Quy tắc phát triển dự án

### 1. Refine Framework
- Luôn tham khảo [Refine Documentation](https://refine.dev/docs/) khi implement features
- Sử dụng Refine hooks và components có sẵn
- Tuân theo patterns của Refine cho CRUD operations

### 2. UI Components - Ant Design
- **BẮT BUỘC**: Sử dụng Ant Design components cho tất cả UI elements
- Không tự tạo custom components khi Ant Design đã có sẵn

#### Các components thường dùng:
```tsx
// Forms
import { Form, Input, Select, DatePicker, Switch, Upload } from "antd";

// Layout
import { Layout, Row, Col, Card, Divider, Space } from "antd";

// Data Display
import { Table, List, Descriptions, Tag, Badge, Avatar } from "antd";

// Feedback
import { Modal, Message, Notification, Alert, Spin } from "antd";

// Navigation
import { Menu, Breadcrumb, Pagination, Steps } from "antd";

// Other
import { Button, Icon, Tooltip, Popconfirm, Drawer } from "antd";
```

### 3. Styling - Tailwind CSS với prefix `tw-`
- **SỬ DỤNG** Tailwind với prefix `tw-` cho:
  - Layout và spacing (padding, margin, width, height)
  - Grid và flexbox
  - Colors và backgrounds
  - Typography
  - Borders và shadows
  - Responsive design

#### ✅ Đúng cách:
```tsx
<div className="tw-p-4 tw-bg-white tw-rounded-lg tw-shadow-md">
  <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-4">
    Tiêu đề
  </h1>
  <div className="tw-flex tw-justify-between tw-items-center">
    <p className="tw-text-gray-600">Nội dung</p>
    <Button type="primary">Action</Button>
  </div>
</div>
```

#### ❌ Sai cách:
```tsx
// Không dùng CSS classes thường
<div className="p-4 bg-white">

// Không dùng Tailwind cho component styling
<Table className="tw-bg-white tw-border" />

// Không tự tạo components khi Ant Design có sẵn
<button>Click me</button> // Dùng <Button> từ antd
```

### 4. Cấu trúc file Refine
```
src/pages/[resource]/
├── list.tsx      // Danh sách với Table
├── create.tsx    // Form tạo mới
├── edit.tsx      // Form chỉnh sửa
├── show.tsx      // Chi tiết
└── index.ts      // Export
```

### 5. Ví dụ hoàn chỉnh

#### List Component:
```tsx
import { List, useTable, CreateButton, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Card, Space } from "antd";

export const CategoriesList = () => {
  const { tableProps } = useTable();

  return (
    <div className="tw-p-6">
      <Card className="tw-shadow-lg">
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
          <h1 className="tw-text-3xl tw-font-bold tw-text-gray-800">
            Danh mục
          </h1>
          <CreateButton />
        </div>
        
        <Table 
          {...tableProps} 
          rowKey="id"
          className="tw-rounded-lg tw-overflow-hidden"
        >
          <Table.Column dataIndex="name" title="Tên" />
          <Table.Column dataIndex="description" title="Mô tả" />
          <Table.Column
            title="Hành động"
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </Card>
    </div>
  );
};
```

#### Create/Edit Form:
```tsx
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Button, Card } from "antd";

export const CategoriesCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <div className="tw-p-6">
      <Card className="tw-shadow-lg tw-max-w-2xl">
        <h1 className="tw-text-2xl tw-font-bold tw-mb-6">
          Tạo danh mục mới
        </h1>
        
        <Form {...formProps} layout="vertical" className="tw-space-y-4">
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          
          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Nhập mô tả danh mục" 
            />
          </Form.Item>
          
          <div className="tw-flex tw-justify-end tw-space-x-2">
            <Button>Hủy</Button>
            <Button type="primary" {...saveButtonProps}>
              Lưu
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
```

### 6. Lưu ý quan trọng
- Luôn sử dụng TypeScript interfaces cho data types
- Implement proper error handling với Refine error components
- Sử dụng Refine's built-in authentication và authorization
- Tuân theo responsive design với Tailwind breakpoints
- Test trên các devices khác nhau

### 7. Resources hữu ích
- [Refine Documentation](https://refine.dev/docs/)
- [Ant Design Components](https://ant.design/components/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Refine Examples](https://refine.dev/docs/examples/)
