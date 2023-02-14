import React, { useState, useEffect, useContext, useRef } from 'react';
import { BoardContext, SHAPES } from '../../context/boardContext';

const ShapeCover = ({ children, shape }) => {
    const [rectProps, setRectProps] = useState({})
    const [selected, setSelected] = useState(false);
    const { selectedShapeIds, setSelectedShapeIds } = useContext(BoardContext);
    const gRef = useRef(null);

    useEffect(() => {
        let bbox = gRef.current.getBBox();

        let style = {
            fill: '#fff0',
            stroke: 'blueviolet',
            strokeWidth: '2px'
        }

        let x = bbox.x - 5;
        let y = bbox.y - 5;
        let w = bbox.width + 10;
        let h = bbox.height + 10;

        setRectProps({
            x: x,
            y: y,
            w: w,
            h: h,
            style: style
        })

        if (selectedShapeIds.includes(shape.id)) {
            setSelected(true);
            console.log(rectProps)
        } else {
            setSelected(false);
        }
    }, [selectedShapeIds])

    function shapeClickHandler() {
        // alert('Clicked')
        if (selected) {
            // setSelectedShapeIds(prv => {
            //     let newIds = prv.filter(id => { return id !== shape.id });
            //     return newIds
            // })
            setSelectedShapeIds([])
        } else {
            // setSelectedShapeIds(prv => [...prv, shape.id])\
            setSelectedShapeIds([shape.id])
        }
    }
    return (
        <g ref={gRef} onClick={shapeClickHandler}>
            {
                selected && <rect x={rectProps.x} y={rectProps.y}
                    width={rectProps.w} height={rectProps.h}
                    style={rectProps.style}
                />
            }
            {children}
        </g>
    );
}

export default ShapeCover;
