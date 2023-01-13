import {BaseEdge, EdgeProps} from "reactflow";

export default function TransitionEdge(props: EdgeProps) {
    const {sourceX, sourceY, targetX, targetY} = props;

    return <>
        <BaseEdge path={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`} {...props} />
    </>
}
