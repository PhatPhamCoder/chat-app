import React, { useContext, useState } from 'react';
import { FiSend } from "react-icons/fi";
import { FcAddImage } from "react-icons/fc";
import { IoMdAttach } from "react-icons/io";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';

const InputCustom = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);
            uploadTask.on(
                (error) => {
                    // setErr(true)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL
                            }),
                        });
                    });
                }
            );
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                }),
            });
        }
    };

    return (
        <div className='input'>
            <input
                type="text"
                placeholder='Type something.....'
                onChange={(e) => setText(e.target.value)}
            />
            <div className='send'>
                <IoMdAttach className='fs-3' />
                <input
                    type="file"
                    style={{ display: "none" }}
                    id="file"
                    onChange={(e) => setImg(e.target.files[0])}
                />
                <label htmlFor="file">
                    <FcAddImage className='fs-3' />
                </label>
                <button
                    onClick={handleSend}
                    style={{ outline: "none", border: "none", background: "transparent" }}>
                    <FiSend className='fs-3' />
                </button>
            </div>
        </div>
    )
}

export default InputCustom;