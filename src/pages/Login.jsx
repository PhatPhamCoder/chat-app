import React, { useContext, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { auth } from '../firebase';
// import { GoogleAuthProvider } from "firebase/auth";
// import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    // const { user } = useContext(AuthContext);

    // const handleLoginWithGoogle = async () => {
    //     const provider = new GoogleAuthProvider();

    //     const res = await signInWithRedirect(auth, provider);
    //     console.log({ res })

    //     if (user) {
    //         navigate("/")
    //     }
    // }

    // if (user?.uid) {
    //     navigate("/login")
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/")
        } catch (err) {
            setErr(true);
        }
    };
    return (
        <div className='formContainer'>
            <div className="formWrapper">
                <h2 className='logo'>PChat</h2>
                <span className='title'>Đăng nhập tài khoản</span>
                {/* <div className='d-flex mx-auto'>
                    <button
                        variant="contained"
                        onClick={handleLoginWithGoogle}
                    >
                        Login with Google
                    </button>
                </div> */}
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' />
                    <input type="password" placeholder='Mật khẩu' />
                    <button className='btn btn-primary fw-bold'>Đăng nhập</button>
                    {err && <span>Xảy ra sự cố</span>}
                </form>
                <p>Bạn có tài khoản chưa? <Link to="/register" className='text-decoration-none'>Đăng ký</Link></p>
            </div>
        </div>
    )
}

export default Login;