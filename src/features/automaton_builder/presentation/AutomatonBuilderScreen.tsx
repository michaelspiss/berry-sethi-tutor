import TransitionsEditor from "@/automaton_builder/presentation/TransitionsEditor";
import {createStyles, ScrollArea, TextInput} from "@mantine/core";
import InteractiveTreeBuilder from "@/tree_builder/presentation/InteractiveTreeBuilder";
import HintBar from "@/layout/presentation/HintBar";
import AutomatonPreview from "@/automaton_builder/presentation/AutomatonPreview";
import {ChangeEventHandler, useState} from "react";
import useAppStateStore from "@/layout/stores/appStateStore";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import {useFocusTrap} from "@mantine/hooks";

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
        "&.stacked": {
            flexDirection: "column",
        }
    },
    automatonDefinition : {
        flexGrow: 1,
        maxWidth: 300,
        boxSizing: "border-box",
    },
}))

const onFinalStatesChange : ChangeEventHandler<HTMLInputElement> = (event) => {
    useAutomaton.setState({finalStates: event.currentTarget.value.replaceAll(".", "•")});
}
const onStatesChange : ChangeEventHandler<HTMLInputElement> = (event) => {
    useAutomaton.setState({states: event.currentTarget.value.replaceAll(".", "•")});
}

export default function AutomatonBuilderScreen() {
    const {classes, cx, theme} = useStyles();
    const [displayGraphsStacked, setDisplayGraphsStacked] = useState(true);
    const states = useAutomaton(state => state.states);
    const finalStates = useAutomaton(state => state.finalStates);
    const focusTrap = useFocusTrap();

    return <div className={classes.wrapper} ref={focusTrap}>
        <HintBar/>
        <div className={classes.horizontalWrapper}>
            <ScrollArea className={classes.automatonDefinition} mah={"calc(100vh - var(--mantine-header-height) - var(--hint-bar-height, 0))"}>
                <pre style={{padding: theme.spacing.xs}}>
                    r=<RegexHighlighter regex={useAppStateStore.getState().regex} inline/><br/>
                    A<sub>r</sub>=(Q,Σ,δ,I,F)<br/>
                    Q={"{"}<TextInput data-autofocus value={states} onChange={onStatesChange} styles={{withIcon: {paddingLeft: 26}}} icon={<span style={{color: "black", fontSize: 14, }}>•r,</span>}/>{"}"}<br/>
                    Σ={"{" + [...new Set(useAppStateStore.getState().regexModel?.getTerminals())].filter(t => t !== "ε").sort().join(",")  + "}"}<br/>
                    δ={"{"}<TransitionsEditor/>{"}"}<br/>
                    I={"{•r}"}<br/>
                    F={"{"}<TextInput value={finalStates} onChange={onFinalStatesChange}/>{"}"}
                </pre>
            </ScrollArea>
            <div className={cx(classes.graphWrapper, {["stacked"]: displayGraphsStacked})}>
                <InteractiveTreeBuilder/>
                <AutomatonPreview/>
            </div>
        </div>
    </div>
}
