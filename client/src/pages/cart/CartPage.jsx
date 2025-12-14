import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import cartApi from "../../api/cartApi";
import {getCartLocal, updateCartLocal, removeFromCartLocal} from "../../utils/cart";
import Footer from "../../components/footer/Footer";
import "../../styles/cart/CartPage.css";
import Header from "../../components/header/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import CheckoutForm from "./CheckoutForm";
import CartSection from "./CartSection";

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
        fetchProvinces();
    },[]);
    const fetchProvinces = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/p/");
                const data = await response.json();
                setProvinceList(data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        }
    const fetchDistricts = async (provinceCode) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            const data = await response.json();
            setDistrictList(data.districts);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    }
    const fetchWards = async (districtCode) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const data = await response.json();
            setWardList(data.wards);
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    }
    

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
    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const province = provinceList.find(p => p.code == provinceCode);

        setCustomerInfo(prev => ({
            ...prev,
            city: provinceCode,
            provinceName: province.name,
            districtName: "",
            wardCode: "",
            wardName: ""
        }));
        fetchDistricts(provinceCode);
        
    };
    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        const district = districtList.find(d => d.code == districtCode);

        setCustomerInfo(prev => ({
            ...prev,
            district: districtCode,
            districtName: district.name,
            wardCode: "",
            wardName: ""
        }));

        fetchWards(districtCode);
    };
    const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const ward = wardList.find(w => w.code == wardCode);

    setCustomerInfo(prev => ({
        ...prev,
        wardCode,
        wardName: ward.name
    }));
    };

    const handleCheckout = () => {
        if (!customerInfo.name || !customerInfo.phone) {
            alert("Vui lòng điền họ tên và số điện thoại!");
            return;
        }
        console.log("Đặt hàng:", {customerInfo, cartItems, totalPrice});
        alert("Đặt hàng thành công! (Demo)");
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: 50}}>Đang tải giỏ hàng...</div>;

    return (
        <>
            <Header/>
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