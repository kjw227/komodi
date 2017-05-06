import {Block, Declaration, FlowItemFactory, Signal} from "./flow";
import {SignalShape} from "../shape/SignalShape";
import {loopStrategy, noStrategy, splitJoinStrategy} from "../controllers/flowStrategies";
import {BlockShape} from "../shape/shape";
import {ConditionBlockShape} from "../shape/ConditionBlockShape";
import {DeclarationShape} from "../shape/DeclarationShape";
import {FunctionShape} from "../shape/FunctionShape";
import {TBoolean, TFunction, TNumber, TString, TVoid} from "../type/type";
import {Logic} from "../logic/logic";
import {Global} from "../entry";

class SimpleBlock extends Block {
    constructor(logic: Logic, shape: BlockShape) {
        super(logic, shape, 0, noStrategy);
    }
}

class IfBlock extends Block {
    constructor(logic: Logic, shape: BlockShape) {
        super(logic, shape, 2, splitJoinStrategy);
    }
}

class WhileBlock extends Block {
    constructor(logic: Logic, shape: BlockShape) {
        super(logic, shape, 1, loopStrategy);

        Global.flowController.update(this);
    }
}

export let startSignalFactory = new FlowItemFactory(
    Signal,
    new Logic(`(function () {$1})()`),
    new SignalShape('Start')
);

export let ifBlockFactory = new FlowItemFactory(
    IfBlock,
    new Logic(`if (@1) {$1} else {$2}`),
    new ConditionBlockShape('if')
);

export let whileBlockFactory = new FlowItemFactory(
    WhileBlock,
    new Logic(`while (@1) {$1}`),
    new ConditionBlockShape('while')
);

export let declarationFactory = new FlowItemFactory(
    Declaration,
    new Logic(`alert("Not Implemented")`),
    new DeclarationShape(0xC8E6C9)
);

// TODO: parse type info and labels at once by jison
export let intBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`parseInt(prompt("Please Enter a number"))`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "User Input"
    )
);

export let tenBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`10`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "10"
    )
);

export let multiplyBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`(@1)*2`),
    new FunctionShape(
        new TFunction([new TNumber()], new TNumber()),
        "(num) x2"
    )
);

export let yesBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`"yes"`),
    new FunctionShape(
        new TFunction([], new TString()),
        "\"yes\""
    )
);

export let noBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`"no"`),
    new FunctionShape(
        new TFunction([], new TString()),
        "\"no\""
    )
);

export let printStingBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`alert(@1)`),
    new FunctionShape(
        new TFunction([new TString()], new TVoid()),
        "print(string)"
    )
);

export let binaryBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`(@1) < (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)<(num2)"
    )
);