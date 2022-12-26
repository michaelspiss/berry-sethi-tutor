import {useNodes} from "reactflow";
import StepHelp from "@/tree_builder/presentation/StepHelp";
import {Button, Group, Kbd} from "@mantine/core";

export default function NextReachedStatesHelper() {
    const selected_nodes = useNodes().filter(node => node.selected);
    const help = <StepHelp>
        TODO: step help
    </StepHelp>

    if(selected_nodes.length === 0) {
        return <>
            Click node to select its next reached states
            {help}
        </>
    } else {
        return <>
            <Group>
                Click all terminals which can be reached from the selected node's exit.
                {/* TODO: make buttons work */ }
                To finish press <Kbd py={2}>Enter</Kbd> or <Button size={"xs"} h={28}>Finish</Button>
            </Group>
            {help}
        </>
    }
}