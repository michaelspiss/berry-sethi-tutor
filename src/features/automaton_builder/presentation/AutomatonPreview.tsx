import ReactFlow, {Background, ConnectionMode, Controls, Edge, MarkerType, Node, ReactFlowProvider} from "reactflow";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import StateNode from "@/automaton_builder/presentation/StateNode";
import TransitionEdge from "@/automaton_builder/presentation/TransitionEdge";
import {useEffect, useMemo, useState} from "react";
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
    })), [automaton.states, finalStates]);

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

    useEffect(() => {
        const children = states.map(state => ({id: state.id, height: state.height ?? 50, width: state.width ?? 50}));
        const graph = {
            id: "root",
            layoutOptions: {'elk.algorithm': 'layered'},
            children: children,
            edges: transitions
                .filter(t => children.some(c => c.id === t.source) && children.some(c => c.id === t.target))
                .map(t => ({id: t.id, sources: [t.source], targets: [t.target]}))
        }
        elk.layout(graph).then(graph => {
            const laidOutNodes: Node[] = [];
            states.forEach(node => {
                const laidOut = graph.children?.find(child => child.id === node.id);
                laidOutNodes.push({...node, position: {x: laidOut?.x ?? 0, y: laidOut?.y ?? 0}});
            });
            setNodes(laidOutNodes);
        });
    }, [states, transitions])

    return <ReactFlow zoomOnDoubleClick={false}
                      id={"automaton"}
                      elementsSelectable={false}
                      nodesConnectable={false}
                      nodesDraggable={false}
                      nodeTypes={nodeTypes}
                      edgeTypes={edgeTypes}
                      nodes={nodes}
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
