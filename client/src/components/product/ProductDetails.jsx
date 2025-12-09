import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/components/product/ProductDetails.css";
import productApi from "../../api/productApi";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { addToCartLocal } from "../../utils/cart";
import { toast } from "react-toastify";
export default function ProductDetails() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [amount, setAmount] = useState(1);
  const formatVND = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
};
  const decrease = () => {
    if (amount > 1) {
      setAmount(amount - 1);
    }
}
const handleAddToCart = () => {
    addToCartLocal(product, amount);
    setAmount(1);
    toast.success("Đã thêm vào giỏ!", {
      pauseOnHover: false,
      hideProgressBar: true,
    });
  }
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await productApi.get(`${id}`);
      console.log(res.product);
      setProduct(res.product);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <>
        <Header></Header>
        <div className="product-details-container">
      <div className="product-images-section">
        <img
          src={`${apiUrl}/${product.img_url}`}
          alt={product.name}
          className="product-main-image"
        />
      </div>

      <div className="product-info-section">
        <h1 className="product-title">{product.name}</h1>

        
        <span className="product-discount-price">{ formatVND( (product.price) * (100-product.discount_percent)/100 )}</span>

        { (product.discount_percent > 0) && 
        <span className="product-price">{formatVND(product.price*1)}</span>        

        }
        <p className="product-description">{product.description}</p>
        <p >Xuất xứ:  {product.origin}</p>
        <div className="actions-container">

  <div className="quantity-and-cart">

    <div className="quantity-box">
      <button
        className="qty-btn"
        onClick={decrease}
        disabled={amount === 1}
        style={{ opacity: amount === 1 ? 0.4 : 1 }}
      >
        −
      </button>

      <span className="qty-number">{amount}</span>

      <button
        className="qty-btn"
        onClick={() => setAmount(amount + 1)}
      >
        +
      </button>
    </div>

    <button
      className="add-to-cart"
      onClick={() => handleAddToCart(product, amount)}
    >
      THÊM VÀO GIỎ
    </button>

  </div>

  <button className="buy-now" >
    MUA NGAY
    <span> GIAO HÀNG TẬN NƠI HOẶC NHẬN TẠI CỬA HÀNG</span>
  </button>

</div>


      </div>
    </div>
    <Footer></Footer>
    </>
  );
}

