import React, { useContext } from 'react';
import { AppContext } from '../context/appContext';
import { BoardContext } from '../context/boardContext';
import styles from './whiteBoardHeader.module.css';
import { URL } from '../context/appContext';

const WhiteboardHeader = () => {
    const { user } = useContext(AppContext);
    const { whiteboard } = useContext(BoardContext);

    function addUser() {
        let email = prompt('Enter Email');
        console.log(email, whiteboard, user)
        if (email) {
            fetch(URL + 'addUser', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    boardId: whiteboard._id,
                    userEmail: email
                })
            }).then(res => {
                if(res.status === 200){
                    alert('User Added')
                }
                res.json()
            })
                .then(data => {
                    console.log(data)
                }).catch(err => {
                    console.error('Error adding user: ', err)
                    alert('Something went wrong!')
                })
        }
    }

    return (
        <div className={styles.header}>
            <h4>{whiteboard.name}</h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h4 style={{ marginRight: '20px' }}>{user.name}</h4>
                <button style={{padding: '5px 10px', borderRadius: '20px', border: '2px solid blueviolet', cursor: 'pointer'}} onClick={addUser}>Add User</button>
            </div>
        </div>
    );
}

export default WhiteboardHeader;
