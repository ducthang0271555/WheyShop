import { toast } from "react-toastify";

export const addToCartLocal = (product, quantity, selectedGift, flavorSelected) => {
    

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingIndex = cart.findIndex(item => (item.id === product.id && item.flavor === flavorSelected && item.gift === selectedGift));

    if (existingIndex !== -1) {
        // nếu đã có → tăng số lượng
        cart[existingIndex].quantity += quantity;
    } else {
        // nếu chưa có → thêm mới
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            gift: selectedGift,
            flavor: flavorSelected,
            img_url: product.img_url
        });
    }
    toast.success("Đã thêm vào giỏ!", {
          pauseOnHover: false,
          hideProgressBar: true,
        });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
};
