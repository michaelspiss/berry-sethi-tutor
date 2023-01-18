import ReactFlow, {Background, Controls, Edge, MarkerType, Node, ReactFlowInstance, ReactFlowProvider} from "reactflow";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import StateNode from "@/automaton_builder/presentation/StateNode";
import TransitionEdge from "@/automaton_builder/presentation/TransitionEdge";
import {useEffect, useMemo, useState} from "react";
import {useElementSize} from "@mantine/hooks";
import ElkConstructor from "elkjs";

const nodeTypes = {
    state: StateNode,
}

const edgeTypes = {
    transition: TransitionEdge,
}

export const transitionRegex = new RegExp(/\( *([^,( ]+) *, *([^, ]+) *, *([^,) ]+) *\) *,?/g);

const Flow = (props: { height: number, width: number }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [reactFlow, setReactFlow] = useState<ReactFlowInstance | null>(null);
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

    const transitions: Edge[] = useMemo(() => {
        const map: { [key: string]: Edge } = {};
        for(const match of automaton.transitions.matchAll(transitionRegex)) {
            const id = `${match[1]}-${match[2]}-${match[3]}`;
            map[id] = {
                id: id,
                source: match[1],
                target: match[3],
                label: match[2],
                markerEnd: {
                    type: MarkerType.ArrowClosed
                },
                type: "transition"
            }
        }
        return Object.values(map);
    }, [automaton.transitions])

    useEffect(() => {
        const effect = async () => {
            const elk = new ElkConstructor();
            const nodes = states.map(s => ({id: s.id, width: s.width ?? 46, height: s.height ?? 46}));
            const edges = transitions
                .filter(t => states.some(c => c.id === t.source) && states.some(c => c.id === t.target))
                .map(e => ({
                    id: e.id,
                    sources: [e.source],
                    targets: [e.target],
                    labels: [{text: e.label as string | undefined}]
                }))

            const graph = {
                id: "root",
                layoutOptions: {'elk.algorithm': 'layered'},
                children: nodes,
                edges: edges,
            }

            const laidOutNodes: Node[] = [];
            const laidOutEdges: Edge[] = [];

            const laidOut = await elk.layout(graph)
            states.forEach(node => {
                const laidOutNode = laidOut.children?.find(c => c.id === node.id);
                laidOutNodes.push({
                    ...node,
                    position: {x: laidOutNode?.x ?? 0, y: laidOutNode?.y ?? 0},
                })
            });
            edges.forEach(edge => {
                const laidOutEdge = laidOut.edges?.find(e => e.id === edge.id);
                const points = laidOutEdge ? {
                    points: [
                        laidOutEdge?.sections?.[0]?.startPoint,
                        ...(laidOutEdge?.sections?.[0]?.bendPoints ?? []),
                        laidOutEdge?.sections?.[0]?.endPoint,
                    ]
                } : {};
                laidOutEdges.push({
                    id: edge.id,
                    source: edge.sources[0]!,
                    target: edge.targets[0]!,
                    label: edge.labels[0]?.text,
                    data: {
                        ...points,
                        labelPosition: {x: laidOutEdge?.labels?.[0]?.x ?? 0, y: laidOutEdge?.labels?.[0]?.y ?? 0},
                    },
                    type: "transition",
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                    }
                })
            })

            setNodes(laidOutNodes);
            setEdges(laidOutEdges);
        }

        effect().then(_ => {
        });
        const fV = setTimeout(() => {
            reactFlow?.fitView({duration: 200, padding: 0.1});
        }, 300);
        return () => clearTimeout(fV);
    }, [states, transitions]);

    useEffect(() => {
        const fV = setTimeout(() => {
            reactFlow?.fitView({duration: 200, padding: 0.1});
        }, 250);
        return () => clearTimeout(fV);
    }, [props.width, props.height]);

    return <ReactFlow zoomOnDoubleClick={false}
                      id={"automaton"}
                      onInit={(rf) => {
                          setReactFlow(rf);
                          rf.fitView()
                      }}
                      nodesConnectable={false}
                      fitViewOptions={{duration: 200, padding: 0.1}}
                      nodesDraggable={false}
                      nodeTypes={nodeTypes}
                      edgeTypes={edgeTypes}
                      nodes={nodes}
                      edges={edges}>
        <Background/>
        <Controls showInteractive={false}/>
    </ReactFlow>
}

export default function AutomatonPreview() {
    const {ref, width, height} = useElementSize();

    return <div style={{flexGrow: 1}} ref={ref}>
        <ReactFlowProvider>
            <Flow height={height} width={width}/>
        </ReactFlowProvider>
    </div>
}
