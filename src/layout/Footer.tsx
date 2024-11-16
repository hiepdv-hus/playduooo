import logoP from '../images/home/logoP.svg'
import fb from '../images/home/facebook.svg'
import ig from '../images/home/instagram.svg'
import tiktok from '../images/home/tiktok.svg'
import dangky from '../images/home/dang-ky-web-bct.svg'

import "./footer.scss";
export default function Footer() {
    return (
        <div className='footer w-full bg-[#D9D9D9] py-[20px]'>
            <div className="footer-lst">
                <div className="footer-item">
                    <div className='flex items-center'>
                        <img src={logoP} alt=""/>
                        <div className='logo-text text-[20px] font-[600]'>PLAYERDUO.VN</div>
                    </div>
                    <div className='px-[15px]'>
                        <div className='text-[14px] py-[10px]'>PlayerDuo luôn bên nhau mọi lúc, mọi nơi!</div>
                        <div className='flex items-center'>
                            <img src={fb} alt="" className="w-[25px] h-[22.6px]"/>
                            <img src={ig} alt="" className="w-[25px] h-[22.6px]"/>
                            <img src={tiktok} alt="" className="w-[25px] h-[22.6px]"/>
                            
                        </div>
                    </div>
                </div>
                <div className="footer-item">
                    <div className='font-[600] text-[16px]'>CHUYÊN MỤC</div>
                    <div className='text-[14px] pt-[10px]'>Trang chủ</div>
                    <div className='text-[14px] pt-[6px]'>Dịch vụ</div>
                    <div className='text-[14px] pt-[6px]'>Highlight</div>
                    <div className='text-[14px] pt-[6px]'>Nạp rút PD</div>
                </div>
                <div className="footer-item">
                    <div className='font-[600] text-[16px]'>VỀ CHÚNG TÔI</div>
                    <div className='text-[14px] pt-[10px]'>Liên hệ</div>
                    <div className='text-[14px] pt-[6px]'>Giới thiệu đồng hành</div>
                    <div className='text-[14px] pt-[6px]'>Chính sách bảo mật</div>
                    <div className='text-[14px] pt-[6px]'>Điều khoản dịch vụ</div>
                </div>
                <div className="footer-item">
                    <div className='font-[600] text-[16px]'>VỀ CHÚNG TÔI</div>
                    <div className='pt-[40px]'>
                        <img src={dangky} alt=""/>
                    </div>
                </div>
            </div>


        </div>
    );
}