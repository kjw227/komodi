import {Block, Declaration, FlowItemFactory, Signal} from "./flow";
import {SignalShape} from "../shape/SignalShape";
import {noStrategy, splitJoinStrategy} from "../controllers/flowStrategies";
import {BlockShape} from "../shape/shape";
import {IfBlockShape} from "../shape/IfBlockShape";
import {DeclarationShape} from "../shape/DeclarationShape";
import {FunctionShape} from "../shape/FunctionShape";
import {TBoolean, TFunction, TNumber, TString} from "../type/type";

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

export let startSignalFactory = new FlowItemFactory(Signal, new SignalShape());

export let ifBlockFactory = new FlowItemFactory(BranchBlock, new IfBlockShape());

export let declarationFactory = new FlowItemFactory(Declaration, new DeclarationShape(0xC8E6C9));

export let intBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([], new TNumber())
));
export let stringBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([], new TString())
));
export let numberToStringBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([new TNumber()], new TString())
));
export let binaryBlockFactory = new FlowItemFactory(SimpleBlock, new FunctionShape(
    new TFunction([new TNumber(), new TNumber()], new TBoolean())
));