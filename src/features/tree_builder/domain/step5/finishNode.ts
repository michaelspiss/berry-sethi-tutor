import {Node, ReactFlowInstance} from "reactflow";
import useAppStateStore from "@/layout/stores/appStateStore";

export default function finishNode(selectedNodes: Node[], reactFlow: ReactFlowInstance) {
    const selectedNodesIds = selectedNodes.map(node => node.id);
    reactFlow.setNodes(nodes => nodes.map(node => selectedNodesIds.includes(node.id) ? {
        ...node,
        selected: false,
    } : node));
    useAppStateStore.setState({disableSelect: false});
}
