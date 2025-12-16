import { toast } from "react-toastify";

const CART_KEY = "cart";

export const getCartLocal = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

export const addToCartLocal = (product, quantity, selectedGiftId, flavorSelected) => {
    const cart = getCartLocal();

    let flavorName = null;
    let flavorId = null;
    let priceToSave = product.price_after_discount || product.price;
    let imageToSave = product.img_url;

    if (typeof flavorSelected === 'object' && flavorSelected !== null) {
        flavorName = flavorSelected.name;
        flavorId = flavorSelected.id;

        if (flavorSelected.price > 0) {
            priceToSave = flavorSelected.price;
        }

        const flavorImg = flavorSelected.image || flavorSelected.img_url || flavorSelected.image_url;

        if (flavorImg) {
            imageToSave = flavorImg;
        }
    } else {
        flavorName = flavorSelected;
    }

    if (selectedGiftId === 2) {
        priceToSave = priceToSave - 30000;
        if (priceToSave < 0) priceToSave = 0;
    }

    let giftName = null;
    if (selectedGiftId && product.gifts) {
        const giftObj = product.gifts.find(g => g.id === selectedGiftId);
        if (giftObj) giftName = giftObj.name;
    }

    const existingIndex = cart.findIndex(item =>
        item.id === product.id &&
        item.flavor_name === flavorName &&
        item.gift_id === selectedGiftId
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
        cart[existingIndex].final_price = priceToSave;
    } else {
        const newItem = {
            cart_id: Date.now(),
            id: product.id,

            product_name: product.name,
            image_url: imageToSave,
            price: product.price,
            final_price: priceToSave,
            discount_percent: product.discount_percent,
            quantity: quantity,
            flavor_name: flavorName,
            flavor_id: flavorId,
            gift_id: selectedGiftId,
            gift_name: giftName
        };
        cart.push(newItem);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cart-change"));

    toast.success("Đã thêm vào giỏ!", {
        pauseOnHover: false,
        hideProgressBar: true,
        autoClose: 2000
    });
};

export const updateCartLocal = (cartId, newQuantity) => {
    let cart = getCartLocal();

    cart = cart.map(item => {
        if (item.cart_id === cartId || item.id === cartId) {
            return { ...item, quantity: newQuantity };
        }
        return item;
    });

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cart-change"));
};


export const removeFromCartLocal = (idToDelete) => {
    let cart = getCartLocal();

    const newCart = cart.filter(item => {
        if (item.cart_id) {
            return item.cart_id !== idToDelete;
        }
        return item.id !== idToDelete;
    });

    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));

    toast.info("Đã xóa sản phẩm khỏi giỏ", { autoClose: 1500, hideProgressBar: true });
};

export const clearCartLocal = () => {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event("storage"));
};