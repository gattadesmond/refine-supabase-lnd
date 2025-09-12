import React from 'react';
import { Tag } from 'antd';

interface PostStatusProps {
    status: string;
    className?: string;
}

export const PostStatus: React.FC<PostStatusProps> = ({ status, className = "" }) => {
    const statusConfig = {
        draft: { color: 'default', text: 'Bản nháp' },
        preview: { color: 'orange', text: 'Xem trước' },
        published: { color: 'green', text: 'Đã xuất bản' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
        color: 'default', 
        text: status 
    };
    
    return (
        <Tag color={config.color} className={`tw:font-medium ${className}`}>
            {config.text}
        </Tag>
    );
};

export default PostStatus;
