import { collection, getDocs, query, setDoc, doc, where, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            });
        } catch (error) {
            setErr(true);
        }
    }

    const handlekey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async () => {
        //check whether the group (chats in firestore) exists, if not create
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid
        //create user chats
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                //create a chat in chats coleection
                await setDoc(doc(db, "chats", combinedId), { messages: [] })
                //create user chats
                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });
            }
        } catch (error) { }
        setUser(null);
        setUsername("");
    }

    return (
        <div className='search'>
            <div className='searchForm'>
                <input
                    type="text"
                    placeholder='Search a friends'
                    onKeyDown={handlekey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {err && <span>Người dùng không được tìm thấy</span>}
            {user && <div
                className="userChat"
                onClick={handleSelect}
            >
                <img src={user.photoURL} alt="Ảnh người dùng" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>}
        </div>
    )
}

export default Search;