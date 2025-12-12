import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/components/product/ProductDetails.css";
import productApi from "../../api/productApi";
import cartApi from "../../api/cartApi";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { addToCartLocal } from "../../utils/cart";
import {toast} from "react-toastify";
export default function ProductDetails() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [flavorSelected, setFlavorSelected] = useState(null);
    const [selectedGift, setSelectedGift] = useState(null);
    const [amount, setAmount] = useState(1);

    const apiUrl = process.env.REACT_APP_API_URL;
    const formatVND = (value) => {
        return value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };
    const [displayImage, setDisplayImage] = useState("");
    const [displayPrice, setDisplayPrice] = useState(0);

    const decrease = () => {
        if (amount > 1) {
            setAmount(amount - 1);
        }
    }
    const increase = async () => {
        if (amount < product.stock) {
            setAmount(amount + 1);
        }
    }
    const handleAddToCart = async () => {
        const token = localStorage.getItem("access_token");

        if (token) {
            try {
                const payload = {
                    product_id: product.id,
                    quantity: amount,
                    flavor_id: flavorSelected ? flavorSelected.id : null,
                    gift_id: selectedGift
                };

                await cartApi.addToCart(payload);

                toast.success("Đã thêm vào giỏ hàng!");

                setAmount(1);


            } catch (error) {
                console.error("Lỗi thêm giỏ hàng:", error);
                if (error.response && error.response.status === 401) {
                    alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    // navigate('/auth/login');
                } else {
                    alert("Có lỗi xảy ra: " + (error.response?.data?.error || "Lỗi server"));
                }
            }
        } else {
            addToCartLocal(product, amount, selectedGift, flavorSelected);
            setAmount(1);
        }

    }

    const handleSelectFlavor = (flavor) => {
        setFlavorSelected(flavor);

        if (flavor.image) {
            setDisplayImage(flavor.image);
        }

        if (flavor.price) {
            setDisplayPrice(flavor.price);
        }
    }

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await productApi.getProductPublic(`${id}`);
            setProduct(res.product);

            setDisplayImage(res.product.img_url);
            setDisplayPrice(res.product.price_after_discount);
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            if (product.flavors && product.flavors.length > 0) {
                setFlavorSelected(product.flavors[0]);
            }
            if (product.gifts.length > 0) {
                setSelectedGift(product.gifts[0].id);
            }
        }
    }, [product]);

    if (!product) return <p>Loading...</p>;

    return (
        <>
            <Header/>
            <div className="product-details-container">
                <div className="product-images-section">
                    <img
                        id="product_img"
                        src={`${apiUrl}/${displayImage}`}
                        alt={product.name}
                        className="product-main-image"
                    />
                    <div className="info_under_img">
                        <p>Thông tin sản phẩm</p>
                        <p>🌐 Thương hiệu: {product.brand_name}</p>
                        <p>🏡 Xuất xứ: {product.origin}</p>
                        <p>⚖️ Định lượng: {product.weight}</p>
                    </div>
                </div>

                <div className="product-info-section">
                    <h1 className="product-title">{product.name}</h1>
                    <p>
                        <span className="product-rating">Đã bán: {product.rating} </span>
                        <span className="product-rating">Đánh giá: {product.sold_count}⭐</span>
                    </p>


                    <div className="price-container">
                        <span className="product-discount-price">{formatVND(displayPrice)}</span>
                        {(product.discount_percent > 0) && (
                            <span className="product-price">{formatVND(product.price)}</span>
                        )}
                    </div>

                    {product.flavors.length > 0 && (
                        <div>
                            <p className="flavor_label">Hương vị:</p>
                            {
                                product.flavors.map((flavor, index) => (
                                    <button
                                        key={index}
                                            onClick={() => handleSelectFlavor(flavor)}
                                            className={
                                                flavorSelected === flavor.name
                                                    ? "flavor-button selected"
                                                    : "flavor-button"
                                            }

                                        >
                                            {flavor.name}
                                        </button>
                                    )
                                )
                            }
                        </div>
                    )
                    }


                    <p className="product-description">{product.description}</p>
                    <p className="product-stock">🔥Chỉ còn <span
                        className="product-stock-qty">{product.stock}</span> trong kho</p>
                    <div className="border rounded-xl p-4 bg-gray-50">
                        <h3 className="text-red-600 font-semibold mb-3">Chọn quà tặng</h3>

                        <div className="space-y-3">
                            {product.gifts.map((gift) => (
                                <label
                                    key={gift.id}
                                    className={`gift${selectedGift === gift.id
                                        ? "bg-white border-green-500"
                                        : "bg-gray-100 border-transparent"}`}
                                    onClick={() => setSelectedGift(gift.id)}>

                                    <input
                                        type="radio"
                                        name="gift"
                                        checked={selectedGift === gift.id}
                                        onChange={() => setSelectedGift(gift.id)}
                                        className="w-5 h-5 accent-green-600"/>

                                    <img
                                        alt={gift.name}
                                        src={`${apiUrl}/${gift.image}`}
                                        className="w-12 h-12 object-contain"/>

                                    <div>
                                        <p className="font-semibold text-gray-800">{gift.name}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="actions-container">

                        <div className="quantity-and-cart">

                            <div className="quantity-box">
                                <button
                                    className="qty-btn"
                                    onClick={decrease}
                                    disabled={amount === 1}
                                    style={{opacity: amount === 1 ? 0.4 : 1}}
                                >
                                    −
                                </button>

                                <span className="qty-number">{amount}</span>

                                <button
                                    className="qty-btn"
                                    onClick={increase}
                                >
                                    +
                                </button>
                            </div>

                            <div className="cart-buttons">
                                <button
                                    className="add-to-cart"
                                    onClick={() => handleAddToCart(product, amount)}
                                >
                                    THÊM VÀO GIỎ
                                </button>
                                <button className="buy-now">
                                    MUA NGAY
                                    <span> GIAO HÀNG TẬN NƠI HOẶC NHẬN TẠI CỬA HÀNG</span>
                                </button>
                            </div>
                        </div>


                    </div>


                </div>
            </div>
            <Footer/>
        </>
    );
}