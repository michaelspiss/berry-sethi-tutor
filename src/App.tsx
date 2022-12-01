import {AppShell, Center, Header, MantineProvider, Navbar} from '@mantine/core';
import RegexInputScreen from "@/layout/presentation/screens/RegexInputScreen";
import mantineThemeOther from "./configuration/mantineThemeOther";
import useAppStateStore from "@/layout/stores/appStateStore";
import StepsProgress from "@/layout/presentation/StepsProgress";


export default function App() {
    const regex = useAppStateStore((state) => state.regex);
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
                !regex ? undefined : <Navbar width={{base: 240}} p={"xs"}>
                    <StepsProgress activeStep={solveStep} />
                </Navbar>
            }>
                {!regex ? <RegexInputScreen /> : null}
            </AppShell>
        </MantineProvider>
    );
}
