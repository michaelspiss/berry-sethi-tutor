import {Button} from "@mantine/core";
import steps from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";
import {useReactFlow} from "reactflow";
import {useState} from "react";
import {IconBan, IconCheck} from "@tabler/icons";

export default function VerifyTreeButton() {
    const solveStep = useAppStateStore((state) => state.solveStep);
    const reactFlow = useReactFlow();
    const [state, setState] = useState<"idle"|"error"|"success">("idle");

    return <Button w={75} color={state==="success" ? "green" : state === "error" ? "red" : "blue"} onClick={() => {
        const result = steps[solveStep].verifier(reactFlow.getNodes(), reactFlow.getEdges());
        if(!result.errors) {
            steps[solveStep].cleanup(result.nodes, result.edges);
            steps[solveStep + 1]?.prepare?.call(null, result.nodes, result.edges);
            reactFlow.setNodes(result.nodes);
            reactFlow.setEdges(result.edges);
            useAppStateStore.setState({solveStep: solveStep + 1, verificationErrors: undefined});
            const fitView = setTimeout(() => reactFlow.fitView(), 100);
            setState("success");
            const feedback = setTimeout(() => setState("idle"), 2500);
            return () => {clearTimeout(fitView); clearTimeout(feedback);}
        } else {
            useAppStateStore.setState({verificationErrors: result.errors});
            setState("error");
            const feedback = setTimeout(() => setState("idle"), 2500);
            return () => clearTimeout(feedback);
        }
    }}>
        {
            state === "idle" ? "Verify" :
                state === "success" ? <IconCheck size={16} /> :
                    state === "error" ? <IconBan size={16} /> : ""
        }
    </Button>
}
