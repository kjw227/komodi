import {Block, Declaration, FlowItemFactory, Signal} from "./flow";
import {SignalShape} from "../shape/SignalShape";
import {noStrategy, splitJoinStrategy} from "../controllers/flowStrategies";
import {BlockShape} from "../shape/shape";
import {IfBlockShape} from "../shape/IfBlockShape";
import {DeclarationShape} from "../shape/DeclarationShape";
import {FunctionShape} from "../shape/FunctionShape";
import {TBoolean, TFunction, TNumber, TString, TVoid} from "../type/type";

class SimpleBlock extends Block {
    constructor(shape: BlockShape) {
        super(shape, 0, noStrategy);
    }
}

class BranchBlock extends Block {
    constructor(shape: BlockShape) {
        super(shape, 2, splitJoinStrategy);
    }
}

export let startSignalFactory = new FlowItemFactory(Signal, new SignalShape('onLoad'));

export let ifBlockFactory = new FlowItemFactory(BranchBlock, new IfBlockShape());

export let declarationFactory = new FlowItemFactory(Declaration, new DeclarationShape(0xC8E6C9));

// TODO: parse type info and labels at once by jison
export let intBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([], new TNumber()),
    "User Input"
));
export let tenBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([], new TNumber()),
    "10"
));
export let multiplyBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([new TNumber()], new TNumber()),
    "(num) x2"
));
export let yesBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([], new TString()),
    "\"yes\""
));
export let noBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([], new TString()),
    "\"no\""
));
export let printStingBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([new TString()], new TVoid()),
    "print(string)"
));
export let binaryBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([new TNumber(), new TNumber()], new TBoolean()),
    "(num1)<(num2)"
));