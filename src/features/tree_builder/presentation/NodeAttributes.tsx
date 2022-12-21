import {createStyles} from "@mantine/core";

const useStyles = createStyles((theme) => ({
    attribute: {
        position: "absolute",
        fontSize: theme.spacing.sm,
        width: theme.spacing.xl * 2,
        lineHeight: theme.spacing.md + "px",
        zIndex: 10,
    },
    topLeft: {
        top: -10,
        right: 40,
        textAlign: "right",
    },
    bottomLeft: {
        right: 38,
        bottom: -10,
        textAlign: "right",
    },
    topRight: {
        left: 38,
        top: -10,
    },
    bottomRight: {
        left: 38,
        bottom: -10,
    }
}));

export default function NodeAttributes(props: {data: {[key: string]: any}}) {
    const {classes, cx, theme} = useStyles();

    return <>
        {props.data.canBeEmpty === undefined ? null
            : <div className={cx(classes.attribute, classes.topLeft)}>
            {props.data.canBeEmpty
                ? <span style={{color: theme.colors.green[7]}}>t&nbsp;</span>
                : <span style={{color: theme.colors.red[7]}}>f&nbsp;</span>}
            </div>}
        {props.data.firstReached === undefined ? null
            : <div className={cx(classes.attribute, classes.bottomLeft)} style={{color: theme.colors.blue[7]}}>
                {"{" + props.data.firstReached.join(",") + "}"}
            </div> }
        {props.data.nextReached === undefined ? null
            : <div className={cx(classes.attribute, classes.topRight)} style={{color: theme.colors.teal[9]}}>
                {"{" + props.data.nextReached.join(",") + "}"}
            </div> }
        {props.data.lastReached === undefined ? null
            : <div className={cx(classes.attribute, classes.bottomRight)} style={{color: theme.colors.yellow[9]}}>
                {"{" + props.data.lastReached.join(",") + "}"}
            </div> }
    </>
}
