import StepHelp from "@/tree_builder/presentation/StepHelp";
import {Background, ConnectionMode, ReactFlow, ReactFlowProvider} from "reactflow";
import ArrowMarker from "@/tree_builder/presentation/ArrowMarker";
import 'reactflow/dist/style.css';
import OperatorNode from "@/tree_builder/presentation/OperatorNode";
import PathEdge from "@/tree_builder/presentation/PathEdge";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import TerminalNode from "@/tree_builder/presentation/TerminalNode";

const nodeTypes = {
    operator: OperatorNode,
    terminal: TerminalNode,
}

const edgeTypes = {
    path: PathEdge
}

const nodes = [
    {id: "star", type: "operator", data: {label: "*"}, position: {x: 0, y: 0}, hidden: false},
    {id: "star-r", type: "operator", data: {label: "r"}, position: {x: 0, y: 80}},
    {id: "plus", type: "operator", data: {label: "+"}, position: {x: 140, y: 0}},
    {id: "plus-r", type: "operator", data: {label: "r"}, position: {x: 140, y: 80}},
    {id: "question", type: "operator", data: {label: "?"}, position: {x: 280, y: 0}},
    {id: "question-r", type: "operator", data: {label: "r"}, position: {x: 280, y: 80}},
    {id: "alt", type: "operator", data: {label: "|"}, position: {x: 40, y: 160}},
    {id: "alt-r1", type: "operator", data: {label: "r₁"}, position: {x: 0, y: 220}},
    {id: "alt-r2", type: "operator", data: {label: "r₂"}, position: {x: 80, y: 220}},
    {id: "con", type: "operator", data: {label: "·"}, position: {x: 240, y: 160}},
    {id: "con-r1", type: "operator", data: {label: "r₁"}, position: {x: 200, y: 220}},
    {id: "con-r2", type: "operator", data: {label: "r₂"}, position: {x: 280, y: 220}},
    {id: "t", type: "terminal", data: {label: "a"}, position: {x: 140, y: 300}},
]

const edges = [
    {id: "star-r", source: "star", target: "star-r", sourceHandle: "step1b", targetHandle: "step1t"},
    {id: "star-r-l-r", source: "star", target: "star", sourceHandle: "step2l", targetHandle: "step2r", type: "path", markerEnd: "arrowMarker"},
    {id: "star-r-l:star-r-r", source: "star", target: "star-r", sourceHandle: "step2l", targetHandle: "step2l", type: "path", markerEnd: "arrowMarker"},
    {id: "star-r-r-l", source: "star-r", target: "star-r", sourceHandle: "step2r", targetHandle: "step2l", type: "path", markerEnd: "arrowMarker"},
    {id: "star-r-r:star-r", source: "star-r", target: "star", sourceHandle: "step2r", targetHandle: "step2r", type: "path", markerEnd: "arrowMarker"},
    {id: "plus-r", source: "plus", target: "plus-r", sourceHandle: "step2l", targetHandle: "step2l", type: "path", markerEnd: "arrowMarker"},
    {id: "plus-r-rl", source: "plus-r", target: "plus-r", sourceHandle: "step2r", targetHandle: "step2l", type: "path", markerEnd: "arrowMarker"},
    {id: "plus-r:plus", source: "plus-r", target: "plus", sourceHandle: "step2r", targetHandle: "step2r", type: "path", markerEnd: "arrowMarker"},
    {id: "q:l>q-r:l", source: "question", target: "question-r", sourceHandle: "step2l", targetHandle: "step2l", type: "path", markerEnd: "arrowMarker"},
    {id: "q:l>q:r", source: "question", target: "question", sourceHandle: "step2l", targetHandle: "step2r", type: "path", markerEnd: "arrowMarker"},
    {id: "q-r:r>q:r", source: "question-r", target: "question", sourceHandle: "step2r", targetHandle: "step2r", type: "path", markerEnd: "arrowMarker"},
    {id: "alt:l>alt-r1:l", source: "alt", target: "alt-r1", sourceHandle: "step2l", targetHandle: "step2l", type: "path", markerEnd: "arrowMarker"},
    {id: "alt-r1:r>alt:r", source: "alt-r1", target: "alt", sourceHandle: "step2r", targetHandle: "step2r", type: "path", markerEnd: "arrowMarker"},
    {id: "alt:l>alt-r2:l", source: "alt", target: "alt-r2", sourceHandle: "step2l", targetHandle: "step2l", type: "path", markerEnd: "arrowMarker"},
    {id: "alt-r2:r>alt:r", source: "alt-r2", target: "alt", sourceHandle: "step2r", targetHandle: "step2r", type: "path", markerEnd: "arrowMarker"},
    {id: "con:l>con-r1:l", source: "con", target: "con-r1", sourceHandle: "step2l", targetHandle: "step2l", type: "path", markerEnd: "arrowMarker"},
    {id: "con-r1:r>con-r2:l", source: "con-r1", target: "con-r2", sourceHandle: "step2r", targetHandle: "step2l", type: "path", markerEnd: "arrowMarker"},
    {id: "con-r2:r>con:r", source: "con-r2", target: "con", sourceHandle: "step2r", targetHandle: "step2r", type: "path", markerEnd: "arrowMarker"},
    {id: "t:l>t:r", source: "t", target: "t", sourceHandle: "step2l", targetHandle: "step2r", type: "path", markerEnd: "arrowMarker"},
]

export default function PossiblePathsHelper() {
    const {classes, cx} = useNodeStyles();

    return <>
        Connect entry and exit handles (left, right) to show all possible tree traversal options
        <StepHelp>
            Each node has an entry and exit handle, which describe the possible flows from and to it.
            Each operator has a distinct flow:
            <div style={{width: "100%", height: 400, cursor: "pointer !important"}}>
                <ReactFlowProvider>
                    <ReactFlow
                        id={"paths-help"}
                        nodes={nodes.map(node=>({...node, className: cx(classes.node, node.type === "operator" && classes.operatorNode)}))}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        connectionMode={ConnectionMode.Loose}
                        fitView
                        nodesConnectable={false}
                        elementsSelectable={false}
                        panOnDrag={false}
                        panActivationKeyCode={null}
                        panOnScroll={false}
                        zoomOnPinch={false}
                        zoomActivationKeyCode={null}
                        zoomOnDoubleClick={false}
                        proOptions={{hideAttribution: true}}
                        zoomOnScroll={false}>
                        <ArrowMarker/>
                        <Background/>
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </StepHelp>
    </>
}
