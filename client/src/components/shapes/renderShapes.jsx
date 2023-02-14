import React, { useContext } from 'react';
import { BoardContext, BUTTONS, SHAPES } from '../../context/boardContext';
import ShapeCover from './shapeCover';

const RenderShapes = ({ shapes, setShapes, isMousePressed, setUndoShapes }) => {
    const { selectedBtn } = useContext(BoardContext);

    function onShapeClick(e) {
        // console.log(e.target.id)

        if (selectedBtn === BUTTONS.ERASOR) {
            setShapes(prv => {
                let shps = prv.filter(itm => itm.id !== e.target.id)
                return shps
            });
        }
    }

    function shapeMouseMove(e) {

        if (selectedBtn === BUTTONS.ERASOR && isMousePressed) {
            setShapes(prv => {
                let shps = prv.filter(itm => {
                    setUndoShapes(prv => [...prv, itm]);
                    return itm.id !== e.target.id
                })
                return shps
            });
        }
    }

    return (
        <>
            {shapes?.map(
                shape => {
                    switch (shape.type) {
                        case SHAPES.PENCIL:
                            return <ShapeCover key={shape.id} shape={shape}>
                                <polyline
                                    key={shape.id}
                                    id={shape.id}
                                    style={shape.style}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                    points={shape.props.points}
                                />
                            </ShapeCover>
                        case SHAPES.CIRCLE:
                            return <ShapeCover key={shape.id} shape={shape}>
                                <ellipse
                                    id={shape.id}
                                    style={shape.style}
                                    cx={shape.props.cx}
                                    cy={shape.props.cy}
                                    rx={shape.props.rx}
                                    ry={shape.props.ry}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                />
                            </ShapeCover>
                        case SHAPES.RECTANGLE:
                            return <ShapeCover key={shape.id} shape={shape}>
                                <rect
                                    key={shape.id}
                                    id={shape.id}
                                    style={shape.style}
                                    x={shape.props.x}
                                    y={shape.props.y}
                                    width={shape.props.width}
                                    height={shape.props.height}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                />
                            </ShapeCover>
                        case SHAPES.TRIANGLE:
                            return <ShapeCover key={shape.id} shape={shape}>
                                <polygon
                                    key={shape.id}
                                    id={shape.id}
                                    style={shape.style}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                    points={shape.props.points}
                                />
                            </ShapeCover>
                        case SHAPES.DIAMOND:
                            return <ShapeCover key={shape.id} shape={shape}>
                                <polygon
                                    key={shape.id}
                                    id={shape.id}
                                    style={shape.style}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                    points={shape.props.points}
                                />
                            </ShapeCover>
                        case SHAPES.HEXAGON:
                            return <ShapeCover key={shape.id} shape={shape}>
                                <polygon
                                    key={shape.id}
                                    id={shape.id}
                                    style={shape.style}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                    points={shape.props.points}
                                />
                            </ShapeCover>
                        case SHAPES.LINE.ONE_ARROW:
                            return <ShapeCover key={shape.id} shape={shape}>
                                <polyline
                                    id={shape.id}
                                    style={shape.style}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                    points={shape.props.points}
                                    markerEnd="url(#arrowhead)"
                                />
                            </ShapeCover>
                        case SHAPES.LINE.TWO_ARROW:
                            return <ShapeCover key={shape.id} shape={shape}>
                                <polyline
                                    id={shape.id}
                                    style={shape.style}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                    points={shape.props.points}
                                    markerEnd="url(#arrowhead)"
                                    markerStart="url(#startarrow)"
                                />
                            </ShapeCover>
                        case SHAPES.TEXT:
                            return <ShapeCover key={shape.id} shape={shape}>
                                <text
                                    key={shape.id}
                                    x={shape.props.x}
                                    y={shape.props.y}
                                    style={shape.style}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                >{shape.props.value}</text>
                            </ShapeCover>
                    }
                }
            )}
        </>
    );
}

export default RenderShapes;
