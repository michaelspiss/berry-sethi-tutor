import {MantineThemeOther} from "@mantine/core";

declare module '@mantine/core' {
    export interface MantineThemeOther {
        headerHeight: number;
    }
}

const mantineThemeOther: MantineThemeOther = {
    headerHeight: 50,
}

export default mantineThemeOther
