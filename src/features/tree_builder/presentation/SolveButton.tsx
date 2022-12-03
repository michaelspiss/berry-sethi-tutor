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
        // Add styling to nodes before set
        reactFlow.setNodes(result.nodes.map((node) => {
            node.className = cx(classes.node, node.type === 'operator' ? classes.operatorNode : classes.terminalNode)
            return node;
        }))
        reactFlow.setEdges(result.edges);
        useAppStateStore.setState({solveStep: solveStep + 1})
    }}>Solve</Button>
}
