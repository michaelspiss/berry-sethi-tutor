import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import {useAttributeStyles} from "@/tree_builder/presentation/NodeAttributes";
import {createStyles} from "@mantine/core";

const useStyles = createStyles(() => ({
    attribute: {
        lineHeight: 1,
        fontSize: 12,
    },
    node: {
        transform: "scale(1)",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 10,
    }
}))

export default function NodeAttributeLegend() {
    const {classes} = useStyles();
    const {classes: nodeClasses, cx} = useNodeStyles();
    const {classes: attributeClasses} = useAttributeStyles();

    return <div className={cx(classes.node, nodeClasses.node)}>
        <div className={nodeClasses.nodeContent}>c</div>
        <div className={cx(attributeClasses.attribute, attributeClasses.topLeft, classes.attribute)}>can read empty</div>
        <div className={cx(attributeClasses.attribute, attributeClasses.bottomLeft, classes.attribute)}>first reached</div>
        <div className={cx(attributeClasses.attribute, attributeClasses.topRight, classes.attribute)}>next reached</div>
        <div className={cx(attributeClasses.attribute, attributeClasses.bottomRight, classes.attribute)}>last reached</div>
    </div>
}
