import {Node, ReactFlowInstance} from "reactflow";

export default function clearNode(selectedNodes: Node[], reactFlow: ReactFlowInstance, attribute: string) {
    const selectedNodesIds = selectedNodes.map(node => node.id);
    reactFlow.setNodes(nodes => nodes.map(node => selectedNodesIds.includes(node.id) ? {
        ...node,
        data: {
            ...node.data,
            [attribute]: [],
        }
    } : node))
}
