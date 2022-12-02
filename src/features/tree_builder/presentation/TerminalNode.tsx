import {Handle, NodeProps, Position} from "reactflow";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";

export default function TerminalNode(props: NodeProps) {
    const {classes} = useNodeStyles();

    return (
        <>
            <Handle type={"target"} position={Position.Top} />
            <div className={classes.nodeContent}>
                {props.id}
            </div>
        </>
    )
}
