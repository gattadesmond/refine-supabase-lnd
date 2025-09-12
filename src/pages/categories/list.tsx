import { AntdInferencer } from "@refinedev/inferencer/antd";

export const CategoriesList = () => {
    return (
        <div className="tw-p-4">
            <div className="tw-bg-sky-500 tw-text-white tw-p-4 tw-rounded-lg tw-mb-4">
                <h2 className="tw-text-xl tw-font-bold">Tailwind CSS Test</h2>
                <p className="tw-mt-2">Nếu bạn thấy style này, Tailwind đã hoạt động với prefix tw-!</p>
            </div>
            <AntdInferencer />
        </div>
    );
};
