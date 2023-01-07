import AutomatonEditor from "@/automaton_builder/presentation/AutomatonEditor";
import {createStyles} from "@mantine/core";
import InteractiveTreeBuilder from "@/tree_builder/presentation/InteractiveTreeBuilder";
import HintBar from "@/layout/presentation/HintBar";
import AutomatonPreview from "@/automaton_builder/presentation/AutomatonPreview";
import {useState} from "react";
import {ReactFlowProvider} from "reactflow";

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
        alignItems: "stretch"
    },
    graphWrapper: {
        display: "flex",
        flexGrow: 1,
        "&.stacked": {
            flexDirection: "column",
        }
    },

}))

export default function AutomatonBuilderScreen() {
    const {classes, cx} = useStyles();
    const [displayGraphsStacked, setDisplayGraphsStacked] = useState(true);

    return <div className={classes.wrapper}>
        <HintBar/>
        <div className={classes.horizontalWrapper}>
            <div className={cx(classes.graphWrapper, {["stacked"]: displayGraphsStacked})}>
                <InteractiveTreeBuilder />
                <ReactFlowProvider>
                    <AutomatonPreview />
                </ReactFlowProvider>
            </div>
            <AutomatonEditor />
        </div>
    </div>
}
