import "../../styles/components/footer/Footer.css";
import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaFacebookF, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

function Footer() {
    return (
        <footer className="footer-wrapper">
            {/* --- Phần Nội dung chính (4 Cột) --- */}
            <div className="footer-container">

                {/* Cột 1: Giới thiệu */}
                <div className="footer-column">
                    <h3 className="footer-heading">Giới thiệu chung</h3>
                    <ul className="footer-list">
                        <li><a href="/gioi-thieu">Giới thiệu về Whey Vip Pro</a></li>
                        <li><a href="/huong-dan-dat-hang">Hướng dẫn đặt hàng</a></li>
                        <li><a href="/chuyen-khoan">Thông tin chuyển khoản</a></li>
                        <li><a href="/khieu-nai">Khiếu nại dịch vụ</a></li>
                        <li><a href="/uu-dai">Chính sách ưu đãi</a></li>
                        <li><a href="/lien-he">Liên hệ với Whey Vip Pro</a></li>
                        <li><a href="/dieu-khoan">Điều khoản giao dịch</a></li>
                    </ul>
                </div>

                {/* Cột 2: Chính sách */}
                <div className="footer-column">
                    <h3 className="footer-heading">Chính sách chung</h3>
                    <ul className="footer-list">
                        <li><a href="/bao-mat">Chính sách bảo mật</a></li>
                        <li><a href="/kinh-doanh">Chính sách kinh doanh</a></li>
                        <li><a href="/van-chuyen">Chính sách vận chuyển</a></li>
                        <li><a href="/bao-hanh">Chính sách bảo hành</a></li>
                        <li><a href="/doi-tra">Chính sách đổi trả</a></li>
                        <li><a href="/kiem-hang">Chính sách kiểm hàng</a></li>
                        <li><a href="/du-lieu">Chính sách dữ liệu</a></li>
                    </ul>
                </div>

                {/* Cột 3: Hệ thống cửa hàng */}
                <div className="footer-column store-system">
                    <h3 className="footer-heading">Hệ thống cửa hàng</h3>
                    <ul className="footer-list">
                        <li>
                            <FaMapMarkerAlt className="icon-map"/>
                            <span>336 La Thành – P.Ô Chợ Dừa - Đống Đa - Hà Nội</span>
                        </li>
                        <li>
                            <FaMapMarkerAlt className="icon-map"/>
                            <span>212 Bạch Mai – P.Bạch Mai - Hai Bà Trưng - Hà Nội</span>
                        </li>
                        <li>
                            <FaMapMarkerAlt className="icon-map"/>
                            <span>48 An Dương Vương – P.Trường Thi - Tp. Vinh</span>
                        </li>
                        <li>
                            <FaMapMarkerAlt className="icon-map"/>
                            <span>84 Lê Đình Dương, Q.Hải Châu – Tp. Đà Nẵng</span>
                        </li>
                        <li>
                            <FaMapMarkerAlt className="icon-map"/>
                            <span>521/36 Cách Mạng Tháng 8 – Q.10 - Tp.HCM</span>
                        </li>
                        <li>
                            <FaMapMarkerAlt className="icon-map"/>
                            <span>280 Quang Trung - P.10 - Gò Vấp - Tp.HCM</span>
                        </li>
                    </ul>
                </div>

                {/* Cột 4: Tư vấn & Mạng xã hội */}
                <div className="footer-column contact-column">
                    {/*<div className="contact-header">*/}
                    {/*    <FaPhoneAlt className="icon-phone-big"/>*/}
                    {/*    <h3 className="footer-heading">Tư vấn đặt hàng</h3>*/}
                    {/*</div>*/}
                    <div className="lien-he">
                        <FaPhoneAlt className="icon-phone-big"/>
                        <h3 className="footer-heading">Tư vấn đặt hàng</h3>
                    </div>

                    <div className="phone-list">
                        <div className="phone-row">
                            <span>Hà Nội:</span> <span className="phone-number">0981 33 58 58</span>
                        </div>
                        <div className="phone-row">
                            <span>Tp.HCM:</span> <span className="phone-number">0971 33 85 85</span>
                        </div>
                        <div className="phone-row">
                            <span>Vinh:</span> <span className="phone-number">0961 33 85 85</span>
                        </div>
                        <div className="phone-row">
                            <span>Đà Nẵng:</span> <span className="phone-number">0386 33 58 58</span>
                        </div>
                        <div className="phone-row">
                            <span>Hỗ Trợ:</span> <span className="phone-number">0965 33 58 58</span>
                        </div>
                    </div>

                    <div className="social-section">
                        <h4>Theo dõi chúng tôi</h4>
                        <div className="social-icons">
                            <a href="#!" className="social-icon"><FaFacebookF/></a>
                            <a href="#!" className="social-icon"><FaYoutube/></a>
                            <a href="#!" className="social-icon"><FaTiktok/></a>
                            <a href="#!" className="social-icon"><SiZalo/></a>
                            <a href="#!" className="social-icon"><FaInstagram/></a>
                        </div>
                    </div>

                    {/* Ảnh chứng nhận (Thay ảnh thật của bạn vào src) */}
                    <div className="cert-logos">
                        <img
                            src="/assets/image-footer/logo_bct.png"
                            alt="Đã thông báo bộ công thương" className="cert-img"/>
                        <img src="/assets/image-footer/dmcapro.png"
                             alt="DMCA Protected" className="cert-img"/>
                    </div>
                </div>
            </div>

            {/* --- Phần Bottom (Copyright & Disclaimer) --- */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>(*) Hình ảnh và thành phần của sản phẩm chỉ mang tính chất tham khảo bởi nhà sản xuất có thể thay
                        đổi bất cứ lúc nào mà WHEYVIPPRO chưa thể cập nhật ngay lập tức.</p>
                    <p>(*) Các sản phẩm mà WheyVipPro phân phối không phải là thuốc và không có tác dụng thay thế thuốc
                        chữa bệnh.</p>
                    <p>(*) Hiệu quả của sản phẩm khi sử dụng còn tùy thuộc vào cơ địa, thể trạng và chế độ dinh dưỡng,
                        tập luyện của mỗi người.</p>
                    <p className="copyright">© 2015 - Bản quyền thuộc về <strong>WheyVipPro.vn</strong></p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;