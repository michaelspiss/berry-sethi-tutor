import {Center, createStyles, Group, Stack} from "@mantine/core";
import {DragEvent} from "react";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import {IconAsterisk} from "@tabler/icons";

const useStyles = createStyles((theme) => ({
    panel: {
        background: theme.colors.gray[0],
        display: "flex",
        padding: `${theme.spacing.xs}px ${theme.spacing.xl}px`,
        marginBottom: -16,
        border: `2px solid ${theme.colors.gray[4]}`,
        borderTopLeftRadius: theme.spacing.xs,
        borderTopRightRadius: theme.spacing.xs,
    },
    node: {
        cursor: "grab",
    }
}))

/**
 * Displays all nodes the user is able to drag to the canvas
 * @constructor
 */
export default function TreeElementsPanel() {
    const {classes, cx} = useStyles();
    const {classes : nodeClasses} = useNodeStyles();
    const onDragStart = (event : DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/berrysethitutor', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    }

    return <Group className={classes.panel} spacing={"xl"}>
        <Stack spacing={0}>
            <Center>
                <div className={"operatorNode " + cx(classes.node, nodeClasses.node, nodeClasses.operatorNode)}
                     onDragStart={(event) => onDragStart(event, 'operator')}
                     draggable>
                    <div className={nodeClasses.nodeContent}>
                        <IconAsterisk />
                    </div>
                </div>
            </Center>
            Operator Node
        </Stack>
        <Stack spacing={0}>
            <Center>
                <div className={"terminalNode " + cx(classes.node, nodeClasses.node, nodeClasses.terminalNode)}
                     onDragStart={(event) => onDragStart(event, 'terminal')}
                     draggable>
                    <div className={nodeClasses.nodeContent}>
                        a
                    </div>
                </div>
            </Center>
            Terminal Node
        </Stack>

    </Group>
}
