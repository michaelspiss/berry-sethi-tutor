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
        bottom: "15px !important",
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
            {props.data.isFinal && <div className={classes.finalRing}/>}
            {props.data.label}
            <Handle type="source"
                    position={Position.Bottom}
                    id="a"
                    className={classes.handle}
                    style={{pointerEvents: "none"}}
            />
        </div>
    );
}
