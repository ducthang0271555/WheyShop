import brandApi from "../../api/brandApi";
import ManageCategoryAndBrand from "../../components/common/ManageCategoryAndBrand";

function ManageBrand() {
    return (
        <ManageCategoryAndBrand
            title="Quản lý Thương hiệu"
            resourceName="thương hiệu"
            api={brandApi}
            responseKey="brands"
        />
    );
}
export default ManageBrand;