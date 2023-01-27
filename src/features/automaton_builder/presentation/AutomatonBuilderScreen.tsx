import TransitionsEditor from "@/automaton_builder/presentation/TransitionsEditor";
import {createStyles, ScrollArea, TextInput} from "@mantine/core";
import InteractiveTreeBuilder from "@/tree_builder/presentation/InteractiveTreeBuilder";
import HintBar from "@/layout/presentation/HintBar";
import AutomatonPreview from "@/automaton_builder/presentation/AutomatonPreview";
import {ChangeEventHandler, useEffect, useMemo, useRef} from "react";
import useAppStateStore from "@/layout/stores/appStateStore";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import {useFocusTrap} from "@mantine/hooks";
import VerificationErrors from "@/tree_builder/presentation/VerificationErrors";

const useStyles = createStyles(() => ({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "stretch",
        justifyItems: "stretch"
    },
    horizontalWrapper: {
        display: "flex",
        flexGrow: 1,
        alignContent: "stretch",
        alignItems: "stretch",
    },
    graphWrapper: {
        display: "flex",
        flexGrow: 1,
        position: "relative",
        flexDirection: "column",
    },
    automatonDefinition: {
        flexGrow: 1,
        maxWidth: 300,
        boxSizing: "border-box",
    },
    errors: {
        position: "absolute",
        top: 0,
        right: 0,
        maxHeight: "100%",
        zIndex: 10000,
    }
}))

const onFinalStatesChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const selection = event.currentTarget.selectionStart;
    const value = event.currentTarget.value.replaceAll(".", "•");
    useAutomaton.setState({finalStates: value});
    event.currentTarget.value = value;
    event.currentTarget.setSelectionRange(selection, selection);
}
const onStatesChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const selection = event.currentTarget.selectionStart;
    const value = event.currentTarget.value.replaceAll(".", "•");
    useAutomaton.setState({states: value});
    event.currentTarget.value = value;
    event.currentTarget.setSelectionRange(selection, selection);
}

export default function AutomatonBuilderScreen() {
    const {classes, theme} = useStyles();
    const states = useAutomaton(state => state.states);
    const finalStates = useAutomaton(state => state.finalStates);
    const regex = useAppStateStore(state => state.regex);
    const focusTrap = useFocusTrap();

    const statesRef = useRef<HTMLInputElement>(null);
    const finalStatesRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(states === "") {
            statesRef.current && (statesRef.current.value = "")
        }
        if(finalStates === "") {
            finalStatesRef.current && (finalStatesRef.current.value = "")
        }
    }, [states, finalStates])

    const alphabet = useMemo(() => {
        return [...new Set(useAppStateStore.getState().regexModel?.getTerminals())].filter(t => t !== "ε").map(t => {
            return t.startsWith("\\") ? t.substring(1) : t;
        }).sort().join(",")
    }, [regex]);

    return <div className={classes.wrapper} ref={focusTrap}>
        <HintBar/>
        <div className={classes.horizontalWrapper}>
            <ScrollArea className={classes.automatonDefinition}
                        mah={"calc(100vh - var(--mantine-header-height) - var(--hint-bar-height, 0))"}>
                <pre style={{padding: theme.spacing.xs}}>
                    r=<RegexHighlighter regex={useAppStateStore.getState().regex} inline/><br/>
                    A<sub>r</sub>=(Q,Σ,δ,I,F)<br/>
                    Q={"{"}<TextInput data-autofocus defaultValue={states} onChange={onStatesChange}
                                      ref={statesRef}
                                      styles={{withIcon: {paddingLeft: 26}}}
                                      icon={<span style={{color: "black", fontSize: 14,}}>•r,</span>}/>{"}"}<br/>
                    Σ={"{" + alphabet + "}"}<br/>
                    δ={"{"}<TransitionsEditor/>{"}"}<br/>
                    I={"{•r}"}<br/>
                    F={"{"}<TextInput defaultValue={finalStates} onChange={onFinalStatesChange}/>{"}"}
                </pre>
            </ScrollArea>
            <div className={classes.graphWrapper}>
                <div className={classes.errors}>
                    <VerificationErrors/>
                </div>
                <InteractiveTreeBuilder/>
                <AutomatonPreview/>
            </div>
        </div>
    </div>
}
