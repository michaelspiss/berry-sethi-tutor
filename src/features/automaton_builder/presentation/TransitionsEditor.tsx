import {createStyles, Textarea} from "@mantine/core";
import {useElementSize} from "@mantine/hooks";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import {ChangeEventHandler, ReactElement, useMemo, useRef} from "react";
import {transitionRegex} from "@/automaton_builder/presentation/AutomatonPreview";

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
    },
    transitionError: {
        background: theme.fn.rgba(theme.colors.red[3], .4),
    },
    transitionCommaOrParenthesis: {
        color: theme.colors.gray[6],
    },
    transitionState: {
        color: "black",
    },
    transitionTerminal: {
        color: theme.colors.blue[7],
    }
}))

const onTransitionsChange : ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    let selection = event.currentTarget.selectionStart;

    const value = event.currentTarget.value.replaceAll(".", "•");

    const newValue = value.replaceAll(/\) *, *\n? *\(/g, "),\n(");
    if(value !== newValue) {
        selection++;
    }

    event.currentTarget.value = newValue;

    useAutomaton.setState({transitions: newValue});
    event.currentTarget.setSelectionRange(selection, selection);
}

export default function TransitionsEditor() {
    const {classes} = useStyles();
    const value = useAutomaton(state => state.transitions);
    const {ref: sizeRef, width, height} = useElementSize();
    const styledContentRef = useRef<HTMLDivElement>(null);

    const styledTransitions = useMemo(() => {
        sizeRef.current && (sizeRef.current.value = value)

        const styled : ReactElement[] = [];
        const matches = [...value.matchAll(transitionRegex), {index: value.length, 0: undefined}]
        let i = 0;
        for(let match of matches) {
            if(match.index !== i) {
                const substring = value.substring(i, match.index);
                styled.push(<span key={"te" + i} className={classes.transitionError}>{substring}</span>);
            }
            if(match[0] === undefined) {
                continue;
            }
            i = match.index!;
            const splitMatch = match[0].split(",")
            const sourcePart = splitMatch[0].split(match[1]);
            const terminalPart = match[2] === "," ? [splitMatch[1], splitMatch[2]] : splitMatch[1].split(match[2]);
            const targetPart = match[2] === "," ? splitMatch[3].split(match[3]) : splitMatch[2].split(match[3]);
            styled.push(<span key={"te" + i} className={classes.transitionCommaOrParenthesis}>
                {sourcePart[0]}
                <span className={classes.transitionState}>{match[1]}</span>
                {sourcePart[1] + "," + terminalPart[0]}
                <span className={classes.transitionTerminal}>{match[2]}</span>
                {terminalPart[1] + "," + targetPart[0]}
                <span className={classes.transitionState}>{match[3]}</span>
                {targetPart[1]}
                {(match[2] === "," && splitMatch[4] !== undefined && "," + splitMatch[4]) || (match[2] !== "," && splitMatch[3] !== undefined && "," + splitMatch[3])}
            </span>);
            i += match[0].length
        }

        return styled;
    }, [value]);

    return <div className={classes.wrapper}>
        <Textarea
            classNames={{root: classes.inputRoot, input: classes.input, wrapper: classes.inputWrapper}}
            defaultValue={value}
            placeholder={"(•r,a,...),"}
            onChange={onTransitionsChange}
            autosize
            ref={sizeRef}
            onScroll={event => {
                styledContentRef.current!.scrollTop = event.currentTarget.scrollTop
            }}
        />
        <div className={classes.styled} style={{width, height}} ref={styledContentRef}>
            {styledTransitions}
        </div>
    </div>
}
