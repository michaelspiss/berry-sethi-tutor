import {Handle, NodeProps, Position} from "reactflow";
import {
    IconAsterisk,
    IconCircleDot,
    IconDots,
    IconHomeDot,
    IconMinusVertical, IconPlus,
    IconPoint, IconQuestionMark,
    IconRotateDot
} from "@tabler/icons";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";

export default function OperatorNode(props: NodeProps) {
    const {classes} = useNodeStyles();

    return (
        <>
            <Handle type={"target"} position={Position.Top} />
            <div className={classes.nodeContent}>
                {/*<IconAsterisk />*/}
                {/*<IconMinusVertical />*/}
                {/*<div style={{height: 10, width: 10, background: "black", borderRadius: "50%"}} />*/}
                {/*<IconPlus />*/}
                {/*<IconQuestionMark />*/}
            </div>
            <Handle type={"source"} position={Position.Bottom} />
        </>
    )
}
