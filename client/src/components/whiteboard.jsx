import React, { useContext, useEffect, useRef, useState } from 'react';
import ButtonBox from './buttonBox';
import SelectionRect from './utils/selectionRect';
import styles from './whiteboard.module.css';
import { BoardContext, BUTTONS, STROKE_SIZES } from '../context/boardContext';
import RenderShapes from './shapes/renderShapes';
import SvgDefs from './svgDefs';
import EditInput from './editInput';
import { URL } from '../context/appContext';
import { SocketContext } from '../context/socketProvider';
import WhiteboardHeader from './whiteboardHeader';

const Whiteboard = () => {

    const {
        selectedBtn,
        selectedStrokeSize,
        selectedStrokeColor,
        selectedFillColor,
        whiteboard,
    } = useContext(BoardContext);

    const { socket } = useContext(SocketContext);

    const [isMousePressed, setIsMousePressed] = useState(false);
    const [shapes, setShapes] = useState([]);
    const [undoShapes, setUndoShapes] = useState([]);
    const [curInd, setCurInd] = useState(0); //current Index
    const [selectionRectStyle, setSelectionRectStyle] = useState(null)
    const [editInputValue, setEditInputValue] = useState('');
    const [editInputPos, setEditInputPos] = useState(null);
    const board = useRef(null);
    const editInputRef = useRef(null);

    useEffect(() => {
        console.log('white', whiteboard)
        if (whiteboard?.shapes) {
            setShapes(whiteboard.shapes)
        }
    }, [whiteboard])


    function updateShapesOnDb() {
        console.log('shahpes', whiteboard)
        if (shapes && whiteboard) {
            fetch(URL + 'whitebaord', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: whiteboard._id,
                    shapes: shapes,
                })
            }).then(res => res.json())
                .then(data => {
                    console.log('data', data);
                    if (data.modifiedCount === 1) {
                        console.log('emmmiting update')
                        socket?.emit('board_updated', { roomId: whiteboard._id, userId: '1forNow' })
                    }
                })
                .catch(err => console.log(err))
        }
    }


    function createLine(lineType, ox, oy) {
        console.log(lineType)
        let strokeWIdth;
        if (selectedStrokeSize === STROKE_SIZES.STROKE_THIN) { strokeWIdth = '1' }
        if (selectedStrokeSize === STROKE_SIZES.STROKE_MID) { strokeWIdth = '3' }
        if (selectedStrokeSize === STROKE_SIZES.STROKE_THICK) { strokeWIdth = '5' }

        let props = {
            points: `${ox},${oy} `,
        }
        let style = {
            fill: selectedFillColor,
            stroke: selectedStrokeColor,
            strokeWidth: strokeWIdth,
            opacity: 1
        }

        if (lineType === BUTTONS.DRAW.HIGHLIGHTER) {
            style.opacity = 0.5;
        }
        let shape = {
            id: Math.random() + '',
            type: BUTTONS.DRAW.PENCIL,
            style: style,
            props: props,
        }
        if (lineType === BUTTONS.LINE.SIMPLE) {
            props.points = `${ox},${oy} ${ox},${oy} `;
        }
        if (lineType === BUTTONS.LINE.ONE_ARROW || lineType === BUTTONS.LINE.TWO_ARROW) {
            props.points = `${ox},${oy} ${ox},${oy} `;
            shape.type = lineType;
        }
        // console.log(shape)
        return shape;
    }

    function createShape(type, style, props) {
        let shape = {
            id: Math.random() + '',
            type: type,
            style: style,
            props: props,
        }
        return shape;
    }

    function startDrawing(e) {
        setIsMousePressed(true);

        let ox = e.nativeEvent.offsetX;
        let oy = e.nativeEvent.offsetY;
        let strokeWIdth;

        //Setting styles
        if (selectedStrokeSize === STROKE_SIZES.STROKE_THIN) { strokeWIdth = '1' }
        if (selectedStrokeSize === STROKE_SIZES.STROKE_MID) { strokeWIdth = '3' }
        if (selectedStrokeSize === STROKE_SIZES.STROKE_THICK) { strokeWIdth = '5' }

        let style = {
            fill: selectedFillColor,
            stroke: selectedStrokeColor,
            strokeWidth: strokeWIdth,
        }

        if (selectedBtn === BUTTONS.SELECT.SELECT) {
            setSelectionRectStyle({
                fill: '#f6e7fdb5',
                strokeWidth: '1',
                stroke: '#aa14f0',
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
                width: 0,
                height: 0,
            })
            setCurInd(shapes.length);
        }
        if (selectedBtn === BUTTONS.DRAW.PENCIL || selectedBtn === BUTTONS.DRAW.HIGHLIGHTER) {
            let shape = createLine(selectedBtn, ox, oy);
            setShapes(prv => [...prv, shape])
            setCurInd(shapes.length);

            console.log('shape Created')
        }
        if (selectedBtn === BUTTONS.SHAPES.CIRCLE) {
            let props = {
                cx: ox,
                cy: oy,
                rx: 0,
                ry: 0,
            }
            let shape = createShape(selectedBtn, style, props)
            setShapes(prv => [...prv, shape])
            setCurInd(shapes.length);
        }
        if (selectedBtn === BUTTONS.SHAPES.RECTANGLE) {
            let props = {
                x: ox,
                y: oy,
                width: 0,
                height: 0,
            }
            let shape = createShape(selectedBtn, style, props)
            setShapes(prv => [...prv, shape])
            setCurInd(shapes.length);
        }
        if (selectedBtn === BUTTONS.SHAPES.TRIANGLE) {
            let props = {
                x: ox,
                y: oy,
                point1: { ox: ox, oy: oy },
                point2: { ox: ox, oy: oy },
                point3: { ox: ox, oy: oy },
                points: `${ox},${oy} ${ox},${oy} ${ox},${oy}`
            }
            let shape = createShape(selectedBtn, style, props)
            setShapes(prv => [...prv, shape])
            setCurInd(shapes.length);
        }
        if (selectedBtn === BUTTONS.SHAPES.DIAMOND) {
            let props = {
                x: ox,
                y: oy,
                point1: { ox: ox, oy: oy },
                point2: { ox: ox, oy: oy },
                point3: { ox: ox, oy: oy },
                point4: { ox: ox, oy: oy },
                points: `${ox},${oy} ${ox},${oy} ${ox},${oy} ${ox},${oy}`
            }
            let shape = createShape(selectedBtn, style, props)
            setShapes(prv => [...prv, shape])
            setCurInd(shapes.length);
        }
        if (selectedBtn === BUTTONS.SHAPES.HEXAGON) {
            let props = {
                x: ox,
                y: oy,
                point1: { ox: ox, oy: oy },
                point2: { ox: ox, oy: oy },
                point3: { ox: ox, oy: oy },
                point4: { ox: ox, oy: oy },
                point5: { ox: ox, oy: oy },
                point6: { ox: ox, oy: oy },
                points: `${ox},${oy} ${ox},${oy} ${ox},${oy} ${ox},${oy} ${ox},${oy} ${ox},${oy}`
            }
            let shape = createShape(selectedBtn, style, props)
            setShapes(prv => [...prv, shape])
            setCurInd(shapes.length);
        }
        if (selectedBtn === BUTTONS.LINE.SIMPLE || selectedBtn === BUTTONS.LINE.ONE_ARROW || selectedBtn === BUTTONS.LINE.TWO_ARROW) {
            let shape = createLine(selectedBtn, ox, oy);
            console.log('shape Created', shape)

            setShapes(prv => [...prv, shape])
            setCurInd(shapes.length);
        }
        if (selectedBtn === BUTTONS.TEXT) {
            setEditInputPos({ x: ox, y: oy });
            // let edtInp = document.querySelector('#editInput');
            // edtInp.focus();
            // console.log(edtInp)
        }
    }
    function endDrawing() {
        setIsMousePressed(false)
        setSelectionRectStyle(null)
        if (selectedBtn !== BUTTONS.SELECT.SELECT && selectedBtn !== BUTTONS.SELECT.MOVE) {
            updateShapesOnDb();
        }
    }
    function keepDrawing(e) {
        let ox = e.nativeEvent.offsetX;
        let oy = e.nativeEvent.offsetY;

        if (isMousePressed) {
            if (selectedBtn === BUTTONS.SELECT.SELECT) {
                setSelectionRectStyle(prv => {
                    let w = Math.abs(ox - Number(prv.x));
                    let h = Math.abs(oy - Number(prv.y));

                    let newStyle = { ...prv };
                    newStyle.width = w;
                    newStyle.height = h;

                    return newStyle;
                })
            }
            if (selectedBtn === BUTTONS.DRAW.PENCIL || selectedBtn === BUTTONS.DRAW.HIGHLIGHTER) {
                console.log('pencil')
                let points = shapes[curInd].props.points + `${ox},${oy} `;
                setShapes(prv => {
                    let id = prv[curInd].id;
                    let line = document.getElementById(id);
                    line?.setAttribute('points', points);
                    prv[curInd].props.points = points;
                    return prv;
                })
            }
            if (selectedBtn === BUTTONS.SHAPES.CIRCLE) {
                setShapes(prv => {
                    let id = prv[curInd].id;
                    let circle = document?.getElementById(id);
                    let rx = Math.abs(ox - Number(shapes[curInd].props.cx));
                    let ry = Math.abs(oy - Number(shapes[curInd].props.cy));
                    circle?.setAttribute('rx', rx.toString());
                    circle?.setAttribute('ry', ry.toString());
                    prv[curInd].props.rx = rx;
                    prv[curInd].props.ry = ry;
                    return prv;
                })
            }
            if (selectedBtn === BUTTONS.SHAPES.RECTANGLE) {
                setShapes(prv => {
                    let id = prv[curInd].id;
                    let rect = document?.getElementById(id);
                    let w = Math.abs(ox - Number(shapes[curInd].props.x));
                    let h = Math.abs(oy - Number(shapes[curInd].props.y));
                    rect?.setAttribute('width', w.toString());
                    rect?.setAttribute('height', h.toString());
                    prv[curInd].props.width = w;
                    prv[curInd].props.height = h;
                    return prv;
                })
            }
            if (selectedBtn === BUTTONS.SHAPES.TRIANGLE) {
                // console.log('traingle')
                let id = shapes[curInd].id;
                let shapeEl = document.getElementById(id);
                // console.log(shapeEl, shapeEl.points)
                let shapePoints = shapeEl.points;
                let point1 = { ox: (shapePoints[1].x - (ox - shapePoints[1].x)), oy: oy };
                let point2 = shapePoints[1];
                let point3 = { ox: ox, oy: oy };
                let points = `${point1.ox},${point1.oy} ${point2.x},${point2.y} ${point3.ox},${point3.oy}`;

                setShapes(prv => {
                    shapeEl?.setAttribute('points', points);
                    prv[curInd].props.points = points;
                    return prv;
                })
            }
            if (selectedBtn === BUTTONS.SHAPES.DIAMOND) {
                let id = shapes[curInd].id;
                let shapeEl = document.getElementById(id);
                let shapePoints = shapeEl.points;
                let point1 = { ox: ox, oy: oy };
                let point2 = shapePoints[1];
                let point3 = { ox: (shapePoints[1].x - (ox - shapePoints[1].x)), oy: oy };
                let point4 = { ox: shapePoints[1].x, oy: (shapePoints[1].y + (oy - shapePoints[1].y) * 2) };
                let points = `${point1.ox},${point1.oy} ${point2.x},${point2.y} ${point3.ox},${point3.oy} ${point4.ox},${point4.oy}`;

                setShapes(prv => {
                    shapeEl?.setAttribute('points', points);
                    prv[curInd].props.points = points;
                    return prv;
                })
            }
            if (selectedBtn === BUTTONS.SHAPES.HEXAGON) {
                let id = shapes[curInd].id;
                let shapeEl = document.getElementById(id);
                let shapePoints = shapeEl.points;
                let point1 = { ox: ox, oy: oy };
                let point2 = { ox: ox, oy: (shapePoints[2].y + (oy - shapePoints[2].y) / 3) };
                let point3 = shapePoints[2];
                let point4 = { ox: (shapePoints[2].x - (ox - shapePoints[2].x)), oy: (shapePoints[2].y + (oy - shapePoints[2].y) / 3) };
                let point5 = { ox: (shapePoints[2].x - (ox - shapePoints[2].x)), oy: oy };
                let point6 = { ox: shapePoints[2].x, oy: (shapePoints[2].y + (oy - shapePoints[2].y) * 1.35) };
                let points = `${point1.ox},${point1.oy} ${point2.ox},${point2.oy} ${point3.x},${point3.y} ${point4.ox},${point4.oy} ${point5.ox},${point5.oy} ${point6.ox},${point6.oy}`;

                setShapes(prv => {
                    shapeEl?.setAttribute('points', points);
                    prv[curInd].props.points = points;
                    return prv;
                })
            }
            if (selectedBtn === BUTTONS.LINE.SIMPLE || selectedBtn === BUTTONS.LINE.ONE_ARROW || selectedBtn === BUTTONS.LINE.TWO_ARROW) {
                // let points = shapes[curInd].props.points + `${ox},${oy} `;
                let id = shapes[curInd].id;
                let line = document.getElementById(id);
                let linePoints = line.points;
                let point1 = { ox: linePoints[0].x, oy: linePoints[0].y };
                let points = `${point1.ox},${point1.oy} ${ox},${oy}`
                setShapes(prv => {
                    line?.setAttribute('points', points);
                    prv[curInd].props.points = points;
                    return prv;
                })
            }

        }
    }

    function undoMove() {
        console.log('undo move')
        // if (shapes.length) {
        let shape = shapes[shapes.length - 1];
        let newShapes = shapes.filter((shp, i) => {
            if (i !== shapes.length - 1) {
                // setUndoShapes(prv1 => [...prv1, shp])
                return true
            }
        });
        if (newShapes, shape) {
            setShapes(newShapes);
            setUndoShapes(prv1 => [...prv1, shape]);
            // setTimeout(() => {updateShapesOnDb()}, 1000)
        }
    }
    function redoMove() {
        let unShape = undoShapes[undoShapes.length - 1];
        let newUnShapes = undoShapes.filter((shp, i, shpArr) => {
            if (i !== shpArr.length - 1) {
                return true
            }
        });
        if (newUnShapes, unShape) {
            setShapes(prv1 => [...prv1, unShape]);
            setUndoShapes(newUnShapes)
            // setTimeout(() => {updateShapesOnDb()}, 1000)
        }
    }

    function editInputChange(e) {
        console.log(editInputValue)
        setEditInputValue(e.target.value);
    }

    function setTextShape(e) {
        if (editInputValue && editInputPos) {
            let strokeWIdth;
            if (selectedStrokeSize === STROKE_SIZES.STROKE_THIN) { strokeWIdth = '1' }
            if (selectedStrokeSize === STROKE_SIZES.STROKE_MID) { strokeWIdth = '3' }
            if (selectedStrokeSize === STROKE_SIZES.STROKE_THICK) { strokeWIdth = '5' }

            let style = {
                fill: selectedFillColor,
                stroke: selectedStrokeColor,
                strokeWidth: strokeWIdth,
                font: 'bold 30px sans-serif'
            }
            let props = {
                value: editInputValue,
                x: editInputPos.x,
                y: editInputPos.y
            }
            let textShape = createShape(BUTTONS.TEXT, style, props);
            setShapes(prv => [...prv, textShape]);
            setEditInputValue('')
            setEditInputPos(null)
        }
    }

    function fetchBoardData(id) {
        fetch(`${URL}whiteboard/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log('single Whiteboard', data)
                if (data.shapes) {
                    setShapes(data.shapes);
                }
            }).catch(err => console.error(err));
    }

    useEffect(() => {
        console.log('socketChange', socket)
        socket?.on('board_updated', ({ userId, BoardUsers }) => {
            console.log('Board Updated', BoardUsers)
            // setUsers(BoardUsers);
            // alert('Board Updated')
            fetchBoardData(whiteboard._id);
        })
        socket?.on('New_User', ({ BoardUsers }) => {
            console.log('New User', BoardUsers)
            // setUsers(BoardUsers);
        })
        socket?.on('User_Disconnect', ({ BoardUsers }) => {
            console.log('Disconnected', BoardUsers)
            // setUsers(BoardUsers);
        })
        socket?.on('disconnect', () => {
            console.log('Dissconnected')
        })

        return () => {
            socket?.removeListener('board_updated')
            socket?.removeListener('New_User')
            socket?.removeListener('disconnect')
        }
    }, [socket])


    return (
        <>
            <div className={styles.whiteboard}>
                <WhiteboardHeader />
                <ButtonBox
                    undoMove={undoMove}
                    redoMove={redoMove}
                    board={board}
                    updateShapesOnDb={updateShapesOnDb}
                    isMousePressed={isMousePressed}
                />
                {editInputPos && <EditInput editInputPos={editInputPos} editInputChange={editInputChange} setTextShape={setTextShape} />}
                <svg
                    ref={board}
                    viewBox="0 0 1920 1080"
                    width={1920}
                    height={1080}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseMove={keepDrawing}
                >
                    <SvgDefs />
                    {(isMousePressed && selectionRectStyle) && <SelectionRect selectionRectStyle={selectionRectStyle} />}
                    {shapes && <RenderShapes isMousePressed={isMousePressed} setShapes={setShapes} shapes={shapes} />}
                </svg>
            </div>
        </>

    );
}

export default Whiteboard;
