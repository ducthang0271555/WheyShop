import categoryApi from "../../api/categoryApi";
import ManageCategoryAndBrand from "../../components/common/ManageCategoryAndBrand";

function ManageCategory() {
    return (
        <ManageCategoryAndBrand
            title="Quản lý Loại sản phẩm"
            resourceName="loại sản phẩm"
            api={categoryApi}
            responseKey="categories"
        />
    );
}
export default ManageCategory;