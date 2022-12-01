import {Center, Paper, TextInput, useMantineTheme} from "@mantine/core";
import LectureConventions from "@/layout/presentation/LectureConventions";

export default function RegexInputScreen() {
    const theme = useMantineTheme();

    return <Center style={{height: "100%"}}>
            <Paper p={"xl"}
                   shadow={"lg"}
                   withBorder={true}
                   style={{width: theme.spacing.xl * 40}}
                   mt={-theme.other.headerHeight}>
                <TextInput placeholder={"Regex"}/>
                <LectureConventions />
            </Paper>
    </Center>
}
