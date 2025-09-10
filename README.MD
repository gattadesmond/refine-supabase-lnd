# Refine + Ant Design + Tailwind CSS Project

<div align="center" style="margin: 30px;">
    <a href="https://refine.dev">
    <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
    </a>
</div>
<br/>

This [Refine](https://github.com/refinedev/refine) project uses:
- **Refine** - React framework for building admin panels
- **Ant Design** - UI component library
- **Tailwind CSS** - Utility-first CSS framework (with `tw-` prefix)
- **Supabase** - Backend as a Service
- **TypeScript** - Type safety

## Tech Stack

- **Framework**: Refine v5
- **UI Library**: Ant Design v5
- **Styling**: Tailwind CSS v4 (with `tw-` prefix)
- **Backend**: Supabase
- **Language**: TypeScript
- **Build Tool**: Vite

## Getting Started

A React Framework for building internal tools, admin panels, dashboards & B2B apps with unmatched flexibility ✨

Refine's hooks and components simplifies the development process and eliminates the repetitive tasks by providing industry-standard solutions for crucial aspects of a project, including authentication, access control, routing, networking, state management, and i18n.

## Development Rules

### UI Components
- **Use Ant Design components** for all UI elements (forms, tables, buttons, etc.)
- **Use Tailwind CSS with `tw-` prefix** for layout, spacing, and styling
- **Follow Refine patterns** for data fetching and state management

### Example Usage
```tsx
import { List, useTable, CreateButton } from "@refinedev/antd";
import { Table, Card, Row, Col } from "antd";

export const MyList = () => {
  const { tableProps } = useTable();
  
  return (
    <div className="tw-p-4">
      <Card className="tw-shadow-lg">
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
          <h2 className="tw-text-2xl tw-font-bold">My Resources</h2>
          <CreateButton />
        </div>
        <Table {...tableProps} />
      </Card>
    </div>
  );
};
```

## Available Scripts

### Running the development server.

```bash
    yarn dev
```

### Building for production.

```bash
    yarn build
```

### Running the production server.

```bash
    yarn start
```

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **Supabase Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Ant Design** [Docs](https://refine.dev/docs/ui-frameworks/antd/tutorial/)
- **React Router** [Docs](https://refine.dev/docs/core/providers/router-provider/)

## License

MIT
