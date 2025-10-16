import React, { useState } from "react";
import { Upload, message, Image } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

interface UploadImageProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const UploadImage: React.FC<UploadImageProps> = ({ value, onChange, disabled }) => {
  console.log("🚀 ~ UploadImage ~ value:", value)
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          
          const response = await fetch('https://sa.mservice.io/momovn-cms/api/v2/upload/base64_v2', {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'x-user-token': 'AEJAMWEIQMUAN@991HSOAHQYFJAHQKAGQEO-32WKAKAUIWUCNAPKQK'
            },
            body: JSON.stringify({
              File: base64,
              Folder: "Img",
              Size: file.size,
              Type: file.type
            })
          });

          const result = await response.json();
          
          if (result.Result && result.Data?.Full) {
            resolve(result.Data.Full);
          } else {
            reject(new Error(result.Error || 'Upload failed'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    
    try {
      const imageUrl = await uploadImage(file as File);
      onChange?.(imageUrl);
      onSuccess?.(imageUrl);
      message.success('Upload thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload thất bại!');
      onError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    showUploadList: false,
    customRequest: handleUpload,
    disabled: disabled || uploading,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được upload file hình ảnh!');
        return false;
      }
      
      const isLt400KB = file.size / 1024 < 400;
      if (!isLt400KB) {
        message.error('Kích thước file phải nhỏ hơn 400KB!');
        return false;
      }
      
      return true;
    },
  };

  return (
    <div className="tw:space-y-3">
      <Upload.Dragger {...uploadProps}>
        <div className="tw:flex tw:justify-center tw:items-center tw:text-gray-300">
          <InboxOutlined className="tw:text-3xl " />
        </div>
        <div className="tw:text-xs tw:text-balance tw:text-gray-500 tw:mt-3">
          {uploading ? 'Đang upload...' : 'Click hoặc kéo thả hình vào đây để upload'}
        </div>
        <div className="tw:text-xs tw:text-gray-400 tw:mt-1">
          Kích thước tối đa 400KB
        </div>
      </Upload.Dragger>
      
      {value && (
        <div className="tw:border tw:border-gray-200 tw:rounded-lg tw:mt-3 tw:p-3 tw:bg-gray-50">
          <div className="tw:text-xs tw:text-gray-600 tw:mb-2">
            Preview:
          </div>
          <Image
            src={value}
            alt="Cover preview"
            className="tw:max-w-full tw:h-auto tw:max-h-48 tw:rounded-md tw:shadow-sm"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            onError={() => {
              message.error('Không thể tải hình ảnh');
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
