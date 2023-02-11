import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './buttonBox.module.css'
import { BsCursor, BsEraser } from 'react-icons/bs'
import { TbPencil, TbGripHorizontal } from 'react-icons/tb'
import { IoShapesOutline } from 'react-icons/io5'
import { HiOutlineMinus, HiOutlineUpload } from 'react-icons/hi'
import { RxText } from 'react-icons/rx'
import { CgNotes } from 'react-icons/cg'
import { GrUndo, GrRedo } from 'react-icons/gr'
import ShapeButtonBox from './shapeButtonBox';
import LinesButtonBox from './linesButtonBox';
import ActionButton from './utils/actionButton';
import MoveNGrabButtonBox from './MoveNGrabButtonBox';
import PencilBox from './pencilBox';
import { BoardContext, BUTTONS } from '../context/boardContext';
import erasorImg from '../assets/erasor.svg';

const ButtonBox = ({ board, isMousePressed, undoMove, redoMove, updateShapesOnDb }) => {
    const {
        selectedBtn,
        setSelectedBtn,
        selectedStrokeSize,
        setSelectedStrokeSize,
        selectedStrokeColor,
        setSelectedStrokeColor
    } = useContext(BoardContext);

    const [openShapes, setOpenShapes] = useState(false);
    const [openLines, setOpenLines] = useState(false);
    const [openMoveNGrab, setOpenMoveNGrab] = useState(false);
    const [openPencilBox, setOpenPencilBox] = useState(false);
    const [isGrabbed, setIsGrabbed] = useState(false);

    const buttonBox = useRef(null);

    useEffect(() => {
        if(selectedBtn === BUTTONS.ERASOR){
            board.current.style.cursor = `url(${erasorImg}), auto`;
        }else{
            board.current.style.cursor = 'auto';
        }
        setOpenShapes(hasActiveNestedButtons(BUTTONS.SHAPES))
        setOpenLines(hasActiveNestedButtons(BUTTONS.LINE))
        setOpenMoveNGrab(hasActiveNestedButtons(BUTTONS.SELECT))
        setOpenPencilBox(hasActiveNestedButtons(BUTTONS.DRAW))
    }, [selectedBtn])

    useEffect(() => {
        setOpenShapes(false)
        setOpenLines(false)
        setOpenMoveNGrab(false)
        setOpenPencilBox(false)
    }, [isMousePressed])

    function hasActiveNestedButtons(obj) {
        return (Object.values(obj).filter(vl => { if (selectedBtn === vl) { return true } }).length > 0)
    }

    function selectClickHandler() {
        setOpenMoveNGrab(prv => !prv)
        setSelectedBtn(BUTTONS.SELECT.SELECT)
    }
    function shapesClickHandler() {
        setOpenShapes(prv => !prv)
        setSelectedBtn(BUTTONS.SHAPES.CIRCLE)
    }
    function drawClickHandler() {
        setOpenPencilBox(prv => !prv)
        setSelectedBtn(BUTTONS.DRAW.PENCIL)
    }
    function lineClickHandler() {
        setOpenLines(prv => !prv)
        setSelectedBtn(BUTTONS.LINE.SIMPLE)
    }
    function textClickHandler() {
        setSelectedBtn(BUTTONS.TEXT)
    }
    function notesClickHandler() {
        setSelectedBtn(BUTTONS.NOTES)
    }
    function uploadClickHandler() {
        setSelectedBtn(BUTTONS.UPLOAD)
    }
    function erasorClickHandler() {
        setSelectedBtn(BUTTONS.ERASOR)
    }
    function colorClickHandler() { }

    function colorChangeHandler(e) {
        let color = e.target.value;
        setSelectedStrokeColor(color);
    }
    function undoBtnClickHanlder() {
        // if (shapes.length) {
        //     setShapes(prv => {
        //         console.log('poping last item')
        //         prv.pop();
        //         return prv;
        //     })
        //     setUndoShapes(prv => [...prv, shapes[shapes.length - 1]])
        // }

    }
    function redoBtnClickHanlder() {

    }
    function moveButtonBoxMouseDown(e) {
        console.log(e)
        setIsGrabbed(true)
    }
    function moveButtonBoxMouseUp(e) {
        console.log(e)
        setIsGrabbed(false)
    }
    function moveButtonBoxHandler(e) {
        if (isGrabbed) {
            let cx = e.clientX;
            let cy = e.clientY;
            let btnBox = buttonBox.current;
            let btnBoxHeight = getComputedStyle(btnBox).height;
            let btnBoxWidth = getComputedStyle(btnBox).width;
            console.log(cx, cy, btnBoxHeight);
            btnBox.style.left = (cx - parseInt(btnBoxWidth) + 20) + 'px';
            btnBox.style.top = (cy - parseInt(btnBoxHeight) + 20) + 'px';
        }
    }

    function undoRedoMouseUp(){
        // updateShapesOnDb();
    }
    return (
        <div ref={buttonBox} className={styles.buttonBox}>
            <div>
                <ActionButton
                    buttonName={BUTTONS.SELECT}
                    onClick={selectClickHandler}
                    selectedBtn={selectedBtn}
                >
                    <BsCursor />
                </ActionButton>
                {openMoveNGrab && <MoveNGrabButtonBox setSelectedBtn={setSelectedBtn} selectedBtn={selectedBtn} />}
            </div>
            <div>
                <ActionButton
                    onClick={drawClickHandler}
                    buttonName={BUTTONS.DRAW}
                    selectedBtn={selectedBtn}
                >
                    <TbPencil />
                </ActionButton>
                {openPencilBox && <PencilBox
                    selectedStrokeSize={selectedStrokeSize}
                    setSelectedStrokeSize={setSelectedStrokeSize}
                    setSelectedBtn={setSelectedBtn} selectedBtn={selectedBtn} />}
            </div>

            <div>
                <ActionButton
                    onClick={shapesClickHandler}
                    buttonName={BUTTONS.SHAPES}
                    selectedBtn={selectedBtn}
                >
                    <IoShapesOutline />
                </ActionButton>
                {openShapes && <ShapeButtonBox setSelectedBtn={setSelectedBtn} selectedBtn={selectedBtn} />}
            </div>

            <div>
                <ActionButton
                    onClick={lineClickHandler}
                    buttonName={BUTTONS.LINE}
                    selectedBtn={selectedBtn}
                >
                    <HiOutlineMinus style={{ transform: 'rotate(-45deg)' }} />
                </ActionButton>
                {openLines && <LinesButtonBox setSelectedBtn={setSelectedBtn} selectedBtn={selectedBtn} />}
            </div>

            <div>
                <ActionButton
                    onClick={textClickHandler}
                    buttonName={BUTTONS.TEXT}
                    selectedBtn={selectedBtn}
                >
                    <RxText />
                </ActionButton>
            </div>

            <div>
                <ActionButton
                    onClick={notesClickHandler}
                    buttonName={BUTTONS.NOTES}
                    selectedBtn={selectedBtn}
                >
                    <CgNotes />
                </ActionButton>
            </div>

            <div>
                <ActionButton
                    onClick={uploadClickHandler}
                    buttonName={BUTTONS.UPLOAD}
                    selectedBtn={selectedBtn}
                >
                    <HiOutlineUpload />
                </ActionButton>
            </div>

            <div>
                <ActionButton
                    onClick={erasorClickHandler}
                    buttonName={BUTTONS.ERASOR}
                    selectedBtn={selectedBtn}
                >
                    <BsEraser />
                </ActionButton>
            </div>

            <div>
                <ActionButton
                    onClick={colorClickHandler}
                    buttonName={BUTTONS.COLORS}
                    selectedBtn={selectedBtn}
                >
                    <span className={styles.colorBox}>
                        <input onChange={colorChangeHandler} type="color" />
                    </span>
                </ActionButton>

            </div>

            <div>
                <ActionButton onMouseUp={undoRedoMouseUp} onClick={undoMove} buttonName={''} >
                    <GrUndo />
                </ActionButton>
            </div>

            <div>
                <ActionButton onMouseUp={undoRedoMouseUp} onClick={redoMove} buttonName={''}>
                    <GrRedo />
                </ActionButton>
            </div>

            <div>
                <ActionButton
                    onMouseMove={moveButtonBoxHandler}
                    onMouseDown={moveButtonBoxMouseDown}
                    onMouseUp={moveButtonBoxMouseUp}
                    onClick={moveButtonBoxHandler}
                    style={
                        isGrabbed ? { color: 'gray', cursor: 'grabbing' }
                            : { color: 'gray', cursor: 'grab' }
                    }
                    buttonName={''}>
                    <TbGripHorizontal />
                </ActionButton>
            </div>
        </div>
    );
}

export default ButtonBox;
