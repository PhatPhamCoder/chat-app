import React, { useState } from 'react';
import { FcAddImage } from "react-icons/fc";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            //Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${displayName + date}`);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        //Update profile
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        //create user on firestore
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });

                        //create empty user chats on firestore
                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");
                    } catch (err) {
                        console.log(err);
                        setErr(true);
                        setLoading(false);
                    }
                });
            });
        } catch (err) {
            setErr(true);
            setLoading(false);
        }
    };

    return (
        <div div className='formContainer' >
            <div className="formWrapper">
                <h2 className='logo'>PChat</h2>
                <span className='title'>????ng k?? t??i kho???n</span>
                <form onSubmit={handleSubmit}>
                    <input required type="text" placeholder='T??n ng?????i d??ng' />
                    <input required type="email" placeholder='Email' />
                    <input required type="password" placeholder='M???t kh???u' />
                    <input required style={{ display: "none" }} type="file" id="file" />
                    <label htmlFor="file" className='add-img d-flex align-items-center gap-3'>
                        <FcAddImage className='fs-1' />
                        <span>Th??m ???nh ?????i di???n</span>
                    </label>
                    <button className='btn btn-primary fw-bold'>????ng k??</button>
                    {err && <span>X???y ra s??? c???</span>}
                </form>
                <p>B???n ???? c?? t??i kho???n r???i? <Link to="/login" className='text-decoration-none'>????ng nh???p</Link></p>
            </div>
        </div>
    )
}

export default Register;