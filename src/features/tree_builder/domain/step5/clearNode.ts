import {Node} from "reactflow";
import useTree from "@/tree_builder/domain/useTree";

export default function clearNode(selectedNodes: Node[], attribute: string) {
    const selectedNodesIds = selectedNodes.map(node => node.id);
    useTree.getState().setNodes(nodes => nodes.map(node => selectedNodesIds.includes(node.id) ? {
        ...node,
        data: {
            ...node.data,
            [attribute]: [],
        }
    } : node))
}
