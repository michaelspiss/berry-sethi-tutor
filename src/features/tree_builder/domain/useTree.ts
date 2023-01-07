import {Edge, Node, ReactFlowInstance, Viewport} from "reactflow";
import create from "zustand";

const useTree = create<{
    nodes: Node[],
    edges: Edge[],
    viewport: Viewport,
    setNodes: (update: Node[]|((nodes: Node[]) => Node[])) => void,
    setEdges: (update: Edge[]|((edges: Edge[]) => Edge[])) => void,
    reactFlow: ReactFlowInstance|null,
}>((set, get) => ({
    nodes: [],
    edges: [],
    viewport: {x: 0, y: 0, zoom: 1},
    setNodes: (update) => {
        if(typeof update === "function") {
            set({nodes: update(get().nodes)});
            return;
        }
        set({nodes: update});
    },
    setEdges: (update) => {
        if(typeof update === "function") {
            set({edges: update(get().edges)});
            return;
        }
        set({edges: update})
    },
    reactFlow: null,
}))

export default useTree
