import {Button} from "@mantine/core";
import steps from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";
import {useState} from "react";
import {IconBan, IconCheck} from "@tabler/icons";
import useTree from "@/tree_builder/domain/useTree";

export default function VerifyTreeButton() {
    const solveStep = useAppStateStore((state) => state.solveStep);
    const setNodes = useTree(state => state.setNodes);
    const setEdges = useTree(state => state.setEdges);
    const [state, setState] = useState<"idle"|"error"|"success">("idle");

    return <Button w={75} color={state==="success" ? "green" : state === "error" ? "red" : "blue"} onClick={() => {
        const result = steps[solveStep].verifier(useTree.getState().nodes, useTree.getState().edges);
        if(!result.errors) {
            steps[solveStep].cleanup(result.nodes, result.edges);
            let nextSolveStep = solveStep;
            if(steps[solveStep + 1] !== undefined) {
                nextSolveStep++;
                steps[solveStep + 1]?.prepare?.call(null, result.nodes, result.edges);
            } else {
                useAppStateStore.setState({isDone: true});
            }
            setNodes(result.nodes);
            setEdges(result.edges);
            useAppStateStore.setState({solveStep: nextSolveStep, verificationErrors: undefined});
            const fitView = setTimeout(() => useTree.getState().reactFlow?.fitView({padding: 0.2}), 300);
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
