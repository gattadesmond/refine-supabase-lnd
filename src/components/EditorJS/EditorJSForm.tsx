import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import EditorJSComponent, { EditorJSRef } from './index';
import { OutputData } from '@editorjs/editorjs';

interface EditorJSFormProps {
    value?: OutputData | string;
    onChange?: (value: OutputData | string) => void;
    placeholder?: string;
    readOnly?: boolean;
}

export interface EditorJSFormRef {
    getValue: () => Promise<OutputData>;
    setValue: (value: OutputData) => void;
    clear: () => void;
}

const EditorJSForm = forwardRef<EditorJSFormRef, EditorJSFormProps>(
    ({ value, onChange, placeholder, readOnly }, ref) => {
        const editorRef = useRef<EditorJSRef>(null);

        useImperativeHandle(ref, () => ({
            getValue: async () => {
                if (editorRef.current) {
                    return await editorRef.current.save();
                }
                return { blocks: [] };
            },
            setValue: (newValue: OutputData) => {
                if (editorRef.current) {
                    editorRef.current.render(newValue);
                }
            },
            clear: () => {
                if (editorRef.current) {
                    editorRef.current.clear();
                }
            }
        }));

        const handleChange = (data: OutputData) => {
            if (onChange) {
                onChange(data);
            }
        };

        // Parse value if it's a string (JSON)
        const parseValue = (val: OutputData | string | undefined): OutputData => {
            if (!val) return { blocks: [] };
            if (typeof val === 'string') {
                try {
                    return JSON.parse(val);
                } catch {
                    return { blocks: [] };
                }
            }
            return val;
        };

        return (
            <EditorJSComponent
                ref={editorRef}
                data={parseValue(value)}
                onChange={handleChange}
                placeholder={placeholder}
                readOnly={readOnly}
            />
        );
    }
);

EditorJSForm.displayName = 'EditorJSForm';

export default EditorJSForm;
