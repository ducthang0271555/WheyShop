
const CheckoutForm = ({ customerInfo, onInputChange, onCheckout, provinceList,
                          districtList, wardList, onProvinceChange, onDistrictChange, onWardChange,
                          paymentMethod, setPaymentMethod}) => {

    return (
        <div className="customer-section">
            <div className="section-title">Thông tin khách hàng</div>

            <div className="form-row">
                <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Họ và tên (bắt buộc)"
                    value={customerInfo.name}
                    onChange={onInputChange}
                />
                <input
                    type="text"
                    name="phone"
                    className="form-input"
                    placeholder="Số điện thoại (bắt buộc)"
                    value={customerInfo.phone}
                    onChange={onInputChange}
                />
            </div>

            <div className="section-title">Chọn địa chỉ nhận hàng</div>

            <div className="form-row">
                {(
                    <>
                        <select
                            className="form-select"
                            name="city"
                            onChange={
                                onProvinceChange
                            }
                            value={customerInfo.city}
                        >
                            <option value="">Tỉnh/Thành</option>
                            {provinceList.map((province) => (
                                <option key={province.code} value={province.code}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            name="district"
                            onChange={onDistrictChange}
                            value={customerInfo.district}>
                            <option value="">Quận/Huyện</option>
                            {districtList.map((district) => (
                                <option key={district.code} value={district.code}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}


                <select
                    className="form-select"
                    name="ward"
                    value={customerInfo.ward}
                    onChange={onWardChange}
                >
                    <option value="">Phường/Xã</option>
                    {wardList.map(w => (
                        <option key={w.code} value={w.code}>
                            {w.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-row">
                <input
                    type="text"
                    name="address"
                    className="form-input"
                    placeholder="Số nhà, tên đường..."
                    value={customerInfo.address}
                    onChange={onInputChange}
                />
            </div>

            <div className="form-row">
                <textarea
                    name="note"
                    className="form-textarea"
                    placeholder="Ghi chú thêm (nếu có)..."
                    value={customerInfo.note}
                    onChange={onInputChange}
                ></textarea>
            </div>

            <div className="section-title" style={{marginTop: '20px'}}>Phương thức thanh toán</div>
            <div className="payment-methods">
                <label className="payment-option"
                       style={{display: 'flex', gap: '10px', marginBottom: '10px', cursor: 'pointer'}}>
                    <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className="payment-option" style={{display: 'flex', gap: '10px', cursor: 'pointer'}}>
                    <input
                        type="radio"
                        name="payment"
                        value="BANK"
                        checked={paymentMethod === 'BANK'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Chuyển khoản ngân hàng (QR Code)</span>
                </label>
            </div>

            <button className="checkout-btn" onClick={onCheckout}>
                {paymentMethod === 'BANK' ? 'Thanh toán ngay' : 'Xác nhận đặt hàng'}
            </button>
        </div>
    );
};

export default CheckoutForm;