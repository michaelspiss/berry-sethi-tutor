import {createStyles} from "@mantine/core";

/**
 * Styles for tree nodes
 */
const useNodeStyles = createStyles((theme) => ({
    node: {
        border: `2px solid ${theme.colors.gray[9]}`,
        background: theme.colors.gray[0],
        color: theme.colors.gray[9],
        height: 40,
        width: 40,
        fontSize: 20,
        position: "relative",
        "&.selected": {
            outline: `2px solid ${theme.colors.blue[5]}`
        }
    },
    nodeContent: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        flexWrap: "wrap",
        lineHeight: 40,
        pointerEvents: "none",
    },
    operatorNode: {
        borderRadius: "50%"
    },
    terminalSubscript: {
        border: `2px solid ${theme.colors.gray[9]}`,
        position: "absolute",
        bottom: -14,
        right: 8,
        height: 20,
        width: 20,
        background: theme.colors.gray[0],
        color: theme.colors.gray[9],
        lineHeight: "15px",
        fontSize: "12px",
    }
}));

export default useNodeStyles
