import ReactFlow, {Background, ConnectionMode, Controls, Edge, MarkerType, Node, ReactFlowProvider} from "reactflow";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import StateNode from "@/automaton_builder/presentation/StateNode";
import TransitionEdge from "@/automaton_builder/presentation/TransitionEdge";
import {useMemo, useState} from "react";
import ElkConstructor from "elkjs";

const nodeTypes = {
    state: StateNode,
}

const edgeTypes = {
    transition: TransitionEdge,
}

const elk = new ElkConstructor();

const Flow = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const transitionRegex = new RegExp(/^\(([^,]*),([^,]*),([^)]*)\),?$/);
    const automaton = useAutomaton();

    const finalStates = useMemo(() => automaton.finalStates
        .split(",")
        .map(state => state.trim())
        .filter(state => state !== ""), [automaton.finalStates]);

    const states: Node[] = useMemo(() => [...new Set(
        ["•r"].concat(
            automaton.states
                .split(",")
                .map(state => state.trim())
                .filter(state => state !== "")
        )
    )].map((stateName) => ({
        id: stateName,
        position: {x: 0, y: 0},
        data: {
            label: stateName,
            isFinal: finalStates.includes(stateName),
        },
        type: "state",
    })), [automaton.states]);

    const transitions: Edge[] = useMemo(() => [...new Set(
        automaton.transitions
            .split(",\n")
            .map(transition => transition.trim())
            .filter(transition => transitionRegex.test(transition))
    )].map(transition => {
        const result = transitionRegex.exec(transition)!;
        return {
            id: `${result[1]}-${result[2]}-${result[3]}`,
            source: result[1],
            target: result[3],
            label: result[2],
            markerEnd: {
                type: MarkerType.ArrowClosed
            },
            type: "transition",
        }
    }), [automaton.transitions])

    return <ReactFlow zoomOnDoubleClick={false}
                      id={"automaton"}
                      elementsSelectable={false}
                      nodesConnectable={false}
                      nodesDraggable={false}
                      nodeTypes={nodeTypes}
                      edgeTypes={edgeTypes}
                      nodes={states}
                      connectionMode={ConnectionMode.Loose}
                      edges={transitions}>
        <Background/>
        <Controls showInteractive={false}/>
    </ReactFlow>
}

export default function AutomatonPreview() {
    return <div style={{flexGrow: 1}}>
        <ReactFlowProvider>
            <Flow/>
        </ReactFlowProvider>
    </div>
}
