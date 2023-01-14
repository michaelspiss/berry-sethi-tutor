import {BaseEdge, EdgeLabelRenderer, EdgeProps} from "reactflow";

export default function TransitionEdge(props: EdgeProps) {
    const {sourceX, sourceY, targetX, targetY} = props;

    const points : [{x: number, y: number}] = props.data?.points ?? [{x: sourceX, y: sourceY}, {x: targetX, y: targetY}];
    const path = "M " + points.map(p => p.x + " " + p.y).join(" L ");

    return <>
        <BaseEdge path={path} {...props} />
        <EdgeLabelRenderer>
            <div style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${props.data?.labelPosition?.x ?? 0}px,${props.data?.labelPosition?.y ?? 0}px)`,
                background: 'rgba(255,255,255,1)',
                color: "#000",
                border: "1px solid #aaa",
                padding: 3,
                borderRadius: 5,
                fontSize: 10,
                lineHeight: .8,
            }}>
                {props.label}
            </div>
        </EdgeLabelRenderer>
    </>
}
