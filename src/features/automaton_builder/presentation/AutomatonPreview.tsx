import ReactFlow, {
    Background,
    ConnectionMode,
    Edge,
    MarkerType,
    Node,
    ReactFlowInstance,
    ReactFlowProvider
} from "reactflow";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import StateNode from "@/automaton_builder/presentation/StateNode";
import TransitionEdge from "@/automaton_builder/presentation/TransitionEdge";
import {useEffect, useMemo, useState} from "react";
import {digl} from "@crinkles/digl";
import {Rank} from "@crinkles/digl/dist/types";
import {useElementSize} from "@mantine/hooks";

const nodeTypes = {
    state: StateNode,
}

const edgeTypes = {
    transition: TransitionEdge,
}

// slight adaptation from documentation: https://github.com/kevtiq/digl
function positionNodes(
    nodes: Node[],
    ranks: Rank[],
    config: { orientation: "horizontal"|"vertical", width: number, height: number } = {orientation: 'horizontal', height: 46, width: 46},
) {
    const _nodes: Node[] = [];
    const _h = config.orientation === 'horizontal';

    ranks.forEach((r, i) => {
        const xStart = _h
            ? 2 * config.width * i
            : -0.5 * (r.length - 1) * 2 * config.width;
        const yStart = _h
            ? -0.5 * (r.length - 1) * 2 * config.height
            : 2 * config.height * i;

        r.forEach((nodeId, nIndex) => {
            const _node = nodes.find((n) => n.id == nodeId);
            if (!_node) return;
            const x = _h ? xStart : xStart + 2 * config.width * nIndex;
            const y = _h ? yStart + 2 * config.height * nIndex : yStart;
            _nodes.push({ ..._node, position: {x , y} });
        });
    });

    return _nodes;
}

const Flow = (props: {height: number, width: number}) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [reactFlow, setReactFlow] = useState<ReactFlowInstance|null>(null);
    const transitionRegex = new RegExp(/^\( *([^, ]+) *, *([^, ]+) *, *([^,) ]+) *\) *,? *$/);
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
        const edges = transitions
            .filter(t => states.some(c => c.id === t.source) && states.some(c => c.id === t.target))
            .map(e => ({source: e.source, target: e.target}))


        const sources = states.filter(s => edges.every(e => e.target !== s.id));
        const phantom = sources.map(s => ({source: "", target: s.id}));
        let diglEdges = edges.concat(phantom);

        let graphs = digl(diglEdges);
        graphs.forEach(rank => diglEdges.push({source: "", target: (rank[0] ?? [])[0] ?? ""}))
        graphs = digl(diglEdges);

        const laidOutNodes : Node[] = [];
        graphs.forEach(ranks => laidOutNodes.push(...positionNodes(states, ranks)));
        setNodes(laidOutNodes);
        const fV = setTimeout(() => {
            reactFlow?.fitView({duration: 200});
        }, 250);
        return () => clearTimeout(fV);

    }, [states, transitions]);

    useEffect(() => {
        const fV = setTimeout(() => {
            reactFlow?.fitView({duration: 200});
        }, 250);
        return () => clearTimeout(fV);
    }, [props.width, props.height]);

    return <ReactFlow zoomOnDoubleClick={false}
                      id={"automaton"}
                      onInit={(rf) => {
                          setReactFlow(rf);
                          rf.fitView()
                      }}
                      elementsSelectable={false}
                      nodesConnectable={false}
                      nodesDraggable={false}
                      nodeTypes={nodeTypes}
                      edgeTypes={edgeTypes}
                      nodes={nodes}
                      panOnDrag={false}
                      zoomOnScroll={false}
                      zoomActivationKeyCode={null}
                      zoomOnPinch={false}
                      connectionMode={ConnectionMode.Loose}
                      edges={transitions}>
        <Background/>
    </ReactFlow>
}

export default function AutomatonPreview() {
    const {ref, width, height} = useElementSize();

    return <div style={{flexGrow: 1}} ref={ref}>
        <ReactFlowProvider>
            <Flow height={height} width={width} />
        </ReactFlowProvider>
    </div>
}
