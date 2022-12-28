import {Node, ReactFlowInstance} from "reactflow";
import useAppStateStore from "@/layout/stores/appStateStore";

export default function clickNode(clickedNode: Node, reactFlow: ReactFlowInstance, attribute: string) {
    const selected = reactFlow.getNodes().filter(node => node.selected).map(node => node.id);

    if (selected.length !== 0 && !useAppStateStore.getState().disableSelect) {
        useAppStateStore.setState({disableSelect: true});
        return;
    }

    if (clickedNode.type !== "terminal") {
        return;
    }

    reactFlow.setNodes(nodes =>
        nodes.map(node =>
            selected.includes(node.id)
            && !node.data[attribute]?.includes(clickedNode.data.terminalIndex) ? {
                ...node,
                data: {
                    ...node.data,
                    [attribute]: [...node.data[attribute], clickedNode.data.terminalIndex],
                }
            } : node)
    )
}
