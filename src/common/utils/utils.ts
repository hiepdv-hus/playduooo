import {RefObject} from "react";

export const isValidateEmail = (email: string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const formatCurrency = (val: string | null | number) : string => {
    if(!val) return "0"
    let value = val.toString().replace(/\D/g, "");
    if (value.length)
        value = Number(value.replace(/,/g, "")).toLocaleString();
    return value;
};

export const randomStr = () => {
    return (Math.random() + 5).toString(36).substring(2)
}

export const getValBRef = (ref: RefObject<HTMLSelectElement | HTMLInputElement>) => {
    try {
        if(ref && ref.current) return ref.current.value.trim()
    } catch (_) {
        return null
    }
    return null
}

export const SEX = [{key: "male", name: "Nam"}, {key: "female", name: "Nữ"}]

export const PROVINCES = [
    { key: 'An Giang', name: 'An Giang' },
    { key: 'Bà Rịa – Vũng Tàu', name: 'Bà Rịa – Vũng Tàu' },
    { key: 'Bắc Giang', name: 'Bắc Giang' },
    { key: 'Bắc Kạn', name: 'Bắc Kạn' },
    { key: 'Bạc Liêu', name: 'Bạc Liêu' },
    { key: 'Bắc Ninh', name: 'Bắc Ninh' },
    { key: 'Bến Tre', name: 'Bến Tre' },
    { key: 'Bình Định', name: 'Bình Định' },
    { key: 'Bình Dương', name: 'Bình Dương' },
    { key: 'Bình Phước', name: 'Bình Phước' },
    { key: 'Bình Thuận', name: 'Bình Thuận' },
    { key: 'Cà Mau', name: 'Cà Mau' },
    { key: 'Cần Thơ', name: 'Cần Thơ' },
    { key: 'Cao Bằng', name: 'Cao Bằng' },
    { key: 'Đà Nẵng', name: 'Đà Nẵng' },
    { key: 'Đắk Lắk', name: 'Đắk Lắk' },
    { key: 'Đắk Nông', name: 'Đắk Nông' },
    { key: 'Điện Biên', name: 'Điện Biên' },
    { key: 'Đồng Nai', name: 'Đồng Nai' },
    { key: 'Đồng Tháp', name: 'Đồng Tháp' },
    { key: 'Gia Lai', name: 'Gia Lai' },
    { key: 'Hà Giang', name: 'Hà Giang' },
    { key: 'Hà Nam', name: 'Hà Nam' },
    { key: 'Hà Nội', name: 'Hà Nội' },
    { key: 'Hà Tĩnh', name: 'Hà Tĩnh' },
    { key: 'Hải Dương', name: 'Hải Dương' },
    { key: 'Hải Phòng', name: 'Hải Phòng' },
    { key: 'Hậu Giang', name: 'Hậu Giang' },
    { key: 'Hòa Bình', name: 'Hòa Bình' },
    { key: 'Hưng Yên', name: 'Hưng Yên' },
    { key: 'Khánh Hòa', name: 'Khánh Hòa' },
    { key: 'Kiên Giang', name: 'Kiên Giang' },
    { key: 'Kon Tum', name: 'Kon Tum' },
    { key: 'Lai Châu', name: 'Lai Châu' },
    { key: 'Lâm Đồng', name: 'Lâm Đồng' },
    { key: 'Lạng Sơn', name: 'Lạng Sơn' },
    { key: 'Lào Cai', name: 'Lào Cai' },
    { key: 'Long An', name: 'Long An' },
    { key: 'Nam Định', name: 'Nam Định' },
    { key: 'Nghệ An', name: 'Nghệ An' },
    { key: 'Ninh Bình', name: 'Ninh Bình' },
    { key: 'Ninh Thuận', name: 'Ninh Thuận' },
    { key: 'Phú Thọ', name: 'Phú Thọ' },
    { key: 'Phú Yên', name: 'Phú Yên' },
    { key: 'Quảng Bình', name: 'Quảng Bình' },
    { key: 'Quảng Nam', name: 'Quảng Nam' },
    { key: 'Quảng Ngãi', name: 'Quảng Ngãi' },
    { key: 'Quảng Ninh', name: 'Quảng Ninh' },
    { key: 'Quảng Trị', name: 'Quảng Trị' },
    { key: 'Sóc Trăng', name: 'Sóc Trăng' },
    { key: 'Sơn La', name: 'Sơn La' },
    { key: 'Tây Ninh', name: 'Tây Ninh' },
    { key: 'Thái Bình', name: 'Thái Bình' },
    { key: 'Thái Nguyên', name: 'Thái Nguyên' },
    { key: 'Thanh Hóa', name: 'Thanh Hóa' },
    { key: 'Thừa Thiên Huế', name: 'Thừa Thiên Huế' },
    { key: 'Tiền Giang', name: 'Tiền Giang' },
    { key: 'Thành phố Hồ Chí Minh', name: 'Thành phố Hồ Chí Minh' },
    { key: 'Trà Vinh', name: 'Trà Vinh' },
    { key: 'Tuyên Quang', name: 'Tuyên Quang' },
    { key: 'Vĩnh Long', name: 'Vĩnh Long' },
    { key: 'Vĩnh Phúc', name: 'Vĩnh Phúc' },
    { key: 'Yên Bái', name: 'Yên Bái' }
]
