import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Embed from "@editorjs/embed";
import Raw from "@editorjs/raw";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";

// @ts-expect-error - No type definitions available
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import Delimiter from "@editorjs/delimiter";
import Warning from "@editorjs/warning";
// @ts-expect-error - No type definitions available
import Checklist from "@editorjs/checklist";
import NestedList from "@editorjs/nested-list";
import ImageTool from "@editorjs/image";

// @ts-expect-error - No type definitions available
import SimpleImage from "./plugins/simple-image/index.js";


interface EditorJSProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
}

// Type for EditorJS tools to avoid using 'any'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorJSTool = any;

// EditorJS tools configuration - tách ra để tránh trùng lặp code
const EDITOR_TOOLS = {
  // Block tools
  header: {
    class: Header as EditorJSTool,
    inlineToolbar: true,
    config: {
      placeholder: "Nhập tiêu đề...",
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
  },
  list: {
    class: NestedList as EditorJSTool,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  paragraph: {
    class: Paragraph as EditorJSTool,
    inlineToolbar: true,
    config: {
      placeholder: "Nhập nội dung...",
    },
  },
  quote: {
    class: Quote as EditorJSTool,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Nhập trích dẫn...",
      captionPlaceholder: "Tác giả...",
    },
  },
  code: {
    class: Code as EditorJSTool,
    config: {
      placeholder: "Nhập code...",
    },
  },
  embed: {
    class: Embed as EditorJSTool,
    config: {
      services: {
        youtube: true,
        codepen: true,
        instagram: true,
        twitter: true,
        vimeo: true,
        googledrive: {
          regex: /https?:\/\/drive\.google\.com\/file\/d\/([^/?&]*).*/,
          embedUrl: "https://drive.google.com/file/d/<%= remote_id %>/preview",
          html: "<iframe allow='autoplay' width='640' height='360'></iframe>",
          id: (groups: string[]) => groups[0],
        },
        googleform: {
          regex: /https?:\/\/docs.google.com\/forms\/d\/e\/([^/?&]*).*/,
          embedUrl:
            "https://docs.google.com/forms/d/e/<%= remote_id %>/viewform?embedded=true",
          html: "<iframe width='640' height='640'></iframe>",
        },
      },
    },
  },
  raw: Raw as EditorJSTool,
  table: {
    class: Table as EditorJSTool,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  simpleImage: SimpleImage as EditorJSTool,
  image: {
    class: ImageTool as EditorJSTool,
    config: {
      endpoints: {
        byFile: 'https://sa.mservice.io/momovn-cms/api/v2/upload/base64_v2',
        byUrl: 'https://sa.mservice.io/momovn-cms/api/v2/upload/base64_v2',
      },
      field: 'File',
      types: 'image/*',
      additionalRequestData: {
        Folder: 'Img',
      },
      captionPlaceholder: 'Nhập chú thích cho hình ảnh...',
      buttonContent: 'Chọn hình ảnh',
      uploader: {
        uploadByFile(file: File) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
              try {
                const base64 = reader.result as string;
                const response = await fetch('https://sa.mservice.io/momovn-cms/api/v2/upload/base64_v2', {
                  method: 'POST',
                  headers: {
                    'accept': 'application/json',
                    'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                    'content-type': 'application/json',
                    'origin': 'https://adminweb.momocdn.net',
                    'priority': 'u=1, i',
                    'referer': 'https://adminweb.momocdn.net/',
                    'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                    'x-user-token': 'AEJAMWEIQMUAN@991HSOAHQYFJAHQKAGQEO-32WKAKAUIWUCNAPKQK'
                  },
                  body: JSON.stringify({
                    File: base64,
                    Folder: 'Img',
                    Size: file.size,
                    Type: file.type
                  })
                });

                const result = await response.json();

                if (result && result.Result) {
                  resolve({
                    success: 1,
                    file: {
                      url: result?.Data?.Full,
                    },
                  });
                } else {
                  reject(new Error('Upload failed'));
                }
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = () => reject(new Error('File reading failed'));
            reader.readAsDataURL(file);
          });
        },
        uploadByUrl(url: string) {
          return new Promise((resolve, reject) => {
            const handleUpload = async () => {
              try {
                // Fetch the image from URL and convert to base64
                const response = await fetch(url);
                const blob = await response.blob();
                const reader = new FileReader();

                reader.onload = async () => {
                  try {
                    const base64 = reader.result as string;
                    const uploadResponse = await fetch('https://sa.mservice.io/momovn-cms/api/v2/upload/base64_v2', {
                      method: 'POST',
                      headers: {
                        'accept': 'application/json',
                        'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                        'content-type': 'application/json',
                        'origin': 'https://adminweb.momocdn.net',
                        'priority': 'u=1, i',
                        'referer': 'https://adminweb.momocdn.net/',
                        'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"macOS"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'cross-site',
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                        'x-user-token': 'AEJAMWEIQMUAN@991HSOAHQYFJAHQKAGQEO-32WKAKAUIWUCNAPKQK'
                      },
                      body: JSON.stringify({
                        File: base64,
                        Folder: 'Img',
                        Size: blob.size,
                        Type: blob.type
                      })
                    });

                    const result = await uploadResponse.json();

                    if (result && result.Result) {
                      resolve({
                        success: 1,
                        file: {
                          url: result?.Data?.Full,
                        },
                      });
                    } else {
                      reject(new Error('Upload failed'));
                    }
                  } catch (error) {
                    reject(error);
                  }
                };

                reader.onerror = () => reject(new Error('File reading failed'));
                reader.readAsDataURL(blob);
              } catch (error) {
                reject(error);
              }
            };

            handleUpload();
          });
        },
      },
    },
  },
  // simpleImage: SimpleImage as EditorJSTool,

  // Inline tools
  inlineCode: {
    class: InlineCode as EditorJSTool,
    shortcut: "CMD+SHIFT+M",
  },
  marker: {
    class: Marker as EditorJSTool,
    shortcut: "CMD+SHIFT+H",
  },
  underline: {
    class: Underline as EditorJSTool,
    shortcut: "CMD+U",
  },
  delimiter: Delimiter as EditorJSTool,
  warning: {
    class: Warning as EditorJSTool,
    inlineToolbar: true,
    config: {
      titlePlaceholder: "Tiêu đề cảnh báo",
      messagePlaceholder: "Nội dung cảnh báo",
    },
  },
  checklist: {
    class: Checklist as EditorJSTool,
    inlineToolbar: true,
  },
};

export interface EditorJSRef {
  save: () => Promise<OutputData>;
  clear: () => void;
  render: (data: OutputData) => void;
}

const EditorJSComponent = forwardRef<EditorJSRef, EditorJSProps>(
  (
    { data, onChange, placeholder = "Nhập nội dung...", readOnly = false },
    ref
  ) => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const isInitializingRef = useRef(true);

    useImperativeHandle(ref, () => ({
      save: async () => {
        if (editorRef.current) {
          return await editorRef.current.save();
        }
        return { blocks: [] };
      },
      clear: () => {
        if (editorRef.current) {
          editorRef.current.clear();
        }
      },
      render: (newData: OutputData) => {
        if (editorRef.current && holderRef.current) {
          // EditorJS không có render method, cần tạo lại instance
          editorRef.current.destroy();
          editorRef.current = new EditorJS({
            holder: holderRef.current,
            placeholder,
            readOnly,
            data: newData,
            tools: EDITOR_TOOLS,
            onChange: handleChange,
          });
        }
      },
    }));

    // Memoize onChange callback - sử dụng useRef để tránh re-render
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const handleChange = useCallback(async () => {
      // Skip onChange during initialization to prevent Raw plugin from triggering unwanted changes
      if (isInitializingRef.current) {
        return;
      }

      if (onChangeRef.current && editorRef.current) {
        const outputData = await editorRef.current.save();
        onChangeRef.current(outputData);
      }
    }, []); // Empty dependency array

    // Initialize EditorJS only once - không re-render
    const dataRef = useRef(data);
    const placeholderRef = useRef(placeholder);
    const readOnlyRef = useRef(readOnly);
    const handleChangeRef = useRef(handleChange);

    dataRef.current = data;
    placeholderRef.current = placeholder;
    readOnlyRef.current = readOnly;
    handleChangeRef.current = handleChange;

    useEffect(() => {
      if (!holderRef.current) return;

      // Chỉ tạo instance nếu chưa có
      if (!editorRef.current) {
        editorRef.current = new EditorJS({
          holder: holderRef.current,
          placeholder: placeholderRef.current,
          readOnly: readOnlyRef.current,
          data: dataRef.current || { blocks: [] },
          tools: EDITOR_TOOLS,
          onChange: handleChangeRef.current,
        });

        // Set initialization flag to false after EditorJS is ready
        // This prevents Raw plugin from triggering onChange during initial load
        setTimeout(() => {
          isInitializingRef.current = false;
        }, 1000);
      }

      return () => {
        if (editorRef.current && editorRef.current.destroy) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }, []); // Empty dependency - chỉ chạy một lần

    // Không cần useEffect riêng cho data changes
    // EditorJS sẽ handle data internally, không cần re-render khi user edit

    return (
      <div
        ref={holderRef}
        className="tw:border tw:border-gray-200 tw:rounded-md tw:p-4 tw:text-gray-900 tw:min-h-[400px] tw:bg-white tw:prose-sm tw:text-base tw:relative tw:z-[1] editorjs-container"
        style={{
          backgroundColor: readOnly ? "#f8f9fa" : "white",
          cursor: readOnly ? "default" : "text",
        }}
      />
    );
  }
);

EditorJSComponent.displayName = "EditorJSComponent";

export default EditorJSComponent;
