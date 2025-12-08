import giftApi from "../../api/giftApi";
import ManageHashtagAndGift from "../../components/common/ManageHashtagAndGift";

function ManageGift() {
    return (
        <ManageHashtagAndGift
            title="Quản lý Quà tặng"
            resourceName="Quà tặng"
            api={giftApi}
            responseKey="gifts"
        />
    );
}

export default ManageGift;