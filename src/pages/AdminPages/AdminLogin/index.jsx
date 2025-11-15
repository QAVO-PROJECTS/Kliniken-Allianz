import  { useState } from 'react';
import Cookies from 'js-cookie';
import './index.scss';
import banner from '/src/assets/LoginBanner.png';
import {useNavigate} from "react-router-dom";
import {usePostAdminLoginMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import { Eye, EyeOff } from 'lucide-react';
function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [postAdminLogin,{isLoading}] = usePostAdminLoginMutation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postAdminLogin({ email, password }).unwrap();
            showToast("Giriş uğurlu oldu !","success")
            setTimeout(navigate("/admin/category"), 2000);
            localStorage.setItem('i18nextLng', 'az');
            if (response?.statusCode === 200) {
                const token = response?.data?.token;
                console.log(response?.data?.token)
                const expireDate = new Date(response.data.expireDate);
                Cookies.set('klinikenToken', token, {
                    expires: 1,
                });
            } else {
                Cookies.set('klinikenToken', 'null');
            }
        } catch  {
            alert('Giriş zamanı xəta baş verdi:');
        }
    };

    return (
        <div className="login-panel">
            <img src={banner} alt="" className="login-banner" />
            <div className="login-form">
                <div className="title">
                    <h1>Sistemə daxil olun</h1>
                    <p>Sistemdəki funksiyalara və məlumatlara çıxış əldə etmək üçün aşağıdakı formanı istifadə edərək hesabınıza daxil olun.</p>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Istifadəçi adı</label>
                        <input
                            type="email"
                            placeholder="Istifadəçi adınızı daxil edin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group password-group">
                        <label>Şifrə</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Şifrənizi daxil edin"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Şifrəni gizlə' : 'Şifrəni göstər'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="submit" disabled={isLoading}>
                        {isLoading ? 'Yoxlanılır...' : 'Giriş et'}
                    </button>
                </form>
            </div>

            <img src={"back"} alt="" className="login-plane" />
        </div>
    );
}

export default AdminLogin;