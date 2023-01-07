import {Button} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import steps from "@/tree_builder/domain/steps";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import useTree from "@/tree_builder/domain/useTree";

export default function SolveButton() {
    const solveStep = useAppStateStore((state) => state.solveStep);
    const reactFlow = useTree(state => state.reactFlow);
    const setNodes = useTree(state => state.setNodes);
    const setEdges = useTree(state => state.setEdges);
    const {classes, cx} = useNodeStyles()

    if(reactFlow === null) {
        return null;
    }

    return <Button color="green" onClick={() => {
        const result = steps[solveStep].solver(useTree.getState().nodes, useTree.getState().edges);
        const styledNodes = result.nodes.map((node) => {
            node.className = cx(classes.node, node.type === 'operator' && classes.operatorNode)
            return node;
        });
        steps[solveStep].cleanup?.apply(null, [styledNodes, result.edges]);
        steps[solveStep + 1]?.prepare?.call(null, styledNodes, result.edges);
        setNodes(styledNodes);
        setEdges(result.edges);
        useAppStateStore.setState({solveStep: solveStep + 1, verificationErrors: undefined});
        const to = setTimeout(() => reactFlow.fitView(), 100);
        return () => clearTimeout(to);
    }}>Solve</Button>
}
