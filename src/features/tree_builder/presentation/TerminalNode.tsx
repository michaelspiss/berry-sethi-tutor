import {Handle, NodeProps, NodeToolbar, Position} from "reactflow";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import {Stack} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import steps from "@/tree_builder/domain/steps";

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
                        const character = window.prompt("Please enter a character");
                        if (!character || character.length !== 1) {
                            alert("Please enter exactly one character.");
                            return;
                        }
                        props.data.setLabel(character);
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
                    style={solveStep === 1 ? undefined : {pointerEvents: "none", visibility: "hidden"}}
                    id={"step2l"}
            />
            <Handle type={"source"}
                    position={Position.Right}
                    style={solveStep === 1 ? undefined : {pointerEvents: "none", visibility: "hidden"}}
                    id={"step2r"}
            />
            <div className={classes.nodeContent}>
                {props.data.label}
            </div>
        </>
    )
}
