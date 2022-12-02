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
        overflow: "hidden",
    },
    operatorNode: {
        borderRadius: "50%"
    },
    terminalNode: {}
}));

export default useNodeStyles
