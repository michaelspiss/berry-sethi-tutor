import {Button} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import steps from "@/tree_builder/domain/steps";
import {useReactFlow} from "reactflow";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";

export default function SolveButton() {
    const solveStep = useAppStateStore((state) => state.solveStep);
    const reactFlow = useReactFlow();
    const {classes, cx} = useNodeStyles()

    if(reactFlow === null) {
        return null;
    }

    return <Button color="green" onClick={() => {
        const result = steps[solveStep].solver(reactFlow.getNodes(), reactFlow.getEdges());
        const styledNodes = result.nodes.map((node) => {
            node.className = cx(classes.node, node.type === 'operator' && classes.operatorNode)
            return node;
        });
        steps[solveStep].cleanup?.apply(null, [styledNodes, result.edges]);
        reactFlow.setNodes(styledNodes);
        reactFlow.setEdges(result.edges);
        steps[solveStep + 1]?.prepare?.call(null, reactFlow);
        useAppStateStore.setState({solveStep: solveStep + 1, verificationErrors: undefined});
        const to = setTimeout(() => reactFlow.fitView(), 100);
        return () => clearTimeout(to);
    }}>Solve</Button>
}
