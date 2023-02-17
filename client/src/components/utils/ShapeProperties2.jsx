import React, { useContext, useState, useEffect } from 'react';
import { BoardContext } from '../../context/boardContext';
import styles from './shapeProperties2.module.css';

const ShapeProperties2 = ({ rectProps }) => {
    const { shapePropCompVals } = useContext(BoardContext);
    const [style, setStyle] = useState({});

    useEffect(() => {
        if (shapePropCompVals) {
            setStyle({
                top:  shapePropCompVals.y,
                left: shapePropCompVals.x,
            })
        }
    }, [shapePropCompVals]);

    return (
        <div style={style} className={styles.shapeProperitesBox}>
            <p>Shape Properties</p>
        </div>
    );
}

export default ShapeProperties2;
