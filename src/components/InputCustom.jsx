import React, { useContext, useState } from 'react';
import { FiSend } from "react-icons/fi";
import { BiImageAdd } from "react-icons/bi";
import { IoMdAttach } from "react-icons/io";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import {
    arrayUnion,
    doc,
    serverTimestamp,
    Timestamp,
    updateDoc
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const InputCustom = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleChange = (e) => {
        setText(e.target.value)
    }

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                (error) => {
                    //TODO:Handle Error
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
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

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        setText("");
        setImg(null);
    };

    const handleKeyDown = (e) => {
        if (e.code === "Enter") {
            handleSend()
        }
    };

    return (
        <div className='input'>
            <input
                type="text"
                placeholder="Nhập tin nhắn ...."
                onChange={handleChange}
                value={text}
                onKeyDown={handleKeyDown}
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
                    <BiImageAdd className='fs-3' />
                </label>
                <button
                    onClick={handleSend}
                    style={{ outline: "none", border: "none", background: "transparent" }}
                    type="submit"
                >
                    <FiSend className='fs-3' style={{ color: "5e5ad3" }} />
                </button>
            </div>
        </div>
    );
};

export default InputCustom;