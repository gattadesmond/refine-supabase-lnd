import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table } from "antd";
import React from "react";

export const BlogPostList = () => {
  const { result, tableProps } = useTable({
    syncWithLocation: true,
    meta: {
      select: "*",
    },
  });
  console.log("🚀 ~ BlogPostList ~ result:", result)
  console.log("🚀 ~ BlogPostList ~ tableProps:", tableProps)


  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column dataIndex="description" title={"Description"} />
       
      </Table>
    </List>
  );
};


