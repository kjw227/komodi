import {ParameterInfo} from "../ui/ParameterRenderer";
import {TVoid} from "../type";
import {ParameterScope} from "../scope/ParameterScope";
import {FlowBlock} from "./Block";
import {ParameterParser} from "../parser/index";
import {DeclarationShape} from "../shape/shape";

export class Declaration extends FlowBlock {
    private scopeInfoArr: ParameterInfo[];

    constructor(
        readonly parser: ParameterParser,
        readonly shape: DeclarationShape
    ) {
        super(parser, shape);

        this.scopeInfoArr = [{
            returnType: new TVoid(),
            label: shape.variableName,
            value: parser.id,
        }];
        let scope = new ParameterScope(this, this.scopeInfoArr);
        this.setScope(scope);
    }

    update() {
        let logicChild = this.logicChildren[0];
        this.scopeInfoArr[0] = {
            returnType: logicChild ? logicChild.shape.returnType : new TVoid(),
            label: this.shape.variableName,
            value: this.parser.id,
        };

        super.update();
    }
}
