import {Block, Declaration, Signal} from "../controls";
import {SignalShape} from "../shape/SignalShape";
import {BlockShape} from "../shape/shape";
import {ConditionBlockShape} from "../shape/ConditionBlockShape";
import {DeclarationShape} from "../shape/DeclarationShape";
import {FunctionShape} from "../shape/FunctionShape";
import {TBoolean, TFunction, TNumber, TString, TVoid} from "../type/type";
import {Parser} from "../parser/Parser";
import {SplitScope} from "../scope/SplitScope";
import {LoopScope} from "../scope/LoopScope";
import {ControlFactory} from "./ControlFactory";

class IfBlock extends Block {
    constructor(logic: Parser, shape: BlockShape) {
        super(logic, shape);

        this.setScope(new SplitScope(this, 2));
    }
}

class WhileBlock extends Block {
    constructor(logic: Parser, shape: BlockShape) {
        super(logic, shape);

        this.setScope(new LoopScope(this));
    }
}

export let startSignalFactory = new ControlFactory(
    Signal,
    new Parser(`(function () {$1})()`),
    new SignalShape('Start')
);

export let ifBlockFactory = new ControlFactory(
    IfBlock,
    new Parser(`if (@1) {$1} else {$2}`),
    new ConditionBlockShape('if')
);

export let whileBlockFactory = new ControlFactory(
    WhileBlock,
    new Parser(`while (@1) {$1}`),
    new ConditionBlockShape('while')
);

export let trueBlockFactory = new ControlFactory(
    Block,
    new Parser(`true`),
    new FunctionShape(
        new TFunction([], new TBoolean()),
        "true"
    )
);

export let declarationFactory = new ControlFactory(
    Declaration,
    new Parser(`{let local = (@1); $1}`),  // TODO: fix variable handling
    new DeclarationShape(0xC8E6C9)
);

// TODO: parse type info and labels at once by jison
export let inputBlockFactory = new ControlFactory(
    Block,
    new Parser(`parseInt(prompt("Please Enter a number"))`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "User Input"
    )
);

export let randBlockFactory = new ControlFactory(
    Block,
    new Parser(`Math.floor(Math.random()*30)+1`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "rand 1~30"
    )
);

export let tenBlockFactory = new ControlFactory(
    Block,
    new Parser(`10`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "10"
    )
);

export let multiplyBlockFactory = new ControlFactory(
    Block,
    new Parser(`(@1)*2`),
    new FunctionShape(
        new TFunction([new TNumber()], new TNumber()),
        "(num) x2"
    )
);

export let correctBlockFactory = new ControlFactory(
    Block,
    new Parser(`"correct"`),
    new FunctionShape(
        new TFunction([], new TString()),
        "\"correct\""
    )
);

export let highBlockFactory = new ControlFactory(
    Block,
    new Parser(`"high"`),
    new FunctionShape(
        new TFunction([], new TString()),
        "\"high\""
    )
);

export let lowBlockFactory = new ControlFactory(
    Block,
    new Parser(`"low"`),
    new FunctionShape(
        new TFunction([], new TString()),
        "\"low\""
    )
);

export let printStingBlockFactory = new ControlFactory(
    Block,
    new Parser(`alert(@1)`),
    new FunctionShape(
        new TFunction([new TString()], new TVoid()),
        "print(string)"
    )
);

export let compareBlockFactory = new ControlFactory(
    Block,
    new Parser(`(@1) === (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)==(num2)"
    )
);

export let lessThanBlockFactory = new ControlFactory(
    Block,
    new Parser(`(@1) < (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)<(num2)"
    )
);