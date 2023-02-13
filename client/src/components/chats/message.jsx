import React from 'react';
import styles from './message.module.css'

const Message = ({ mine, message }) => {

    let mineMsgClass = mine ? styles.myMsg : '';

    return (
        <div className={styles.msgParent} style={mine ? { alignItems: 'flex-end' } : {}} >
            <p className={styles.username}>{message?.user?.name}</p>
            <div className={`${styles.msg} ${mineMsgClass}`}>
                <p>{message.text}</p>
            </div>
        </div>
    );
}

export default Message;
