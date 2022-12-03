import {Button} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import steps from "@/tree_builder/domain/steps";
import {useReactFlow} from "reactflow";

export default function SolveButton() {
    const solveStep = useAppStateStore((state) => state.solveStep);
    const reactFlow = useReactFlow();

    if(reactFlow === null) {
        return null;
    }

    return <Button color="green" onClick={() => {
        const result = steps[solveStep].solver(reactFlow.getNodes(), reactFlow.getEdges());
        reactFlow.setNodes(result.nodes);
        reactFlow.setEdges(result.edges);
        useAppStateStore.setState({solveStep: solveStep + 1})
    }}>Solve</Button>
}
