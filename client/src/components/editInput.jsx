import React, { useEffect, useRef } from 'react';
import styles from './editInput.module.css';

const EditInput = ({ editInputPos, editInputChange, setTextShape }) => {
    const editInput = useRef(null);

    useEffect(() => {
        editInput?.current?.focus();
    }, [editInput, editInputPos])

    return (
        <form onSubmit={e => {
            e.preventDefault();
            editInput.current.value = '';
            setTextShape();
        }}>
            <input
                className={styles.editInput}
                style={{
                    position: 'fixed',
                    top: editInputPos.y + 'px',
                    left: editInputPos.x + 'px'
                }}
                ref={editInput}
                onChange={editInputChange}
                onBlur={setTextShape}
                type={'text'}
                placeholder={'ENTER TEXT'}
                tabIndex={0}
            />
        </form>
    );
}

export default EditInput;
