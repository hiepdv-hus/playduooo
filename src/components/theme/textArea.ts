import { defineStyle, defineStyleConfig } from '@chakra-ui/react'
import {bg2} from "../../common/utils/Styles.tsx";

const textAreaStyle1 = defineStyle({
    border: "1px solid transparent",
    background: bg2,
    borderRadius: 10,
    color: "white",
    fontSize: 16,
    resize: "none",

    _focusVisible: {
        border: "1px solid white",
    },

    _hover: {
        border: "1px solid white",

    },


})

export const textAreaTheme = defineStyleConfig({
    variants: { textAreaStyle1 },
})