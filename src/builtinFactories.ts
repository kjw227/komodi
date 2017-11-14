import {Block, Declaration, FlowBlock, Signal, Class} from "./controls";
import {SignalShape} from "./shape/SignalShape";
import {BlockShape} from "./shape/shape";
import {ConditionBlockShape} from "./shape/ConditionBlockShape";
import {DefineShape} from "./shape/DefineShape";
import {FunctionShape} from "./shape/FunctionShape";
import {TBoolean, TFunction, TNumber, TString, TVoid} from "./type";
import {SplitScope} from "./scope/SplitScope";
import {LoopScope} from "./scope/LoopScope";
import {SimpleFactory} from "./factories/SimpleFactory";
import {ParameterParser, Parser, PatternParser} from "./parser";
import {ParameterFactory} from "./factories/ParameterFactory";
import {CurvedDeclarationShape, CurvedFunctionShape} from "./shape/CurvedFunctionShape";
import {generateToken} from "./utils";
import {ForBlock} from "./controls/ForBlock";

class IfBlock extends FlowBlock {
    constructor(logic: Parser, shape: BlockShape) {
        super(logic, shape);

        this.setScope(new SplitScope(this, 2));
    }
}

class LoopBlock extends FlowBlock {
    constructor(logic: Parser, shape: BlockShape) {
        super(logic, shape);

        this.setScope(new LoopScope(this));
    }
}

export let deviceHeadFactory = new SimpleFactory(
    Signal,
    new PatternParser(``),
    new SignalShape('Test')
);

export let deviceBlockFactory = new ParameterFactory(
    Signal,
    [{name: "value", initial: "RBP"}],
    (data: any) => {
        return {
            parser: new PatternParser(`(function () {$1})()`),
            shape: new SignalShape(`${data.value}`)
        }
    }
)

export let deviceMainFactory = new ParameterFactory(
    LoopBlock,
    [{name: "value", initial: "main"}],
    (data: any) => {
        return {
            // TODO: quote the given string
            parser: new PatternParser(`${data.value}(){\n$1\n};`),
            shape: new CurvedFunctionShape([],`${data.value}`)
        }
    }
);

export let ifBlockFactory = new SimpleFactory(
    IfBlock,
    new PatternParser(`if (@1){\n$1\n}\nelse{\n$2}\n`),
    new ConditionBlockShape('if')
);

export let whileBlockFactory = new SimpleFactory(
    LoopBlock,
    new PatternParser(`while (@1) {\n$1}\n`),
    new ConditionBlockShape('while')
);

export let forBlockFactory = new ParameterFactory(
    ForBlock,
    [{name: "variable", initial: 'i'}],
    (data: any) => {
        let token = generateToken();
        return {
            parser: new ParameterParser(`for (int ${token} = (@1); ${token} < (@2); ${token}++){\n$1\n}`, token),
            shape: new CurvedDeclarationShape(
                [new TNumber(), new TNumber()],
                `for ${data.variable} in (min)~(max)`,
                data.variable
            )
        }
    }
);

export let repeatBlockFactory = (function () {
    let token = generateToken();
    return new SimpleFactory(
        LoopBlock,
        new PatternParser(`for (int ${token} = 0; ${token} < (@1); ${token}++){\n$1\n}`),
        new CurvedFunctionShape(
            [new TNumber()],
            `repeat (N) times`
        )
    );
})();

export let trueBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`1`),
    new FunctionShape(
        new TFunction([], new TBoolean()),
        "true"
    )
);

export let falseBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`0`),
    new FunctionShape(
        new TFunction([], new TBoolean()),
        "false"
    )
);

export let intDeclarationFactory = new ParameterFactory(
    Declaration,
    [{name: "variable", initial: 'int'}],
    (data: any) => {
        let token = generateToken();
        return {
            parser: new ParameterParser(`int ${token} = (@1);\n $1`, token),
            shape: new DefineShape(data.variable)
        }
    }
);

export let stringDeclarationFactory = new ParameterFactory(
    Declaration,
    [{name: "variable", initial: 'string'}],
    (data: any) => {
        let token = generateToken();
        return {
            parser: new ParameterParser(`char ${token}[100] = (@1);\n $1`, token),
            shape: new DefineShape(data.variable)
        }
    }
);

export let varDeclarationFactory = new ParameterFactory(
    Declaration,
    [{name: "variable", initial: 'variable'}],
    (data: any) => {
        let token = generateToken();
        return {
            parser: new ParameterParser(`auto ${token} = (@1);`, token),
            shape: new DefineShape(data.variable)
        }
    }
)

// TODO: parse type info and labels at once by jison
export let readIntegerBlockFactory = new SimpleFactory(
    Block,
    // TODO: Code generation should not depend on global Komodi object
    new PatternParser(`getInt()`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "Read Integer"
    )
);

export let readStringBlockFactory = new SimpleFactory(
    Block,
    // TODO: Code generation should not depend on global Komodi object
    new PatternParser(`getString()`),
    new FunctionShape(
        new TFunction([], new TString()),
        "Read String"
    )
);

export let randBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`UNIMPLEMENTED`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TNumber()),
        "random (min)~(max)"
    )
);

export let numberBlockFactory = new ParameterFactory(
    Block,
    [{name: "value", initial: 10}],
    (data: any) => {
        return {
            parser: new PatternParser(`${data.value}`),
            shape: new FunctionShape(
                new TFunction([], new TNumber()),
                `${data.value}`
            )
        }
    }
);

export let addBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`(@1)+(@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TNumber()),
        "(num1) + (num2)"
    )
);

export let subBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`(@1)-(@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TNumber()),
        "(num1) - (num2)"
    )
);

export let multBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`(@1)*(@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TNumber()),
        "(num1) * (num2)"
    )
);

export let divBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`((@1)/(@2))`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TNumber()),
        "(num1) / (num2)"
    )
);

export let modBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`(@1)%(@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TNumber()),
        "(num1) mod (num2)"
    )
);

export let stringBlockFactory = new ParameterFactory(
    Block,
    [{name: "value", initial: "string"}],
    (data: any) => {
        return {
            // TODO: quote the given string
            parser: new PatternParser(`"${data.value}"`),
            shape: new FunctionShape(
                new TFunction([], new TString()),
                `"${data.value}"`
            )
        }
    }
);

export let intToStringBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`UNIMPLEMENTED`),
    new FunctionShape(
        new TFunction([new TNumber()], new TString()),
        "toString (num)"
    )
);

export let printStringBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`printf("%s", @1);`),
    new FunctionShape(
        new TFunction([new TString()], new TVoid()),
        "print(string)"
    )
);

export let printIntBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`printf("%d", @1);`),
    new FunctionShape(
        new TFunction([new TNumber()], new TVoid()),
        "print(int)"
    )
)

export let compareBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`(@1) == (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)==(num2)"
    )
);

export let lessThanBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`(@1) < (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)<(num2)"
    )
);

export let readTemperatureFactory = new SimpleFactory(
    Block,
    new PatternParser(`Adafruit_BMP280::readTemperature()`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "readTemp"
    )
)

export let readPressureFactory = new SimpleFactory(
    Block,
    new PatternParser(`Adafruit_BMP280::readPressure()`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "readPress"
    )
)

export let DeviceClassFactory = new ParameterFactory(
    Class,
    [{name: "value", initial: "RBP"}],
    (data: any) => {
        return {
            parser: new PatternParser(
                `#pragma esperanto EspDevDecl(${data.value}, ${data.value}_cs, ${data.value}_ds)\n` + 
                `#pragma esperanto EspDevice(${data.value})\n` + 
                `class ${data.value}{\n$1};\n` + 
                `!TEST_${data.value}[$2] ^`),
            shape: new SignalShape(`${data.value}`)
        }
    }
)
