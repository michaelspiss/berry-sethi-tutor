import {createStyles, Textarea} from "@mantine/core";
import {useElementSize} from "@mantine/hooks";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import {ChangeEventHandler, useRef} from "react";

const useStyles = createStyles(theme => ({
    wrapper : {
        position: "relative",
    },
    styled: {
        position: "absolute",
        overflowWrap: "break-word",
        overflow: "hidden",
        whiteSpace: "pre-wrap",
        boxSizing: "content-box",
        top: 0,
        left: 0,
        zIndex: 1,
        padding: `${theme.spacing.xs / 2}px ${theme.spacing.sm}px`,
        fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
        fontSize: 14,
        border: `1px solid transparent`,
    },
    inputRoot: {
        position: "relative",
        zIndex: 2,
        height: "100%",
        width: "100%",
    },
    inputWrapper: {
        height: "100%",
    },
    input: {
        height: "100%",
        color: "transparent",
        background: "transparent",
        padding: `${theme.spacing.xs / 2}px ${theme.spacing.sm}px`,
        fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
        fontSize: 14,
        caretColor: "black",
    }
}))

const onTransitionsChange : ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const value = event.currentTarget.value
        .replaceAll(".", "•")
        .replaceAll(/\) *, *\n? *\(/g, "),\n(");

    useAutomaton.setState({transitions: value})
}

export default function TransitionsEditor() {
    const {classes} = useStyles();
    const value = useAutomaton(state => state.transitions);
    const {ref: sizeRef, width, height} = useElementSize();
    const styledContentRef = useRef<HTMLDivElement>(null);

    return <div className={classes.wrapper}>
        {/* TODO: split lines, parse lines, build automaton */}
        {/* TODO: Add header: "Enter a normal dot for entry/exit handle position"? Add toggle layout button here? */}
        <Textarea
            classNames={{root: classes.inputRoot, input: classes.input, wrapper: classes.inputWrapper}}
            value={value}
            placeholder={"(•r,a,...),"}
            onChange={onTransitionsChange}
            autosize
            ref={sizeRef}
            onScroll={event => {
                styledContentRef.current!.scrollTop = event.currentTarget.scrollTop
            }}
        />
        <div className={classes.styled} style={{width, height}} ref={styledContentRef}>
            {value /* TODO: format */}
        </div>
    </div>
}
