import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Embed from '@editorjs/embed';
import Raw from '@editorjs/raw';
import Table from '@editorjs/table';
import SimpleImage from '@editorjs/simple-image';

// Inline plugins
import InlineCode from '@editorjs/inline-code';
// @ts-expect-error - No type definitions available
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import Delimiter from '@editorjs/delimiter';
import Warning from '@editorjs/warning';
// @ts-expect-error - No type definitions available
import Checklist from '@editorjs/checklist';
import NestedList from '@editorjs/nested-list';


interface EditorJSProps {
    data?: OutputData;
    onChange?: (data: OutputData) => void;
    placeholder?: string;
    readOnly?: boolean;
}

// Type for EditorJS tools to avoid using 'any'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorJSTool = any;

export interface EditorJSRef {
    save: () => Promise<OutputData>;
    clear: () => void;
    render: (data: OutputData) => void;
}

const EditorJSComponent = forwardRef<EditorJSRef, EditorJSProps>(
    ({ data, onChange, placeholder = "Nhập nội dung...", readOnly = false }, ref) => {
        const editorRef = useRef<EditorJS | null>(null);
        const holderRef = useRef<HTMLDivElement>(null);

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
                        tools: {
                            // Block tools
                            header: {
                                class: Header as EditorJSTool,
                                config: {
                                    placeholder: 'Nhập tiêu đề...',
                                    levels: [1, 2, 3, 4, 5, 6],
                                    defaultLevel: 2
                                }
                            },
                            list: {
                                class: NestedList as EditorJSTool,
                                inlineToolbar: true,
                                config: {
                                    defaultStyle: 'unordered'
                                }
                            },
                            paragraph: {
                                class: Paragraph as EditorJSTool,
                                inlineToolbar: true,
                                config: {
                                    placeholder: 'Nhập nội dung...'
                                }
                            },
                            quote: {
                                class: Quote as EditorJSTool,
                                inlineToolbar: true,
                                config: {
                                    quotePlaceholder: 'Nhập trích dẫn...',
                                    captionPlaceholder: 'Tác giả...'
                                }
                            },
                            code: {
                                class: Code as EditorJSTool,
                                config: {
                                    placeholder: 'Nhập code...'
                                }
                            },
                            embed: {
                                class: Embed as EditorJSTool,
                                config: {
                                    services: {
                                        youtube: true,
                                        codepen: true,
                                        instagram: true,
                                        twitter: true,
                                        vimeo: true
                                    }
                                }
                            },
                            raw: Raw as EditorJSTool,
                            table: {
                                class: Table as EditorJSTool,
                                inlineToolbar: true,
                                config: {
                                    rows: 2,
                                    cols: 3
                                }
                            },

                            simpleImage: SimpleImage as EditorJSTool,

                            // Inline tools
                            inlineCode: {
                                class: InlineCode as EditorJSTool,
                                shortcut: 'CMD+SHIFT+M'
                            },
                            marker: {
                                class: Marker as EditorJSTool,
                                shortcut: 'CMD+SHIFT+H'
                            },
                            underline: {
                                class: Underline as EditorJSTool,
                                shortcut: 'CMD+U'
                            },
                            delimiter: Delimiter as EditorJSTool,
                            warning: {
                                class: Warning as EditorJSTool,
                                inlineToolbar: true,
                                config: {
                                    titlePlaceholder: 'Tiêu đề cảnh báo',
                                    messagePlaceholder: 'Nội dung cảnh báo'
                                }
                            },
                            checklist: {
                                class: Checklist as EditorJSTool,
                                inlineToolbar: true
                            },
                        },
                        onChange: handleChange
                    });
                }
            }
        }));

        // Memoize onChange callback - sử dụng useRef để tránh re-render
        const onChangeRef = useRef(onChange);
        onChangeRef.current = onChange;

        const handleChange = useCallback(async () => {
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
                    tools: {
                        // Block tools
                        header: {
                            class: Header as EditorJSTool,
                            config: {
                                placeholder: 'Nhập tiêu đề...',
                                levels: [1, 2, 3, 4, 5, 6],
                                defaultLevel: 2
                            }
                        },
                        list: {
                            class: NestedList as EditorJSTool,
                            inlineToolbar: true,
                            config: {
                                defaultStyle: 'unordered'
                            }
                        },
                        paragraph: {
                            class: Paragraph as EditorJSTool,
                            inlineToolbar: true,
                            config: {
                                placeholder: 'Nhập nội dung...'
                            }
                        },
                        quote: {
                            class: Quote as EditorJSTool,
                            inlineToolbar: true,
                            config: {
                                quotePlaceholder: 'Nhập trích dẫn...',
                                captionPlaceholder: 'Tác giả...'
                            }
                        },
                        code: {
                            class: Code as EditorJSTool,
                            config: {
                                placeholder: 'Nhập code...'
                            }
                        },
                        embed: {
                            class: Embed as EditorJSTool,
                            config: {
                                services: {
                                    youtube: true,
                                    codepen: true,
                                    instagram: true,
                                    twitter: true,
                                    vimeo: true
                                }
                            }
                        },
                        raw: Raw as EditorJSTool,
                        table: {
                            class: Table as EditorJSTool,
                            inlineToolbar: true,
                            config: {
                                rows: 2,
                                cols: 3
                            }
                        },

                        simpleImage: SimpleImage as EditorJSTool,

                        // Inline tools
                        inlineCode: {
                            class: InlineCode as EditorJSTool,
                            shortcut: 'CMD+SHIFT+M'
                        },
                        marker: {
                            class: Marker as EditorJSTool,
                            shortcut: 'CMD+SHIFT+H'
                        },
                        underline: {
                            class: Underline as EditorJSTool,
                            shortcut: 'CMD+U'
                        },
                        delimiter: Delimiter as EditorJSTool,
                        warning: {
                            class: Warning as EditorJSTool,
                            inlineToolbar: true,
                            config: {
                                titlePlaceholder: 'Tiêu đề cảnh báo',
                                messagePlaceholder: 'Nội dung cảnh báo'
                            }
                        },
                        checklist: {
                            class: Checklist as EditorJSTool,
                            inlineToolbar: true
                        },
                    },
                    onChange: handleChangeRef.current
                });
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
                className="tw:border tw:border-gray-300 tw:rounded-lg tw:p-4 tw:min-h-[400px] tw:bg-white tw:shadow-sm tw:text-lg"
                style={{
                    backgroundColor: readOnly ? '#f8f9fa' : 'white',
                    cursor: readOnly ? 'default' : 'text'
                }}
            />
        );
    }
);

EditorJSComponent.displayName = 'EditorJSComponent';

export default EditorJSComponent;
