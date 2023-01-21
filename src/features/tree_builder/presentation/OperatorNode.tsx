import {Handle, NodeProps, NodeToolbar, Position} from "reactflow";
import {IconAsterisk, IconMinusVertical, IconPlus, IconQuestionMark} from "@tabler/icons";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import {Stack} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import steps from "@/tree_builder/domain/steps";
import NodeAttributes from "@/tree_builder/presentation/NodeAttributes";

export default function OperatorNode(props: NodeProps) {
    const {classes} = useNodeStyles();
    const solveStep = useAppStateStore((state) => state.solveStep);
    const canEditNodes = steps[solveStep]?.canEditNodes;

    const switchOperator = (operator: string) => {
        props.data.setLabel(operator);
    }

    let icon;
    switch (props.data.label) {
        case '*':
            icon = <IconAsterisk/>
            break;
        case '+':
            icon = <IconPlus/>
            break;
        case '?':
            icon = <IconQuestionMark/>
            break;
        case '|':
            icon = <IconMinusVertical/>
            break;
        case '·':
            icon = <div style={{height: 6, width: 6, background: "black", borderRadius: "50%"}}/>
            break;
        default:
            icon = props.data.label
    }

    return (
        <>
            <NodeToolbar nodeId={props.id} isVisible={canEditNodes && props.selected} position={Position.Left}>
                <Stack className={"nodrag"}>
                    <button onClick={() => switchOperator("*")}>Make *</button>
                    <button onClick={() => switchOperator("?")}>Make ?</button>
                    <button onClick={() => switchOperator("·")}>Make ·</button>
                </Stack>
            </NodeToolbar>
            <NodeToolbar nodeId={props.id} isVisible={canEditNodes && props.selected} position={Position.Right}>
                <Stack className={"nodrag"}>
                    <button onClick={() => switchOperator("+")}>Make +</button>
                    <button onClick={() => switchOperator("|")}>Make |</button>
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
                    style={solveStep === 1 ? undefined : solveStep === 0 ? {pointerEvents: "none", visibility: "hidden"} : {pointerEvents: "none"}}
                    id={"step2l"}
            />
            <NodeAttributes data={props.data} />
            <div className={classes.nodeContent}>
                {icon}
            </div>
            <Handle type={"source"}
                    position={Position.Bottom}
                    style={solveStep === 0 ? undefined : {pointerEvents: "none", visibility: "hidden"}}
                    id={"step1b"}
            />
            <Handle type={"source"}
                    position={Position.Right}
                    style={solveStep === 1 ? undefined : solveStep === 0 ? {pointerEvents: "none", visibility: "hidden"} : {pointerEvents: "none"}}
                    id={"step2r"}
            />
        </>
    )
}
