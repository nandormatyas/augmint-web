const theme = {
    colors: {
        white: "white",
        grey: "#e0e1e2",
        mediumGrey: "#767676",
        lightGrey: "#e8e8e8",
        opacExtraLighterGrey: "rgba(0,0,0,.05)",
        opacLighterGrey: "rgba(0,0,0,.6)",
        opacLightGrey: "rgba(0,0,0,.8)",
        opacWhite: "rgba(255, 255, 255, 0.5)",
        primary: "#051d2d",
        secondary: "#ffad00",
        lightCyan: "#f8ffff",
        darkCyan: "#276f86",
        lightRed: "#fff6f6",
        darkRed: "#9f3a38",
        lightGreen: "#fcfff5",
        darkGreen: "#2c662d"
    },
    transitions: {
        standard: "0.3s ease-in",
        fast: "0.1s ease"
    },
    pageSize: {
        maxSize: "1127px"
    },
    typography: {
        fontFamilies: {
            default: "MaisonNeue,'Helvetica Neue',Arial,Helvetica,sans-serif"
        },
        fontSizes: {
            h4: remCalc(24),
            h3: remCalc(26),
            h2: remCalc(34)
        }
    }
};

export default theme;

export function remCalc(pixelSize) {
    const remCorrection = 16 / 14;

    return pixelSize / 16 * remCorrection + "rem";
}
