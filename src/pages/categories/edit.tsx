import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useCreateMany, useDeleteMany, useUpdate } from "@refinedev/core";
import { Form, Input, Select } from "antd";

export const CategoryEdit = () => {
  const { formProps, saveButtonProps, onFinish } = useForm({
    meta: {
      select: "*, types:categories_post_types(value:post_type_id, id)",
    },
  });

  const { mutate: createCategoriesPostTypes } = useCreateMany({
    resource: "categories_post_types",
  });

  const { mutate: updateCategoriesPostTypes } = useUpdate({
    resource: "categories_post_types",
  });

  const { mutate: deleteCategoriesPostTypes } = useDeleteMany();

  const handleOnFinish = (values: {
    types?: ({ value: number; id: string } | number)[];
  }) => {
    onFinish({
      ...values,
      types: undefined,
    });

    // Handle create/update categories_post_types
    const defaultTypes =
      (formProps.initialValues?.types as { value: number; id: string }[]) ?? [];
    const chosenTypes = (values.types ?? []).map((type) =>
      typeof type === "object" ? type.value : type
    );
    const removedTypes = defaultTypes.filter(
      ({ value }) => !chosenTypes.includes(value)
    );
    const addedTypes = chosenTypes.filter(
      (value) =>
        !defaultTypes.some(({ value: initialValue }) => initialValue === value)
    );
    if (removedTypes.length >= addedTypes.length) {
      removedTypes.slice(0, addedTypes.length).forEach(({ id }, idx) => {
        updateCategoriesPostTypes({
          id,
          values: {
            post_type_id: addedTypes[idx],
          },
        });
      });
      const rest = removedTypes.slice(addedTypes.length);
      if (rest.length) {
        deleteCategoriesPostTypes({
          resource: "categories_post_types",
          ids: rest.map(({ id }) => id),
        });
      }
    } else {
      addedTypes.slice(0, removedTypes.length).forEach((post_type_id, idx) => {
        updateCategoriesPostTypes({
          id: removedTypes[idx].id,
          values: {
            post_type_id,
          },
        });
      });
      const rest = addedTypes.slice(removedTypes.length);
      if (rest.length) {
        createCategoriesPostTypes({
          values: addedTypes.slice(removedTypes.length).map((value) => ({
            post_type_id: value,
            category_id: formProps.initialValues?.id,
          })),
        });
      }
    }
  };

  const { selectProps } = useSelect({
    resource: "post_types",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item
          label="Id"
          name={["id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item
          label="Title"
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name={["description"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Types" name={["types"]}>
          <Select mode="multiple" {...selectProps} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
