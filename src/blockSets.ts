import {
    addBlockFactory,
    deviceBlockFactory,
    intDeclarationFactory,
    stringDeclarationFactory,
    varDeclarationFactory,
    compareBlockFactory,
    divBlockFactory,
    falseBlockFactory,
    forBlockFactory,
    ifBlockFactory,
    intToStringBlockFactory,
    lessThanBlockFactory,
    modBlockFactory,
    multBlockFactory,
    numberBlockFactory,
    printStringBlockFactory,
    printIntBlockFactory,
    randBlockFactory,
    readIntegerBlockFactory,
    readStringBlockFactory,
    repeatBlockFactory,
    deviceHeadFactory,
    stringBlockFactory,
    subBlockFactory,
    trueBlockFactory,
    whileBlockFactory,
    deviceMainFactory,
    readTemperatureFactory,
    readPressureFactory,
    DeviceClassFactory,
} from "./builtinFactories";
import {SideMenuInfo} from "./ui/sideMenu";

export const NO_STRING_BLOCK_SET: SideMenuInfo[] = [
    {
        name: "Signals",
        factories: [
            deviceHeadFactory,
            deviceBlockFactory,
            deviceMainFactory,
        ]
    },
    {
        name: "Flow",
        factories: [
            intDeclarationFactory,
            stringDeclarationFactory,
            varDeclarationFactory,
            forBlockFactory,
            repeatBlockFactory,
            ifBlockFactory,
            whileBlockFactory,
        ]
    },
    {
        name: "Logic",
        factories: [
            trueBlockFactory,
            falseBlockFactory,
            compareBlockFactory,
            lessThanBlockFactory,
        ]
    },
    {
        name: "Number",
        factories: [
            readIntegerBlockFactory,
            randBlockFactory,
            numberBlockFactory,
            addBlockFactory,
            subBlockFactory,
            multBlockFactory,
            divBlockFactory,
            modBlockFactory,
        ]
    },
];

export const STANDARD_BLOCK_SET: SideMenuInfo[] = NO_STRING_BLOCK_SET.concat([
    {
        name: "String",
        factories: [
            readStringBlockFactory,
            intToStringBlockFactory,
            stringBlockFactory,
            printStringBlockFactory,
            printIntBlockFactory,
        ]
    },
    {
        name: "Library",
        factories: [
            readTemperatureFactory,
            readPressureFactory,
            DeviceClassFactory,
        ]
    },
]);

export const LIBRARY_BLOCK_SET: SideMenuInfo[] = STANDARD_BLOCK_SET.concat([
    {
        name: "Library",
        factories: [
            readTemperatureFactory,
        ]
    }
]);
