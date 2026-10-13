import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import logo from "../../../assets/Logo.png";
import { usePostAdminLoginMutation } from "../../../api/userApi.js";
import { setToken } from "../authStorage.js";
import showToast from "../../../utils/toast.js";
import "../../../styles/_admin.scss";
import "./index.scss";

const ERROR_TEXT = "E-poçt və ya şifrə yanlışdır. Zəhmət olmasa yenidən yoxlayın.";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [postAdminLogin, { isLoading }] = usePostAdminLoginMutation();
    const navigate = useNavigate();
    const emailId = useId();
    const passwordId = useId();
    const errorId = useId();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // Response shape: { statusCode: 200, data: { token, expireDate } }
            const response = await postAdminLogin({ email, password }).unwrap();
            const token = response?.data?.token;
            if (response?.statusCode !== 200 || !token) {
                setError(ERROR_TEXT);
                return;
            }
            setToken(token, response.data.expireDate);
            localStorage.setItem("i18nextLng", "az");
            showToast("Giriş uğurlu oldu!", "success");
            navigate("/admin/category", { replace: true });
        } catch {
            setError(ERROR_TEXT);
        }
    };

    return (
        <div className="login" data-theme="light">
            <main className="login__panel">
                <div className="login__inner">
                    <img src={logo} alt="Kliniken Allianz" className="login__logo" width="148" height="50" />

                    <div className="login__heading">
                        <h1>Sistemə daxil olun</h1>
                        <p>İdarə panelinə çıxış üçün hesab məlumatlarınızı daxil edin.</p>
                    </div>

                    <form className="login__form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="login__error" id={errorId} role="alert">
                                <AlertCircle size={18} aria-hidden="true" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="adm-field">
                            <label className="adm-label" htmlFor={emailId}>E-poçt</label>
                            <div className="login__control">
                                <Mail size={18} aria-hidden="true" />
                                <input
                                    id={emailId}
                                    className="adm-input"
                                    type="email"
                                    name="email"
                                    inputMode="email"
                                    spellCheck={false}
                                    autoComplete="username"
                                    placeholder="admin@kliniken-allianz.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-invalid={error ? true : undefined}
                                    aria-describedby={error ? errorId : undefined}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="adm-field">
                            <label className="adm-label" htmlFor={passwordId}>Şifrə</label>
                            <div className="login__control">
                                <Lock size={18} aria-hidden="true" />
                                <input
                                    id={passwordId}
                                    className="adm-input"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    aria-invalid={error ? true : undefined}
                                    aria-describedby={error ? errorId : undefined}
                                    required
                                />
                                <button
                                    type="button"
                                    className="adm-icon-btn login__toggle"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Şifrəni gizlə" : "Şifrəni göstər"}
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn--primary btn--block login__submit" disabled={isLoading} aria-busy={isLoading || undefined}>
                            {isLoading && <Loader2 size={18} className="adm-spin" aria-hidden="true" />}
                            {isLoading ? "Yoxlanılır…" : "Daxil ol"}
                        </button>
                    </form>

                    <p className="login__foot">© {new Date().getFullYear()} Kliniken Allianz</p>
                </div>
            </main>

            <aside className="login__aside" aria-hidden="true">
                <div className="login__aside-content">
                    <span className="login__badge">
                        <ShieldCheck size={16} strokeWidth={1.75} aria-hidden="true" />
                        İdarə paneli
                    </span>
                    <h2>Klinikalar, həkimlər və xidmət paketləri bir yerdə.</h2>
                    <p>Kateqoriyaları, klinikaları, turları və müraciətləri vahid paneldən idarə edin.</p>
                </div>
            </aside>
        </div>
    );
}

export default AdminLogin;
