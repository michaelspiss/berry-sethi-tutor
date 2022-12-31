import {createStyles} from "@mantine/core";

export const useAttributeStyles = createStyles((theme) => ({
    attribute: {
        position: "absolute",
        fontSize: theme.spacing.sm,
        width: theme.spacing.xl * 2,
        lineHeight: theme.spacing.md + "px",
        zIndex: 10,
        textShadow: "1px 0 #fff, -1px 0 #fff, 0 1px #fff, 0 -1px #fff, 0px 0px #fff, -0px -0px #fff, 0px -0px #fff, -0px 0px #fff;"
    },
    topLeft: {
        top: -10,
        right: 38,
        textAlign: "right",
    },
    bottomLeft: {
        right: 38,
        bottom: -10,
        textAlign: "right",
        color: theme.colors.blue[7],
    },
    topRight: {
        left: 38,
        top: -10,
        color: theme.colors.teal[9],
    },
    bottomRight: {
        left: 38,
        bottom: -10,
        color: theme.colors.yellow[9],
    }
}));

export default function NodeAttributes(props: {data: {[key: string]: any}}) {
    const {classes, cx, theme} = useAttributeStyles();

    return <>
        {props.data.canBeEmpty === undefined ? null
            : <div className={cx(classes.attribute, classes.topLeft)}>
            {props.data.canBeEmpty
                ? <span style={{color: theme.colors.green[7]}}>t&nbsp;</span>
                : <span style={{color: theme.colors.red[7]}}>f&nbsp;</span>}
            </div>}
        {props.data.firstReached === undefined ? null
            : <div className={cx(classes.attribute, classes.bottomLeft)}>
                {"{" + props.data.firstReached.join(",") + "}"}
            </div> }
        {props.data.nextReached === undefined ? null
            : <div className={cx(classes.attribute, classes.topRight)}>
                {"{" + props.data.nextReached.join(",") + "}"}
            </div> }
        {props.data.lastReached === undefined ? null
            : <div className={cx(classes.attribute, classes.bottomRight)}>
                {"{" + props.data.lastReached.join(",") + "}"}
            </div> }
    </>
}
