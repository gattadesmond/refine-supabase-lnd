import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Create, SaveButton, useForm } from "@refinedev/antd";
import { HttpError, useCreateMany, useDeleteMany, useList, useCreate } from "@refinedev/core";
import { Button, Card, Divider, Form, Select, Typography, Input } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragOutlined } from "@ant-design/icons";
import slugify from "slugify";
import UploadImage from "../../components/UploadImage";

// Types
type Course = {
  id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  published: boolean;
};

type CourseLearningRow = {
  id: number;
  position: number;
  learnings_id: number;
  course_id: number;
  learnings?: {
    id: number;
    title: string;
  };
};

const ITEM_TYPE = "COURSE_LEARNING";

// Sortable Item Component
interface SortableItemProps {
  row: CourseLearningRow;
  index: number;
  onRemove: (rowId: number) => void;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ row, index, onRemove, moveItem }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: () => ({ id: row.id, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem: { id: number; index: number }, monitor) => {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      // Only move when mouse crosses 50% of item height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`tw:flex tw:items-center tw:justify-between tw:gap-3 tw:bg-white tw:border tw:border-gray-200 tw:rounded-md tw:px-3 tw:py-2 tw:cursor-move tw:transition-all tw:duration-200 ${isDragging ? "tw:opacity-50" : ""
        }`}
    >
      <div className="tw:flex tw:items-center tw:gap-3 tw:min-w-0">
        <DragOutlined className="tw:text-gray-400 tw:cursor-move tw:hover:text-gray-600" />
        <span className="tw-truncate tw:font-medium">
          {row.learnings?.title || `Learning #${row.learnings_id}`}
        </span>
      </div>
      <Button size="small" danger onClick={() => onRemove(row.id)}>
        Xóa
      </Button>
    </div>
  );
};

// Main Component
export const CoursesCreate = () => {
  const { saveButtonProps, formProps, form } = useForm<Course, HttpError, Course>({
    resource: "courses",
    redirect: "edit",
  });

  const [ordered, setOrdered] = useState<CourseLearningRow[]>([]);
  const [addForm] = Form.useForm<{ learningId?: number }>();
  const [courseId, setCourseId] = useState<number | null>(null);

  // Watch name changes and auto-generate slug
  const name = Form.useWatch("name", form);
  const slug = Form.useWatch("slug", form);

  useEffect(() => {
    if (name && form) {
      const autoSlug = slugify(name, {
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      });
      form.setFieldValue("slug", autoSlug);
    }
  }, [name, form]);

  // API Hooks
  const availableLearnings = useList<{ id: number; title: string }>({
    resource: "learnings",
    pagination: { pageSize: 1000 },
    sorters: [{ field: "created_at", order: "desc" }],
    meta: { select: "id,title" },
  });

  const { mutate: createCourse } = useCreate();
  const { mutate: createMany } = useCreateMany();
  const { mutate: deleteMany } = useDeleteMany();

  // Computed values
  const selectedLearningIds = useMemo(
    () => new Set(ordered.map(r => r.learnings_id)),
    [ordered]
  );

  const selectableOptions = useMemo(() => {
    const list = availableLearnings.result?.data ?? [];
    return list
      .filter(l => !selectedLearningIds.has(l.id))
      .map(l => ({ label: l.title, value: l.id }));
  }, [availableLearnings.result?.data, selectedLearningIds]);

  // Event Handlers
  const handleAddSelected = useCallback(() => {
    const values = addForm.getFieldsValue();
    const learningId = values.learningId;
    if (!learningId) return;

    const selectedLearning = availableLearnings.result?.data?.find(l => l.id === learningId);
    if (!selectedLearning) return;

    const newItem: CourseLearningRow = {
      id: -Date.now(), // Temporary ID
      course_id: courseId || 0,
      learnings_id: learningId,
      position: ordered.length + 1,
      learnings: { id: selectedLearning.id, title: selectedLearning.title },
    };

    setOrdered(prev => [...prev, newItem]);
    addForm.resetFields();
  }, [addForm, courseId, ordered.length, availableLearnings.result?.data]);

  const handleRemove = useCallback((rowId: number) => {
    setOrdered(prev => prev.filter(item => item.id !== rowId));
  }, []);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setOrdered(prev => {
      const newOrdered = [...prev];
      const draggedItem = newOrdered[dragIndex];
      newOrdered.splice(dragIndex, 1);
      newOrdered.splice(hoverIndex, 0, draggedItem);
      return newOrdered;
    });
  }, []);

  const handleSaveOrder = useCallback(() => {
    if (!courseId) return;

    const newItems = ordered.filter(item => item.id < 0);
    const promises: Promise<unknown>[] = [];

    // Create new items
    if (newItems.length > 0) {
      const createPromise = new Promise((resolve, reject) => {
        createMany(
          {
            resource: "course_learnings",
            values: newItems.map(item => ({
              course_id: courseId,
              learnings_id: item.learnings_id,
              position: ordered.indexOf(item) + 1,
            })),
          },
          {
            onSuccess: () => resolve("created"),
            onError: (error: HttpError) => reject(error),
          }
        );
      });
      promises.push(createPromise);
    }

    Promise.all(promises)
      .then(() => {
        console.log("✅ All changes saved successfully");
      })
      .catch(error => {
        console.error("❌ Error saving changes:", error);
      });
  }, [courseId, ordered, createMany]);

  // Handle form submission
  const handleFormSubmit = useCallback(async (values: Course) => {
    try {
      // First create the course
      const courseResult = await new Promise<{ data: { id: number } }>((resolve, reject) => {
        createCourse(
          {
            resource: "courses",
            values: {
              name: values.name,
              slug: values.slug,
              description: values.description,
              thumbnail_url: values.thumbnail_url,
              published: values.published,
            },
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        );
      });

      const newCourseId = courseResult.data.id;
      setCourseId(newCourseId);

      // Then create course learnings if any
      if (ordered.length > 0) {
        await new Promise((resolve, reject) => {
          createMany(
            {
              resource: "course_learnings",
              values: ordered.map((item, index) => ({
                course_id: newCourseId,
                learnings_id: item.learnings_id,
                position: index + 1,
              })),
            },
            {
              onSuccess: () => resolve("created"),
              onError: (error: HttpError) => reject(error),
            }
          );
        });
      }

      console.log("✅ Course and lessons created successfully");
    } catch (error) {
      console.error("❌ Error creating course:", error);
    }
  }, [createCourse, createMany, ordered]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Create saveButtonProps={saveButtonProps} title={<span>Tạo khóa học mới</span>}>
        <Form<Course> {...formProps} layout="vertical" onFinish={handleFormSubmit}>

          <div className="tw:grid tw:grid-cols-[1fr_300px] tw:gap-8 tw:mb-8">
            {/* Course Basic Info */}
            <div>
              <Card title="Thông tin cơ bản" className="tw:mb-6">

                <Form.Item
                  label="Tên khóa học"
                  name={["name"]}
                  rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
                >
                  <Input size="large" className="tw:font-semibold" />
                </Form.Item>

                <div className="tw:text-gray-600 tw:-mt-4 tw:mb-4 tw:text-xs">
                  URL khóa học: <span className="tw:font-mono">{slug || ""}</span>
                </div>



                <Form.Item
                  label="Trạng thái"
                  name={["published"]}
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                  className="tw:max-w-[200px]"
                  initialValue="draft"
                >
                  <Select>
                    <Select.Option value="draft">Bản nháp</Select.Option>
                    <Select.Option value="published">Xuất bản</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  className="tw:hidden"
                  label="Đường dẫn khóa học"
                  name={["slug"]}
                  rules={[{ required: true }]}
                  extra="URL slug được tự động tạo từ tên khóa học"
                >
                  <Input className="tw:font-mono tw:text-sm" disabled />
                </Form.Item>

                <Form.Item
                  label="Mô tả khóa học"
                  name={["description"]}
                  rules={[{ required: false }]}
                >
                  <Input.TextArea rows={3} placeholder="Nhập mô tả ngắn về khóa học..." />
                </Form.Item>
              </Card>
            </div>

            {/* Course Settings */}
            <div>
              <div className="tw:mb-6">
                <SaveButton {...saveButtonProps} className="tw:w-full">
                  Tạo khóa học
                </SaveButton>
              </div>

              <Form.Item
                label="Hình ảnh đại diện"
                name={["thumbnail_url"]}
                rules={[{ required: false }]}
              >
                <UploadImage />
              </Form.Item>
            </div>
          </div>

          {/* Course Lessons Management */}
          <div className="tw:grid tw:grid-cols-[1fr_340px] tw:gap-8">
            {/* Course Lessons List */}
            <div>
              <Card
                title={
                  <div className="tw:flex tw:justify-between tw:items-center">
                    <span className="tw:font-semibold">Danh sách bài học trong khóa</span>
                    {ordered.length > 0 && courseId && (
                      <Button type="primary" onClick={handleSaveOrder}>
                        Lưu thay đổi
                      </Button>
                    )}
                  </div>
                }
              >
                <div className="tw:gap-3 tw:grid tw:grid-cols-1">
                  {ordered.map((row, index) => (
                    <SortableItem
                      key={row.id}
                      row={row}
                      index={index}
                      onRemove={handleRemove}
                      moveItem={moveItem}
                    />
                  ))}
                  {ordered.length === 0 && (
                    <Typography.Text type="secondary">Chưa có học liệu nào trong khóa.</Typography.Text>
                  )}
                </div>
              </Card>
            </div>

            {/* Add Lesson Form */}
            <div>
              <Card title="Thêm bài học vào khóa">
                <Form form={addForm} layout="vertical" onFinish={handleAddSelected}>
                  <Form.Item name={["learningId"]} label="Chọn bài học" rules={[{ required: false }]}>
                    <Select
                      allowClear
                      placeholder="Chọn từ danh sách learnings"
                      options={selectableOptions}
                      className="tw:w-full"
                    />
                  </Form.Item>
                  <div className="tw:flex tw:justify-end">
                    <Button type="primary" onClick={handleAddSelected}>
                      Thêm vào khóa học
                    </Button>
                  </div>
                </Form>
                <Divider />
                <Typography.Paragraph className="tw:text-xs tw:text-gray-500">
                  Kéo thả các mục bên trái để thay đổi thứ tự, sau đó nhấn "Lưu thay đổi".
                </Typography.Paragraph>
              </Card>
            </div>
          </div>
        </Form>
      </Create>
    </DndProvider>
  );
};
