import {createStyles} from "@mantine/core";

const useStyles = createStyles((theme) => ({
    attribute: {
        position: "absolute",
        fontSize: theme.spacing.md,
    },
    topLeft: {
        top: -15,
        left: -12,
    }
}));

export default function NodeAttributes(props: {data: {[key: string]: any}}) {
    const {classes, cx, theme} = useStyles();

    return <>
        {props.data.canBeEmpty === undefined ? null : <div className={cx(classes.attribute, classes.topLeft)}>
            {props.data.canBeEmpty
                ? <span style={{color: theme.colors.green[7]}}>t</span>
                : <span style={{color: theme.colors.red[7]}}>f</span>}
        </div>}
    </>
}
