import {createStyles} from "@mantine/core";
import {DragEvent} from "react";

const useStyles = createStyles((theme) => ({
    panel: {
        background: theme.colors.gray[0],
        display: "flex"
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
    const {classes} = useStyles();
    const onDragStart = (event : DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/berrysethitutor', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    }

    return <div className={classes.panel}>
        <div className={"operatorNode " + classes.node}
             onDragStart={(event) => onDragStart(event, 'operator')}
             draggable>
            Operator node
        </div>
        <div className={"terminalNode " + classes.node}
             onDragStart={(event) => onDragStart(event, 'terminal')}
             draggable>
            Terminal Node
        </div>
    </div>
}
