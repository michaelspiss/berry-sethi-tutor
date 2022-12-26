import {Node, ReactFlowInstance} from "reactflow"
import useEnumerateLeaves from "@/tree_builder/domain/step3/useEnumerateLeaves";

export default function enumerateLeavesOnClickHandler(node: Node, reactFlow: ReactFlowInstance) {
    if(node.type !== "terminal" || node.data.terminalIndex !== undefined) {
        return;
    }

    reactFlow.setNodes(nodes => nodes.map(active_node => {
        if(active_node.id !== node.id) {
            return active_node;
        }

        return {
            ...node,
            data: {
                ...node.data,
                terminalIndex: useEnumerateLeaves.getState().getNextIndex(),
            }
        }
    }))
}
