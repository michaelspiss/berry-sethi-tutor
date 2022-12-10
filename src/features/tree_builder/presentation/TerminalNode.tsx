import {Handle, NodeProps, NodeToolbar, Position} from "reactflow";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import {Stack} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import steps from "@/tree_builder/domain/steps";

export function terminalLengthIsValid(terminal: string) {
    if(terminal.length === 1) return true;
    if(terminal.length !== 2) return false;
    return terminal[0] === "\\";

}

export default function TerminalNode(props: NodeProps) {
    const {classes} = useNodeStyles();
    const solveStep = useAppStateStore((state) => state.solveStep);
    const canEditNodes = steps[solveStep].canEditNodes

    return (
        <>
            <NodeToolbar nodeId={props.id} isVisible={canEditNodes && props.selected} position={Position.Left}>
                <Stack className={"nodrag"}>
                    <button onClick={() => {
                        // TODO: make prettier
                        const terminal = window.prompt("Please enter a single or escaped (e.g. \\*) character");
                        if (!terminal || !terminalLengthIsValid(terminal)) {
                            alert("Please enter exactly one, or an escaped character.");
                            return;
                        }
                        props.data.setLabel(terminal);
                    }}>Set terminal
                    </button>
                </Stack>
            </NodeToolbar>
            <NodeToolbar nodeId={props.id} isVisible={canEditNodes && props.selected} position={Position.Right}>
                <Stack className={"nodrag"}>
                    <button onClick={() => props.data.deleteNode()}>Delete node</button>
                </Stack>
            </NodeToolbar>
            <Handle type={"target"}
                    position={Position.Top}
                    style={solveStep === 0 ? undefined : {pointerEvents: "none", visibility: "hidden"}}
                    id={"step1t"}
            />
            <Handle type={"source"}
                    position={Position.Left}
                    style={solveStep !== 0 ? undefined : {pointerEvents: "none", visibility: "hidden"}}
                    id={"step2l"}
            />
            <Handle type={"source"}
                    position={Position.Right}
                    style={solveStep !== 0 ? undefined : {pointerEvents: "none", visibility: "hidden"}}
                    id={"step2r"}
            />
            <div className={classes.nodeContent}>
                {props.data.terminalIndex !== undefined ? props.data.terminalIndex : props.data.label}
                {props.data.terminalIndex === undefined ? null : <div className={classes.terminalSubscript}>{props.data.label}</div>}
            </div>
        </>
    )
}
