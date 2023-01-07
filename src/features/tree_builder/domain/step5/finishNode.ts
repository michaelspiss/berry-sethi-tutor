import {Node} from "reactflow";
import useAppStateStore from "@/layout/stores/appStateStore";
import useTree from "@/tree_builder/domain/useTree";

export default function finishNode(selectedNodes: Node[]) {
    const selectedNodesIds = selectedNodes.map(node => node.id);
    useTree.getState().setNodes(nodes => nodes.map(node => selectedNodesIds.includes(node.id) ? {
        ...node,
        selected: false,
    } : node));
    useAppStateStore.setState({disableSelect: false});
}
