import {Button} from "@mantine/core";
import steps from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";
import {useReactFlow} from "reactflow";

export default function VerifyTreeButton() {
    const solveStep = useAppStateStore((state) => state.solveStep);
    const reactFlow = useReactFlow();

    return <Button onClick={() => {
        const result = steps[solveStep].verifier(reactFlow.getNodes(), reactFlow.getEdges());
        if(!result.errors) {
            steps[solveStep].cleanup(result.nodes, result.edges);
            reactFlow.setNodes(result.nodes);
            reactFlow.setEdges(result.edges);
            useAppStateStore.setState({solveStep: solveStep + 1, verificationErrors: undefined});
            const to = setTimeout(() => reactFlow.fitView(), 100);
            return () => clearTimeout(to);
            // TODO: display positive feedback
        } else {
            useAppStateStore.setState({verificationErrors: result.errors});
        }
    }}>Verify</Button>
}
