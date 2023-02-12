import React, { useContext } from 'react';
import { BoardContext, BUTTONS, SHAPES } from '../../context/boardContext';

const RenderShapes = ({ shapes, setShapes, isMousePressed, setUndoShapes }) => {
    const { selectedBtn } = useContext(BoardContext);

    function onShapeClick(e) {
        console.log(e.target.id)

        if (selectedBtn === BUTTONS.ERASOR) {
            setShapes(prv => {
                let shps = prv.filter(itm => itm.id !== e.target.id)
                return shps
            });
        }
    }

    function shapeMouseMove(e) {
        console.log(e.target.id)

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
                            return <polyline
                                key={shape.id}
                                id={shape.id}
                                style={shape.style}
                                // className={selectedObjectId ? '' : ''}
                                onClick={onShapeClick}
                                onMouseMove={shapeMouseMove}
                                // onMouseEnter={onHover}
                                // onMouseLeave={onHoverEnd}
                                points={shape.props.points}
                            />
                        case SHAPES.CIRCLE:
                            return <ellipse
                                key={shape.id}
                                id={shape.id}
                                style={shape.style}
                                cx={shape.props.cx}
                                cy={shape.props.cy}
                                rx={shape.props.rx}
                                ry={shape.props.ry}
                                onClick={onShapeClick}
                                onMouseMove={shapeMouseMove}
                            // onMouseLeave={onHoverEnd}
                            // onMouseEnter={onHover}
                            />
                        case SHAPES.RECTANGLE:
                            return <rect
                                key={shape.id}
                                id={shape.id}
                                style={shape.style}
                                x={shape.props.x}
                                y={shape.props.y}
                                width={shape.props.width}
                                height={shape.props.height}
                                onClick={onShapeClick}
                                onMouseMove={shapeMouseMove}
                            // onMouseLeave={onHoverEnd}
                            // onMouseEnter={onHover}
                            />
                        case SHAPES.TRIANGLE:
                            return <polygon
                                key={shape.id}
                                id={shape.id}
                                style={shape.style}
                                // className={selectedObjectId ? '' : ''}
                                // onClick={selectShape}
                                // onMouseEnter={onHover}
                                // onMouseLeave={onHoverEnd}
                                onClick={onShapeClick}
                                onMouseMove={shapeMouseMove}
                                points={shape.props.points}
                            />
                        case SHAPES.DIAMOND:
                            return <polygon
                                key={shape.id}
                                id={shape.id}
                                style={shape.style}
                                // className={selectedObjectId ? '' : ''}
                                // onClick={selectShape}
                                // onMouseEnter={onHover}
                                // onMouseLeave={onHoverEnd}
                                onClick={onShapeClick}
                                onMouseMove={shapeMouseMove}
                                points={shape.props.points}
                            />
                        case SHAPES.HEXAGON:
                            return <polygon
                                key={shape.id}
                                id={shape.id}
                                style={shape.style}
                                // className={selectedObjectId ? '' : ''}
                                // onClick={selectShape}
                                // onMouseEnter={onHover}
                                // onMouseLeave={onHoverEnd}
                                onClick={onShapeClick}
                                onMouseMove={shapeMouseMove}
                                points={shape.props.points}
                            />
                        // case SHAPES.LINE.SIMPLE:
                        //     return <line
                        //         key={shape.id}
                        //         id={shape.id}
                        //         style={shape.style}
                        //         // className={selectedObjectId ? '' : ''}
                        //         // onClick={selectShape}
                        //         // onMouseEnter={onHover}
                        //         // onMouseLeave={onHoverEnd}
                        //         points={shape.props.points}
                        //     />
                        case SHAPES.LINE.ONE_ARROW:
                            return <React.Fragment key={shape.id}>
                                <polyline
                                    // key={shape.id}
                                    id={shape.id}
                                    style={shape.style}
                                    // className={selectedObjectId ? '' : ''}
                                    // onClick={selectShape}
                                    // onMouseEnter={onHover}
                                    // onMouseLeave={onHoverEnd}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                    points={shape.props.points}
                                    markerEnd="url(#arrowhead)"
                                />
                            </React.Fragment>
                        case SHAPES.LINE.TWO_ARROW:
                            return <React.Fragment key={shape.id}>
                                <polyline
                                    // key={shape.id+'22'}
                                    id={shape.id}
                                    style={shape.style}
                                    // className={selectedObjectId ? '' : ''}
                                    // onClick={selectShape}
                                    // onMouseEnter={onHover}
                                    // onMouseLeave={onHoverEnd}
                                    onClick={onShapeClick}
                                    onMouseMove={shapeMouseMove}
                                    points={shape.props.points}
                                    markerEnd="url(#arrowhead)"
                                    markerStart="url(#startarrow)"
                                />
                            </React.Fragment>
                        case SHAPES.TEXT:
                            return <text
                                key={shape.id}
                                x={shape.props.x}
                                y={shape.props.y}
                                style={shape.style}
                                onClick={onShapeClick}
                                onMouseMove={shapeMouseMove}
                            >{shape.props.value}</text>
                        // case SHAPES.TEXT:
                        //     return <Text
                        //         key={shape.id}
                        //         onHoverEnd={onHoverEnd}
                        //         onHover={onHover}
                        //         shapeData={shape}
                        //         selected={selectedObjectId === shape.id}
                        //         setSelectedObjectId={setSelectedObjectId}
                        //     />
                    }
                }
            )}
        </>
    );
}

export default RenderShapes;
