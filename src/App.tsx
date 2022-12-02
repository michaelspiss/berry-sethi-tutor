import {AppShell, Center, Header, MantineProvider, Navbar} from '@mantine/core';
import mantineThemeOther from "./configuration/mantineThemeOther";
import useAppStateStore from "@/layout/stores/appStateStore";
import StepsProgress from "@/layout/presentation/StepsProgress";
import RegexInputScreen from "@/analyze_regex/presentation/screens/RegexInputScreen";

export default function App() {
    const solveStep = useAppStateStore((state) => state.solveStep);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{
            other: mantineThemeOther,
        }}>
            <AppShell header={
                <Header height={mantineThemeOther.headerHeight} px={"xs"}>
                    <Center style={{height: mantineThemeOther.headerHeight}} inline>Berry Sethi Tutor</Center>
                </Header>
            }
            navbar={
                solveStep === -1 ? undefined : <Navbar width={{base: 240}} p={"xs"}>
                    <StepsProgress activeStep={solveStep} />
                </Navbar>
            }>
                {solveStep === -1 ? <RegexInputScreen /> : null}
            </AppShell>
        </MantineProvider>
    );
}
