import {Button} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import steps from "@/tree_builder/domain/steps";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import useTree from "@/tree_builder/domain/useTree";

export default function SolveButton() {
    const solveStep = useAppStateStore((state) => state.solveStep);
    const setNodes = useTree(state => state.setNodes);
    const setEdges = useTree(state => state.setEdges);
    const {classes, cx} = useNodeStyles()

    return <Button color="green" onClick={() => {
        const result = steps[solveStep].solver(useTree.getState().nodes, useTree.getState().edges);
        const styledNodes = result.nodes.map((node) => {
            node.className = cx(classes.node, node.type === 'operator' && classes.operatorNode)
            return node;
        });
        steps[solveStep].cleanup?.apply(null, [styledNodes, result.edges]);
        let nextSolveStep = solveStep;
        if(steps[solveStep + 1] !== undefined) {
            nextSolveStep++;
            steps[solveStep + 1]?.prepare?.call(null, styledNodes, result.edges);
        }
        setNodes(styledNodes);
        setEdges(result.edges);

        useAppStateStore.setState({solveStep: nextSolveStep, verificationErrors: undefined});
        const to = setTimeout(() => useTree.getState().reactFlow?.fitView({padding: 0.2}), 300);
        return () => clearTimeout(to);
    }}>Solve</Button>
}
