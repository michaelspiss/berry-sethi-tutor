import ReactFlow, {Background, Controls, Edge, Node, ReactFlowProvider} from "reactflow";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";

const Flow = () => {
    const states: Node[] = [...new Set(
        ["·r"].concat(
            useAutomaton(state => state.states)
                .split(",")
                .map(state => state.trim())
                .filter(state => state !== "")
        )
    )].map((stateName, i) => ({
        id: stateName,
        position: {x: 0, y: i * 70},
        data: {
            label: stateName,
        },
    }));
    const transitionRegex = new RegExp(/^\(([^,]*),([^,]*),([^)]*)\),?$/);
    const transitions: Edge[] = [...new Set(
        useAutomaton(state => state.transitions)
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
        }
    })

    console.log([...new Set(
        useAutomaton(state => state.transitions)
            .split(",")
            .map(transition => transition.trim())
    )])

    return <ReactFlow zoomOnDoubleClick={false}
                      id={"automaton"}
                      elementsSelectable={false}
                      nodesConnectable={false}
                      nodesDraggable={false}
                      nodes={states}
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
