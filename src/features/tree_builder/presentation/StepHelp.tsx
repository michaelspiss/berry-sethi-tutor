import {ReactNode, useState} from "react";
import {ActionIcon, Modal} from "@mantine/core";
import {IconQuestionMark} from "@tabler/icons";
import useAppStateStore from "@/layout/stores/appStateStore";
import steps from "@/tree_builder/domain/steps";

export default function StepHelp(props: {children: ReactNode}) {
    const [isOpen, setIsOpen] = useState(false);
    const solveStep = useAppStateStore(state => state.solveStep);

    return <>
        <ActionIcon variant={"outline"} color={"blue"} onClick={() => setIsOpen(true)}>
            <IconQuestionMark size={16} />
        </ActionIcon>
        <Modal opened={isOpen}
               onClose={() => setIsOpen(false)}
               title={`Step ${solveStep + 1}: ${steps[solveStep].title}`}>
            {props.children}
        </Modal>
    </>
}
