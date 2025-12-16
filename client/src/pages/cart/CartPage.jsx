import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import cartApi from "../../api/cartApi";
import orderApi from "../../api/orderApi";
import locationApi from "../../api/locationApi";
import {getCartLocal, updateCartLocal, removeFromCartLocal, clearCartLocal} from "../../utils/cart";
import Footer from "../../components/footer/Footer";
import "../../styles/cart/CartPage.css";
import Header from "../../components/header/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import CheckoutForm from "./CheckoutForm";
import CartSection from "./CartSection";
import ContactButton from "../../components/common/ContactButton";
import {toast} from "react-toastify";

const CartPage = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [provinceList,setProvinceList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        note: "",
        provinceName: "",
        districtName: "",
        wardCode: "",
        wardName: ""
    });

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await locationApi.getAllProvinces();
                setProvinceList(res.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách tỉnh:", error);
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e) => {
        const provinceCode = e.target.value;
        const province = provinceList.find(p => p.code === Number(provinceCode));

        setCustomerInfo(prev => ({
            ...prev,
            city: provinceCode,
            provinceName: province?.name || "",
            districtName: "",
            wardCode: "",
            wardName: ""
        }));

        setDistrictList([]);
        setWardList([]);

        try {
            const res = await locationApi.getDistricts(provinceCode);
            setDistrictList(res.data.districts);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtCode = e.target.value;
        const district = districtList.find(d => d.code === Number(districtCode));

        setCustomerInfo(prev => ({
            ...prev,
            district: districtCode,
            districtName: district?.name || "",
            wardCode: "",
            wardName: ""
        }));

        try {
            const res = await locationApi.getWards(districtCode);
            setWardList(res.data.wards);
        } catch (error) {
            console.error(error);
        }
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const ward = wardList.find(w => w.code === Number(wardCode));

        setCustomerInfo(prev => ({
            ...prev,
            wardCode,
            wardName: ward?.name || ""
        }));
    };
    

    const formatVND = (value) => value?.toLocaleString("vi-VN", {style: "currency", currency: "VND"});

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => {
            let unitPrice = Number(item.price);

            if (item.final_price !== undefined && item.final_price !== null) {
                unitPrice = Number(item.final_price);
            } else if (item.price_after_discount !== undefined && item.price_after_discount !== null) {
                unitPrice = Number(item.price_after_discount);
            }

            return sum + (unitPrice * item.quantity);
        }, 0);

        setTotalPrice(total);
    };

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            const token = localStorage.getItem("access_token");

            if (token) {
                try {
                    const res = await cartApi.getCart();
                    const items = res.cart_items || [];
                    setCartItems(items);
                    calculateTotal(items);
                } catch (error) {
                    console.error("Lỗi lấy giỏ hàng:", error);
                }
            } else {
                const localItems = getCartLocal();
                setCartItems(localItems);
                calculateTotal(localItems);
            }
            setLoading(false);
        };

        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
 
  
    const handleQuantityChange = async (itemId, currentQty, change) => {
        const newQty = currentQty + change;
        if (newQty < 1) return;

        const token = localStorage.getItem("access_token");
        const updatedItems = cartItems.map(item =>
            (item.cart_id === itemId || item.id === itemId) ? {...item, quantity: newQty} : item
        );

        setCartItems(updatedItems);
        calculateTotal(updatedItems);

        if (token) {
            setLoading(true);
            try {
                await cartApi.updateCart(itemId, newQty);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            updateCartLocal(itemId, newQty);
        }
    };

    const handleRemoveClick = (itemId) => {
        setItemToDelete(itemId);
        setShowDeleteModal(true);
    };

    const confirmRemoveItem = async () => {
        if (!itemToDelete) return;

        const token = localStorage.getItem("access_token");

        const newItems = cartItems.filter(item => (item.cart_id !== itemToDelete && item.id !== itemToDelete));
        setCartItems(newItems);
        calculateTotal(newItems);

        if (token) {
            try {
                await cartApi.deleteItem(itemToDelete);
                window.dispatchEvent(new Event("cart-change"));
            } catch (err) {
                console.error(err);
            }
        } else {
            removeFromCartLocal(itemToDelete);
        }

        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setCustomerInfo({
            ...customerInfo, [name]: value
        });
    };



    const handleCheckout = async () => {
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address ||
            !customerInfo.city || !customerInfo.district || !customerInfo.wardCode) {
            alert("Vui lòng điền đầy đủ thông tin nhận hàng!");
            return;
        }

        if (cartItems.length === 0) return alert("Giỏ hàng trống!");

        const orderData = {
            customerInfo: {
                ...customerInfo,
                city: customerInfo.provinceName,
                district: customerInfo.districtName,
                ward: customerInfo.wardName
            },
            items: cartItems,
            total_price: totalPrice,
            payment_method: paymentMethod
        };

        setLoading(true);
        try {
            const res = await orderApi.createOrder(orderData);
            if (paymentMethod === 'BANK' && res.checkoutUrl) {
                window.location.href = res.checkoutUrl;
            } else {
                toast.success("Đơn hàng được tạo thành công!");

                const token = localStorage.getItem("access_token");
                if (!token) {
                    clearCartLocal();
                }

                setCartItems([]);
                setTotalPrice(0);

                navigate("/order-success", {state: { orderCode: res.order_code } });
            }
        } catch (error) {
            console.error("Lỗi tạo đơn hàng:", error);
            alert("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: 50}}>Đang tải giỏ hàng...</div>;

    return (
        <>
            <Header/>
            <ContactButton/>
            <div className="cart-page-container">
                <div style={{padding: "0 15px"}}>
                    <CartSection
                        cartItems={cartItems}
                        totalPrice={totalPrice}
                        apiUrl={apiUrl}
                        formatVND={formatVND}
                        onNavigateBack={() => navigate(-1)}
                        onRemoveClick={handleRemoveClick}
                        onQuantityChange={handleQuantityChange}
                    />

                    <CheckoutForm
                        customerInfo={customerInfo}
                        onInputChange={handleInputChange}
                        onCheckout={handleCheckout}
                        provinceList={provinceList}
                        districtList={districtList}
                        wardList={wardList}
                        onProvinceChange={handleProvinceChange}
                        onDistrictChange={handleDistrictChange}
                        onWardChange={handleWardChange}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />
                </div>
            </div>
            {showDeleteModal && (
                <ConfirmModal
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
                    onConfirm={confirmRemoveItem}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setItemToDelete(null);
                    }}
                />
            )}

            <Footer/>
        </>
    );
};

export default CartPage;