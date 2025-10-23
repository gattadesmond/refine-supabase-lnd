import React, { useCallback, useEffect, useMemo, useState, createContext, useContext } from "react";
import { Edit, SaveButton, useForm, DeleteButton } from "@refinedev/antd";
import { HttpError, useCreateMany, useDeleteMany, useList, useUpdate, useGo } from "@refinedev/core";
import { Button, Card, Divider, Form, Select, Typography, Input, List } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import type { DragEndEvent, DraggableAttributes } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import slugify from "slugify";
import UploadImage from "../../components/UploadImage";

// Types
type Course = {
  id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  status: string;
};

type CourseLearningRow = {
  id: number;
  position: number;
  learnings_id: number;
  course_id: number;
  quiz_id?: number;
  learnings?: {
    id: number;
    title: string;
  };
  quiz?: {
    id: number;
    title: string;
  };
};

// ============================================================================
// SORTABLE LIST ITEM CONTEXT
// ============================================================================

interface SortableListItemContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
}

const SortableListItemContext = createContext<SortableListItemContextProps>({});

// ============================================================================
// DRAG HANDLE COMPONENT
// ============================================================================

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners, attributes } = useContext(SortableListItemContext);
  
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
    />
  );
};

// ============================================================================
// SORTABLE LIST ITEM COMPONENT
// ============================================================================

interface SortableListItemProps {
  row: CourseLearningRow;
  onRemove: (rowId: number) => void;
  onQuizChange: (rowId: number, quizId: number | undefined) => void;
  quizOptions: { label: string; value: number }[];
}

const SortableListItem: React.FC<SortableListItemProps> = ({ row, onRemove, onQuizChange, quizOptions }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const listStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const memoizedValue = useMemo<SortableListItemContextProps>(
    () => ({ setActivatorNodeRef, listeners, attributes }),
    [setActivatorNodeRef, listeners, attributes],
  );

  return (
    <SortableListItemContext.Provider value={memoizedValue}>
      <List.Item
        ref={setNodeRef}
        style={listStyle}
        className={`tw:border-b tw:border-gray-100 tw:last:border-b-0 ${isDragging ? "tw:opacity-50" : ""}`}
        actions={[
          <Button key="remove" size="small" danger onClick={() => onRemove(row.id)}>
            Xóa
          </Button>
        ]}
      >
        <div className="tw:flex tw:items-center tw:gap-3 tw:min-w-0 tw:w-full">
          <DragHandle />
          <div className="tw:flex-1 tw:min-w-0">
            <div className="tw:font-medium tw:mb-2">
              {row.learnings?.title || `Learning #${row.learnings_id}`}
            </div>
            <Select
              size="small"
              className="tw:max-w-[250px]"
              placeholder="Chọn quiz (tùy chọn)"
              value={row.quiz_id || undefined}
              onChange={(value) => onQuizChange(row.id, value)}
              allowClear
              options={[
                ...quizOptions
              ]}
            />
          </div>
        </div>
      </List.Item>
    </SortableListItemContext.Provider>
  );
};

// Main Component
export const CoursesEdit = () => {
  const { saveButtonProps, query: queryResult, formProps, form } = useForm<Course, HttpError, Course>({
    resource: "courses",
    redirect: false,
  });


  const courseId = queryResult?.data?.data?.id as number | undefined;
  const [ordered, setOrdered] = useState<CourseLearningRow[]>([]);
  const [addForm] = Form.useForm<{ learningId?: number }>();

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
  const courseLearnings = useList<CourseLearningRow>({
    resource: "course_learnings",
    filters: [{ field: "course_id", operator: "eq", value: courseId }],
    sorters: [{ field: "position", order: "asc" }],
    meta: { select: "id,position,learnings_id,course_id,quiz_id,learnings:learnings_id(id,title),quiz:quiz_id(id,title)" },
    queryOptions: { enabled: !!courseId },
  });

  const availableLearnings = useList<{ id: number; title: string }>({
    resource: "learnings",
    pagination: { pageSize: 1000 },
    sorters: [{ field: "created_at", order: "desc" }],
    meta: { select: "id,title" },
  });

  const availableQuizzes = useList<{ id: number; title: string }>({
    resource: "quizzes",
    pagination: { pageSize: 1000 },
    sorters: [{ field: "created_at", order: "desc" }],
    meta: { select: "id,title" },
  });

  const { mutate: createMany } = useCreateMany();
  const { mutate: deleteMany } = useDeleteMany();
  const { mutate: update } = useUpdate();
  const go = useGo();

  // Sync data from API to local state
  useEffect(() => {
    const rows = courseLearnings.result?.data ?? [];
    setOrdered(rows.slice().sort((a, b) => a.position - b.position));
  }, [courseLearnings.result?.data]);

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

  const quizOptions = useMemo(() => {
    const list = availableQuizzes.result?.data ?? [];
    return list.map(q => ({ label: q.title, value: q.id }));
  }, [availableQuizzes.result?.data]);

  // Event Handlers
  const handleAddSelected = useCallback(() => {
    const values = addForm.getFieldsValue();
    const learningId = values.learningId;
    if (!courseId || !learningId) return;

    const selectedLearning = availableLearnings.result?.data?.find(l => l.id === learningId);
    if (!selectedLearning) return;

    const newItem: CourseLearningRow = {
      id: -Date.now(), // Temporary ID
      course_id: courseId,
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

  const handleQuizChange = useCallback((rowId: number, quizId: number | undefined) => {
    setOrdered(prev => prev.map(item => 
      item.id === rowId 
        ? { ...item, quiz_id: quizId }
        : item
    ));
  }, []);

  const onDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    if (!active || !over) {
      return;
    }
    if (active.id !== over.id) {
      setOrdered((prevState) => {
        const activeIndex = prevState.findIndex((item) => item.id === active.id);
        const overIndex = prevState.findIndex((item) => item.id === over.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  }, []);

  const handleSaveOrder = useCallback(() => {
    if (!courseId) return;

    const newItems = ordered.filter(item => item.id < 0);
    const existingItems = ordered.filter(item => item.id > 0);
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
              quiz_id: item.quiz_id || null,
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

    // Update existing items
    if (existingItems.length > 0) {
      const updatePromises = existingItems.map(item =>
        new Promise((resolve, reject) => {
          update(
            {
              resource: "course_learnings",
              id: item.id,
              values: { 
              position: ordered.indexOf(item) + 1,
              quiz_id: item.quiz_id || null
            },
            },
            {
              onSuccess: () => resolve(item),
              onError: (error: HttpError) => reject(error),
            }
          );
        })
      );
      promises.push(...updatePromises);
    }

    // Delete removed items
    const currentIds = ordered.map(item => item.id);
    const originalIds = courseLearnings.result?.data?.map(item => item.id) || [];
    const itemsToDelete = originalIds.filter(id => !currentIds.includes(id));

    if (itemsToDelete.length > 0) {
      const deletePromise = new Promise((resolve, reject) => {
        deleteMany(
          { resource: "course_learnings", ids: itemsToDelete },
          {
            onSuccess: () => resolve("deleted"),
            onError: (error: HttpError) => reject(error),
          }
        );
      });
      promises.push(deletePromise);
    }

    Promise.all(promises)
      .then(() => {
        console.log("✅ All changes saved successfully");
        courseLearnings.query.refetch();
      })
      .catch(error => {
        console.error("❌ Error saving changes:", error);
      });
  }, [courseId, ordered, createMany, update, deleteMany, courseLearnings.query, courseLearnings.result?.data]);

  // Handle delete success - redirect to list page
  const handleDeleteSuccess = useCallback(() => {
    go({ to: "/courses" });
  }, [go]);

  return (
    <Edit saveButtonProps={saveButtonProps} footerButtons={<></>} title={<span>Chỉnh sửa khóa học</span>}>
        <Form<Course> {...formProps} layout="vertical">

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

                {/* <Form.Item
                  label="Trạng thái"
                  name={["published"]}
                  valuePropName="checked"
                  rules={[{ required: false }]}
                >
                  <Switch checkedChildren="Xuất bản" unCheckedChildren="Bản nháp" />
                </Form.Item> */}


                <Form.Item
                  label="Trạng thái"
                  name={["status"]}
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                  className="tw:max-w-[200px]"
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
              <div className="tw:mb-6  tw:flex tw:flex-nowrap tw:gap-4">
                <DeleteButton 
                  recordItemId={courseId}
                  onSuccess={handleDeleteSuccess}
                  confirmTitle="Xác nhận xóa khóa học"
                  confirmOkText="Xóa"
                  confirmCancelText="Hủy"
                  className="tw:flex-shrink-0"
                />

                <SaveButton {...saveButtonProps} className="tw:w-full">
                  Lưu
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
        </Form>
        {/* Course Lessons Management */}
        <div className="tw:grid tw:grid-cols-[1fr_340px] tw:gap-8">
          {/* Course Lessons List */}
          <div>
            <Card
              title={
                <div className="tw:flex tw:justify-between tw:items-center">
                  <span className="tw:font-semibold">Danh sách bài học trong khóa</span>
                  {ordered.length > 0 && (
                    <Button type="primary" onClick={handleSaveOrder}>
                      Lưu thay đổi
                    </Button>
                  )}
                </div>
              }
            >
              <DndContext
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={onDragEnd}
                id="course-learnings-drag-sorting"
              >
                <SortableContext items={ordered.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                  <List
                    dataSource={ordered}
                    renderItem={(row) => (
                      <SortableListItem
                        key={row.id}
                        row={row}
                        onRemove={handleRemove}
                        onQuizChange={handleQuizChange}
                        quizOptions={quizOptions}
                      />
                    )}
                    locale={{
                      emptyText: (
                        <div className="tw:text-center tw:py-8">
                          <Typography.Text type="secondary">
                            Chưa có bài viết nào trong khóa.
                          </Typography.Text>
                        </div>
                      )
                    }}
                  />
                </SortableContext>
              </DndContext>
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

      </Edit>
  );
};