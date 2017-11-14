import {Control} from "./Control";
import {Shape} from "../shape/shape";
import {SplitScope} from "../scope/SplitScope";
import {Komodi} from "../Global";
import {Parser} from "../parser";

export class Class extends Control {
    constructor(readonly parser: Parser, shape: Shape) {
        super(shape);

        this.setScope(new SplitScope(this, 2));

        Komodi.globalManager.registerGlobal(this);
    }

    destroy() {
        Komodi.globalManager.deleteGlobal(this);

        super.destroy();
    }
}
