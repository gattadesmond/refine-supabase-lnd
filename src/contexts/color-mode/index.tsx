import {
  type PropsWithChildren,
} from "react";
import { ConfigProvider, theme } from "antd";
import { RefineThemes } from "@refinedev/antd";

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { defaultAlgorithm } = theme;

  return (
    <ConfigProvider
      // you can change the theme colors here. example: ...RefineThemes.Magenta,
      theme={{
        ...RefineThemes.Blue,
        algorithm: defaultAlgorithm, // Always use light mode
      }}
    >
      {children}
    </ConfigProvider>
  );
};
