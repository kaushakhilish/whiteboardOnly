import React, { useContext, useState } from 'react';
import { BoardContext } from '../context/boardContext';
import styles from './boardUserList.module.css';

const BoardUserList = () => {
    const [showList, setShowList] = useState(false);
    const { whiteboard } = useContext(BoardContext);

    return (
        <div style={{position: 'relative'}}>
            <button onClick={() => setShowList(prv => !prv)} className={styles.userListBtn}>{whiteboard.createdBy.name}</button>
           {showList && <ul className={styles.BoardUserList}>
                {whiteboard?.users?.map(user => <li key={user._id}>{user.name}</li>)}
            </ul>}
        </div>
    );
}

export default BoardUserList;
