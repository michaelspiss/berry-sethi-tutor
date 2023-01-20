import {Box, Group, List, Text, ThemeIcon} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons";

/**
 * Displays a list of all lecture conventions which are being used in this program
 * @constructor
 */
export default function LectureConventions() {
    return <Box>
        <Group pb={"md"} pt={"md"}>
            <ThemeIcon color={"orange"} variant={"light"}><IconAlertCircle size={16}/></ThemeIcon>
            <Text color={"orange"} weight="bold">Lecture Conventions</Text>
        </Group>
        <Box px={"md"}>
            The lecture uses the following conventions for regular expressions, which
            also apply to this tool:
            <List>
                <List.Item>Every letter is its own terminal</List.Item>
                <List.Item>The following operators are supported: <code>*?+|</code>, groups and concatenation</List.Item>
                <List.Item>The concatenation operator is binary and implicit</List.Item>
            </List>
        </Box>
    </Box>
}
