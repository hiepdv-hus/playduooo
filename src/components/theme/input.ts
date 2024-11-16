import { inputAnatomy as parts } from "@chakra-ui/anatomy"
import {
    createMultiStyleConfigHelpers,
    defineStyle,
} from "@chakra-ui/styled-system"
import {bg2, red1} from "../../common/utils/Styles.tsx";

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys)

// default base style from the Input theme
const baseStyle = definePartsStyle({
    field: {
        width: "100%",
        minWidth: 0,
        outline: 0,
        position: "relative",
        appearance: "none",
        transitionProperty: "common",
        transitionDuration: "normal",
        _disabled: {
            opacity: 0.4,
            cursor: "not-allowed",
        },
    },
})

const variantOutline = definePartsStyle((props) => {
    return {
        field: {
            fontFamily: "mono", // change font family to mono
        }
    }
})

const variantFilled = definePartsStyle((props) => {
    return {
        field: {
            fontWeight: "semibold", // change font weight to semibold
        },
    }
})

// Defining a custom variant
const variantCustom = definePartsStyle((props) => {
    const { colorScheme: c } = props
    return {
        field: {
            border: "0px solid",
            bg: "gray.50",
            borderTopRightRadius: "full",
            borderBottomRightRadius: "full",
            _dark: {
                bg: "whiteAlpha.50"
            },

            _hover: {
                bg: "gray.200",
                _dark: {
                    bg: "whiteAlpha.100"
                }
            },
            _readOnly: {
                boxShadow: "none !important",
                userSelect: "all",
            },
            _focusVisible: {
                bg: "gray.200",
                _dark: {
                    bg: "whiteAlpha.100"
                }
            },
        },
        addon: {
            border: "0px solid",
            borderColor: "transparent",
            borderTopLeftRadius: "full",
            borderBottomLeftRadius: "full",
            bg: `${c}.500`,
            color: "white",
            _dark: {
                bg: `${c}.300`,
                color: `${c}.900`,
            }
        },
        element: {
            bg: "white",
            rounded: "full",
            border: "1px solid",
            borderColor: "gray.100",
            _dark: {
                bg: "whiteAlpha.50",
                borderColor: "whiteAlpha.100",
            }
        },
    }
})

const variantSelect1 = definePartsStyle({
    field: {
        background: bg2,
        border: "1px solid transparent",
        borderRadius: 10,
        fontSize: 16,
        color: "white",
        _hover: {
            // bg: "gray.200",
            border: "1px solid white",
            _dark: {
                // bg: "whiteAlpha.100"
            }
        },
        _invalid: {
            border: '1px solid red'
        },

    },
    icon: {
        color: "white"
    }

})
const variantInputGr1 = definePartsStyle({

    addon: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        background: bg2,
        color:'white',
        fontSize:16,

        _hover:{
            cursor: "pointer",
            opacity: 80,
        }

    },

})


const variantAsLogin = definePartsStyle(() => {
    return {
        field: {
            border: "1px solid transparent",
            background: bg2,
            borderRadius: 10,
            color: "white",
            fontSize: 16,

            _invalid: {
                border: '1px solid red'
            },
            _hover: {
                // bg: "gray.200",
                border: "1px solid white",
                _dark: {
                    // bg: "whiteAlpha.100"
                }
            },
            _readOnly: {
                boxShadow: "none !important",
                userSelect: "all",
            },
            _focusVisible: {
                // bg: red1,
                border: "1px solid white",

                _dark: {
                    bg: "whiteAlpha.100"
                }
            },
        },

    }
})


const variants = {
    outline: variantOutline,
    filled: variantFilled,
    custom: variantCustom,
    custom1: variantAsLogin,
    customSelect1: variantSelect1,
    inputGr1: variantInputGr1,
}

const size = {
    md: defineStyle({
        fontSize: "sm",
        px: "4",
        h: "10",
        borderRadius: "none",
    }),
}

const sizes = {
    md: definePartsStyle({
        field: size.md,
        addon: size.md,
    }),
}

export const inputTheme = defineMultiStyleConfig({
    baseStyle,
    variants,
    sizes,
    defaultProps: {
        size: "md",
        variant: "outline",
    },
})