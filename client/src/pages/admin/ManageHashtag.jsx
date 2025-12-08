import hashtagApi from "../../api/hashtagApi";
import ManageHashtagAndGift from "../../components/common/ManageHashtagAndGift";

function ManageHashtag() {
    return (
        <ManageHashtagAndGift
            title="Quản lý Hashtag"
            resourceName="Hashtag"
            api={hashtagApi}
            responseKey="hash_tags"
        />
    );
}

export default ManageHashtag;