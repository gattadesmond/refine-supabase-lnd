import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Embed from '@editorjs/embed';
import Raw from '@editorjs/raw';
import Table from '@editorjs/table';
import SimpleImage from '@editorjs/simple-image';

interface EditorJSProps {
    data?: OutputData;
    onChange?: (data: OutputData) => void;
    placeholder?: string;
    readOnly?: boolean;
}

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
                            header: Header,
                            list: List,
                            paragraph: Paragraph,
                            quote: Quote,
                            code: Code,
                            embed: Embed,
                            raw: Raw,
                            table: Table,
                            image: SimpleImage
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
                        header: Header,
                        list: List,
                        paragraph: Paragraph,
                        quote: Quote,
                        code: Code,
                        embed: Embed,
                        raw: Raw,
                        table: Table,
                        image: SimpleImage
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
                className="tw-border tw-border-gray-300 tw-rounded tw-p-4 tw-min-h-[300px]"
                style={{ 
                    backgroundColor: readOnly ? '#f5f5f5' : 'white',
                    cursor: readOnly ? 'default' : 'text'
                }}
            />
        );
    }
);

EditorJSComponent.displayName = 'EditorJSComponent';

export default EditorJSComponent;
