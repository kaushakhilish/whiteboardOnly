import React, { useState, useEffect, useContext, useRef } from 'react';
import { BoardContext, BUTTONS, SHAPES } from '../../context/boardContext';
import ShapeProperties from '../utils/ShapeProperties';

const ShapeCover = ({ children, shape, setUndoShapes, isMousePressed, setShapes }) => {
    const [rectProps, setRectProps] = useState({})
    const [selected, setSelected] = useState(false);
    const [shapeGStyle, setShapeGStyle] = useState({});
    const {
        selectedShapeIds, 
        setSelectedShapeIds, 
        selectedBtn,
        movingShape, 
        setMovingShape, 
        setShapePropCompVals
    } = useContext(BoardContext);

    const gRef = useRef(null);


    useEffect(() => {

    }, [])

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
    }, [selectedShapeIds, movingShape])

    function shapeClickHandler(e) {
        // alert('Clicked')
        // if (selectedBtn === BUTTONS.SELECT.SELECT) {
        //     if (selected) {
        //         // setSelectedShapeIds(prv => {
        //         //     let newIds = prv.filter(id => { return id !== shape.id });
        //         //     return newIds
        //         // })
        //         setSelectedShapeIds([])
        //     } else {
        //         // setSelectedShapeIds(prv => [...prv, shape.id])\
        //         setSelectedShapeIds([shape.id])
        //     }
        // }
        let bbox = gRef.current.getBBox();
        if(shape){
            setShapePropCompVals({
                x: bbox.x + bbox.width / 2 - 20,
                y: bbox.y + bbox.height + 60,
                id: e.target.id
            })
        }
    }
    function shapeMouseMove(e) {
        if (selectedBtn === BUTTONS.ERASOR && isMousePressed) {
            // console.log('Erasor', e)
            setShapes(prv => {
                let shps = prv.filter(itm => {
                    if (itm.id === e.target.id) {
                        setUndoShapes(prv => [...prv, itm])
                        return false
                    }
                    return true
                })
                return shps
            });
        }
    }
    function onMouseOver(e) {
        if (selectedBtn === BUTTONS.SELECT.SELECT) {
            e.target.style.cursor = 'move';
        }
    }
    function onMouseOut(e) {
        e.target.style.cursor = 'auto';
    }

    function onMouseUp() {
        setMovingShape(false)
        if (selectedBtn === BUTTONS.SELECT.SELECT) {
            setSelectedShapeIds([shape.id])
        }
    }
    return (
        <>
            {<g ref={gRef}
                onMouseUp={onMouseUp}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={shapeClickHandler}
                onMouseMove={shapeMouseMove}
                style={{...shapeGStyle}}
            >
                {
                    (selected && !movingShape) && <rect x={rectProps.x} y={rectProps.y}
                        width={rectProps.w} height={rectProps.h}
                        style={rectProps.style}
                    />
                }
                {children}
                {/* {(selected && !movingShape) && <ShapeProperties rectProps={rectProps} />} */}
            </g>}
        </>
    );
}

export default ShapeCover;
