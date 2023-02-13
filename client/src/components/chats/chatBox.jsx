import React, { useState } from 'react';
import styles from './chatBox.module.css';
import Message from './message';
import ThreadList from './threadList';

const ChatBox = () => {
    const [showMsg, setShowMsg] = useState(true);

    return (
        <div className={styles.chatBox}>
            <header>
                <h4>Chat Box</h4>
            </header>
            {/* {!showMsg && <ThreadList  />} */}
            {showMsg && <div className={styles.msgContainer}>
                <Message mine message={{
                    user: {
                        name: 'Amit'
                    },
                    text: 'Hey',
                }} />
                <Message mine={false} message={{
                    user: {
                        name: 'karan'
                    },
                    text: 'Hello'
                }} />
                <Message mine message={{
                    user: {
                        name: 'Vikash'
                    },
                    text: 'Whats up!'
                }} />
                <Message mine={false} message={{
                    user: {
                        name: 'Amit'
                    },
                    text: 'Hey'
                }} />
                <Message mine message={{
                    user: {
                        name: 'Piyush'
                    },
                    text: 'Hello'
                }} />
                <Message mine={false} message={{
                    user: {
                        name: 'Amit'
                    },
                    text: 'Whats up!'
                }} />
            </div>}

            <div className={styles.inputBox}>
                <input placeholder='Enter Message' type="text" />
                <button className={styles.sendBtn}>Send</button>
            </div>
        </div>
    );
}

export default ChatBox;
