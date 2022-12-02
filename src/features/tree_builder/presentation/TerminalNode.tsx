import {Handle, NodeProps, NodeToolbar, Position} from "reactflow";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import {Stack} from "@mantine/core";

export default function TerminalNode(props: NodeProps) {
    const {classes} = useNodeStyles();

    return (
        <>
            <NodeToolbar nodeId={props.id} isVisible={props.selected} position={Position.Left}>
                <Stack className={"nodrag"}>
                    <button onClick={() => {
                        // TODO: make prettier
                        const character = window.prompt("Please enter a character");
                        if(!character || character.length !== 1) {
                            alert("Please enter exactly one character.");
                            return;
                        }
                        props.data.setLabel(character);
                    }}>Set terminal</button>
                </Stack>
            </NodeToolbar>
            <NodeToolbar nodeId={props.id} isVisible={props.selected} position={Position.Right}>
                <Stack className={"nodrag"}>
                    <button onClick={() => props.data.deleteNode()}>Delete node</button>
                </Stack>
            </NodeToolbar>
            <Handle type={"target"} position={Position.Top} />
            <div className={classes.nodeContent}>
                {props.data.label}
            </div>
        </>
    )
}
