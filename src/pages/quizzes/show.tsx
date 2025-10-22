import { Show, TextField, DateField } from "@refinedev/antd";
import { Typography, Space, Card } from "antd";

const { Title, Paragraph } = Typography;

export const QuizzesShow = () => {
  return (
    <Show>
      <Title level={4}>Thông tin Quiz</Title>
      <Space direction="vertical" size="large" className="tw:w-full">
        <Card>
          <Space direction="vertical" size="middle" className="tw:w-full">
            <div>
              <Title level={5}>Tiêu đề:</Title>
              <TextField value="title" />
            </div>
            
            <div>
              <Title level={5}>Mô tả:</Title>
              <TextField value="description" />
            </div>
            
            <div>
              <Title level={5}>Ngày tạo:</Title>
              <DateField value="created_at" format="DD/MM/YYYY HH:mm" />
            </div>
          </Space>
        </Card>
      </Space>
    </Show>
  );
};
