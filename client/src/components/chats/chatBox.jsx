import React, { useContext, useState, useEffect } from 'react';
import { AppContext, URL } from '../../context/appContext';
import { BoardContext } from '../../context/boardContext';
import { SocketContext } from '../../context/socketProvider';
// import { MsgContext } from '../../context/msgContext';
import styles from './chatBox.module.css';
import Message from './message';

const ChatBox = () => {
    const [showMsg, setShowMsg] = useState(true);
    const { socket } = useContext(SocketContext);
    const { whiteboard } = useContext(BoardContext)
    const { user } = useContext(AppContext)
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket?.on('new_message', () => {
            // console.log('Dissconnected')
            getMessages()
        })
        return () => {
            socket?.removeListener('new_message');
        }
    }, [socket])

    useEffect(() => {
        getMessages()
        return () => {};
    }, []);

    function getMessages(){
        fetch(URL+'messages/'+whiteboard._id)
        .then(res => res.json())
        .then(data => {
            console.log('messages', data)
            setMessages(data)
        }).catch(err => console.error('Error getting Message: ', err))
    }

    function sendMessage(e) {
        e.preventDefault();
        // console.log(e)
        let msgText = e.target[0].value;
        let msg = {
            userId: user._id,
            userName: user.name,
            msgText: msgText,
        }
        console.log(msg, whiteboard, user)
        if (msg && whiteboard && user) {
            fetch(URL + 'messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    boardId: whiteboard._id,
                    message: msg,
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log('msg sent', data)
                    if(data.modifiedCount === 1){
                        socket?.emit('new_message', { roomId: whiteboard._id })
                        getMessages();
                    }
                })
                .catch(err => {
                    console.error('Error in Message: ', err)
                })
        }
        e.target[0].value = '';
    }

    return (
        <div className={styles.chatBox}>
            <header>
                <h4>Chat Box</h4>
            </header>
            {/* {!showMsg && <ThreadList  />} */}
            {showMsg && <div className={styles.msgContainer}>
                {
                    messages?.map(msg => <Message key={msg._id} message={msg} />)
                }
            </div>}

            <form onSubmit={sendMessage} className={styles.inputBox}>
                <input placeholder='Enter Message' type="text" />
                <button className={styles.sendBtn}>Send</button>
            </form>
        </div>
    );
}

export default ChatBox;
