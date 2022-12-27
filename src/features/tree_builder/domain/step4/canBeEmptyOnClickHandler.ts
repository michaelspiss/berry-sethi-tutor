import {Node, ReactFlowInstance} from "reactflow";

export default function canBeEmptyOnClickHandler(clicked_node: Node, reactFlow: ReactFlowInstance) {
    reactFlow.setNodes(nodes => nodes.map(node => node.id === clicked_node.id ? {
        ...node,
        data: {
            ...node.data,
            canBeEmpty: !clicked_node.data.canBeEmpty,
        }
    } : node ))
}
