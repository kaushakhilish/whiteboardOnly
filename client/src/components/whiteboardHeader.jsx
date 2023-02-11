import React, {useContext} from 'react';
import { AppContext } from '../context/appContext';
import styles from './whiteBoardHeader.module.css';

const WhiteboardHeader = () => {
    const { user } = useContext(AppContext);

    return (
        <div className={styles.header}>
            <h2>Whiteboard</h2>
            <h2>{user.name}</h2>
        </div>
    );
}

export default WhiteboardHeader;
