export const addToCartLocal = (product, quantity) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingIndex = cart.findIndex(item => item.id === product.id);

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
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
};
