import {createStyles, Stepper} from "@mantine/core";

const useStyles = createStyles((theme) => ({
    step: {
        height: 48,
        minHeight: 0,
        marginTop: 0,
    },
    verticalSeparator: {
        height: 10,
        left: 16,
        top: 40,
        borderColor: theme.colors.gray[4],
    },
    verticalSeparatorActive: {
        borderColor: theme.colors.green[4],
    },
    stepBody: {
        minHeight: 33,
        justifyContent: "center"
    },
    stepIcon: {
        height: 32,
        width: 32,
        minWidth: 32,
        position: "relative",
        marginTop: 5,
        [`&[data-completed="true"]`]: {
            backgroundColor: theme.colors.green[4],
            borderColor: theme.colors.green[4],
        }
    },
    stepCompletedIcon: {
        height: 28,
        width: 12,
        left: 8,
    }
}))

interface ProgressProps {
    /**
     * Zero indexed, indicated which step is currently in progress of being solved
     */
    activeStep: number
}

/**
 * Displays a vertical list of steps which need to be performed, as well as which have already been solved
 * @param props
 * @constructor
 */
export default function StepsProgress(props: ProgressProps) {
    const {classes} = useStyles();

    return <Stepper active={props.activeStep} orientation={"vertical"} classNames={classes} size={"sm"}>
        <Stepper.Step label={"Create Syntax tree"} />
        <Stepper.Step label={"Draw possible steps"} />
        <Stepper.Step label={"Enumerate leaves"} />
        <Stepper.Step label={"Set empty attributes"} />
        <Stepper.Step label={"Collect may-set of first reached states"} />
        <Stepper.Step label={"Collect may-set of next reached read states per subtree"} />
        <Stepper.Step label={"Collect may-set of last reached read states per subtree"} />
        <Stepper.Step label={"Create automaton"}/>
    </Stepper>
};
