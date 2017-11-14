import * as _ from "lodash";
import {drawEditPoint, drawLinear, initFlowGraphics, Scope} from "./scope";
import {Control} from "../controls";
//import {ParameterInfo, ParameterRenderer} from "../ui/ParameterRenderer";
import {FLOW_VERTICAL_MARGIN, Offset} from "../common";
import {Komodi} from "../Global";

//const SPLIT_VERT_PADDING = 40;

const OUTLINE_PADDING = 6;

//const GENERATOR_VERTICAL_PADDING = 6;

export class ClassScope extends Scope {
    //private parameterRenderer: ParameterRenderer;

    constructor(control: Control) {
        super(control, 2);

        //this.parameterRenderer = new ParameterRenderer(control);
    }

    drawScope(): Offset {
        //this.parameterRenderer.update(this.parameterInfoArr);
        //this.control.addChild(this.parameterRenderer);

        let hlist = _.fill(Array(2), 0);

        for(let i = 0; i < 2; i++){
            let now = this.scopeChildren[i];
            while(now){
                now.update();

                let hCandidate = now.getBounds().height;

                if (hlist[i] < hCandidate){
                    hlist[i] = hCandidate;
                }
                now = now.flow;
            }
        }

        initFlowGraphics(this.graphics);
        let startY = 20;
        //let hsum = _.sum(hlist) + 6 * (hlist.length - 1);
        let accY = startY;

        //let startY = this.parameterRenderer.height + GENERATOR_VERTICAL_PADDING*2;
        //this.parameterRenderer.y = startY / 2;

        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(0, startY);
        console.log(hlist);

        accY += hlist[0]*.5;

        const editY = accY + FLOW_VERTICAL_MARGIN*.5;
        const nextY = accY * 2 + FLOW_VERTICAL_MARGIN;

        this.graphics.moveTo(0, startY);
        this.graphics.lineTo(0, nextY);

        drawEditPoint(this.graphics, 0, editY);
        Komodi.attachManager.updateScope(this, 0, {
            offsetX: 0,
            offsetY: editY
        });

        accY += hlist[0]*.5 + FLOW_VERTICAL_MARGIN;

        /*drawEditPoint(this.graphics, 0, startY+FLOW_VERTICAL_MARGIN*.5);

        drawEditPoint(this.graphics, 0, startY+FLOW_VERTICAL_MARGIN*4);

        Komodi.attachManager.updateScope(this, 0, {
            offsetX: 0,
            offsetY: startY+FLOW_VERTICAL_MARGIN*.5,
        });

        Komodi.attachManager.updateScope(this, 1, {
            offsetX: 0,
            offsetY: startY+FLOW_VERTICAL_MARGIN*4,
        });*/

        let offset = drawLinear(this.graphics, 0, startY + accY, this.scopeChildren[0], true);

        let bounds = this.control.getLocalBounds();

        // draw parameterRenderer background
        /*this.graphics.lineStyle();
        this.graphics.beginFill(0xCFD8DC, 0.8);
        this.graphics.drawRect(
            bounds.x - OUTLINE_PADDING, 0,
            bounds.width + OUTLINE_PADDING*2, startY
        );
        this.graphics.endFill();*/

        // draw outline
        this.graphics.lineStyle(1, 0x9E9E9E);
        this.graphics.drawRect(
            bounds.x - OUTLINE_PADDING, 0,
            bounds.width + OUTLINE_PADDING*2, bounds.bottom
        );

        return offset;
    }

    destroy() {
        //this.parameterRenderer.destroy();

        super.destroy();
    }
}