import {Handle, NodeProps, Position} from "reactflow";
import {createStyles} from "@mantine/core";

const useStyles = createStyles(() => ({
    node: {
        border: "2px solid #000",
        borderRadius: "50%",
        width: 46,
        height: 46,
        lineHeight: "39px",
        textAlign: "center",
        fontSize: "22px",
        background: "#fff",
        position: "relative",
    },
    handle: {
        visibility: "hidden",
    },
    finalRing: {
        position: "absolute",
        top: 2,
        right: 2,
        bottom: 2,
        left: 2,
        border: "2px solid #000",
        borderRadius: "50%",
    }
}))

export default function StateNode(props: NodeProps) {
    const {classes} = useStyles();

    return (
        <div className={classes.node}>
            {
                props.data.label === "•r" && <svg style={{position: "absolute", left: -30}}>
                    <line x1={0} y1={21} x2={28} y2={21} strokeWidth={1} stroke={"#b1b1b7"} markerEnd={"url(#automaton__type=arrowclosed)"}></line>
                </svg>
            }
            {props.data.isFinal && <div className={classes.finalRing}/>}
            {props.data.label}
            <Handle type="target"
                    position={Position.Left}
                    id="t"
                    className={classes.handle}
                    style={{pointerEvents: "none"}}
            />
            <Handle type="source"
                    position={Position.Right}
                    id="s"
                    className={classes.handle}
                    style={{pointerEvents: "none"}}
            />
        </div>
    );
}
