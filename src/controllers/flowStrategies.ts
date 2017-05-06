import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {FlowControl} from "../ui/flow";
import {Global} from "../entry";
import {Offset} from "./AttachController";

export type FlowStrategy = (graphics: PIXI.Graphics, start: FlowControl) => Offset;

const FLOW_VERTICAL_MARGIN = 45;
const EDIT_POINT_RADIUS = 6;

function setGraphicsStyle(graphics: PIXI.Graphics) {
    graphics.lineStyle(3, 0);
}

export function drawEditPoint(graphics: PIXI.Graphics, x: number, y: number, highlight: boolean = false) {
    if (highlight) {
        graphics.beginFill(0xFF0000, 0.7);
    } else {
        graphics.beginFill(0xFFFFFF);
    }
    graphics.drawCircle(x, y, EDIT_POINT_RADIUS);
    graphics.endFill();
}

function drawLinear(graphics: PIXI.Graphics, startX: number, startY: number, now: FlowControl | null, updating: boolean): Offset {
    let nowX = startX;
    let nowY = startY;

    let lineDelta = (x: number, y: number) => {
        graphics.moveTo(nowX, nowY);
        graphics.lineTo(nowX+x, nowY+y);
        nowX += x;
        nowY += y;
    };

    while (now) {
        if (updating) {
            now.updateControl();
        }

        let size = now.getLocalBounds();

        lineDelta(0, -size.top);

        now.x = nowX;
        now.y = nowY;
        nowY += size.bottom;

        let prevY = nowY;
        lineDelta(0, FLOW_VERTICAL_MARGIN);

        let flowX = nowX;
        let flowY = (nowY + prevY)*.5;
        drawEditPoint(graphics, flowX, flowY);

        Global.attachController.updateFlowOffset(now, 0, {
            offsetX: 0,
            offsetY: size.bottom + FLOW_VERTICAL_MARGIN * .5,
        });

        now = now.flowChildren[0];
    }

    return {
        offsetX: nowX,
        offsetY: nowY,
    };
}

export let noStrategy: FlowStrategy = function (): Offset {
    return {
        offsetX: 0,
        offsetY: 0,
    };
};

const SPLIT_JOIN_VERTICAL_MARGIN = 15;
const SPLIT_JOIN_HORIZONTAL_MARGIN = 40;

export let splitJoinStrategy: FlowStrategy = function (graphics: PIXI.Graphics, start: FlowControl): Offset {
    if (start.numFlow > 0) {
        // pre-calculate each flow's width
        let widthList = _.fill(Array(start.numFlow), 0);

        for (let i = 0; i < start.numFlow; i++) {
            let now = start.flowChildren[i+1];
            while (now) {
                now.updateControl();

                let widthCandidate = now.getBounds().width;
                if (widthList[i] < widthCandidate) {
                    widthList[i] = widthCandidate;
                }
                now = now.flowChildren[0];
            }
        }

        // Split
        setGraphicsStyle(graphics);

        graphics.moveTo(0, 0);
        graphics.lineTo(0, SPLIT_JOIN_VERTICAL_MARGIN);

        let endOffset: Offset[] = [];
        let widthSum = _.sum(widthList) + SPLIT_JOIN_HORIZONTAL_MARGIN * (widthList.length-1);
        let splitX = -widthSum * .5;

        for (let flowIndex = 0; flowIndex < start.numFlow; flowIndex++) {
            splitX += widthList[flowIndex]*.5;
            const editY = SPLIT_JOIN_VERTICAL_MARGIN + FLOW_VERTICAL_MARGIN*.5;
            const nextY = SPLIT_JOIN_VERTICAL_MARGIN + FLOW_VERTICAL_MARGIN;

            graphics.moveTo(0, SPLIT_JOIN_VERTICAL_MARGIN);
            graphics.lineTo(splitX, SPLIT_JOIN_VERTICAL_MARGIN);
            graphics.moveTo(splitX, SPLIT_JOIN_VERTICAL_MARGIN);
            graphics.lineTo(splitX, nextY);

            drawEditPoint(graphics, splitX, editY);
            Global.attachController.updateFlowOffset(start, flowIndex+1, {
                offsetX: splitX,
                offsetY: editY,
            });

            endOffset.push(
                drawLinear(graphics, splitX, nextY, start.flowChildren[flowIndex+1], false)
            );

            splitX += widthList[flowIndex]*.5 + SPLIT_JOIN_HORIZONTAL_MARGIN;
        }

        // Join
        let maxY = _(endOffset).map((obj: Offset) => obj.offsetY).max();
        for (let flowIndex = 0; flowIndex < start.numFlow; flowIndex++) {
            const offset = endOffset[flowIndex];
            graphics.moveTo(offset.offsetX, offset.offsetY);
            graphics.lineTo(offset.offsetX, maxY);
            graphics.moveTo(offset.offsetX, maxY);
            graphics.lineTo(0, maxY);
        }
        graphics.moveTo(0, maxY);
        graphics.lineTo(0, maxY+SPLIT_JOIN_VERTICAL_MARGIN);

        return {
            offsetX: 0,
            offsetY: maxY+SPLIT_JOIN_VERTICAL_MARGIN,
        };
    } else {
        return {
            offsetX: 0,
            offsetY: 0,
        };
    }
};

const OUTLINE_PADDING = 6;

export let outlineStrategy: FlowStrategy = function (graphics: PIXI.Graphics, start: FlowControl): Offset {
    setGraphicsStyle(graphics);

    graphics.moveTo(0, 0);
    graphics.lineTo(0, FLOW_VERTICAL_MARGIN);

    drawEditPoint(graphics, 0, FLOW_VERTICAL_MARGIN*.5);
    Global.attachController.updateFlowOffset(start, 1, {
        offsetX: 0,
        offsetY: FLOW_VERTICAL_MARGIN*.5,
    });

    let offset = drawLinear(graphics, 0, FLOW_VERTICAL_MARGIN, start.flowChildren[1], true);

    let bounds = start.getLocalBounds();
    graphics.lineStyle(1, 0x9E9E9E);
    graphics.drawRect(
        bounds.x - OUTLINE_PADDING, -2,
        bounds.width + OUTLINE_PADDING*2, bounds.bottom + 2
    );

    return {
        offsetX: offset.offsetX,
        offsetY: offset.offsetY,
    };
};

const LOOP_HORIZONTAL_PADDING = 10;
const LOOP_TRIANGLE_WIDTH = 6;
const LOOP_TRIANGLE_HEIGHT = 5;

export let loopStrategy: FlowStrategy = function (graphics: PIXI.Graphics, start: FlowControl): Offset {
    setGraphicsStyle(graphics);

    graphics.moveTo(0, 0);
    graphics.lineTo(0, FLOW_VERTICAL_MARGIN);

    drawEditPoint(graphics, 0, FLOW_VERTICAL_MARGIN*.5);
    Global.attachController.updateFlowOffset(start, 1, {
        offsetX: 0,
        offsetY: FLOW_VERTICAL_MARGIN*.5,
    });

    let offset = drawLinear(graphics, 0, FLOW_VERTICAL_MARGIN, start.flowChildren[1], true);

    let bounds = start.getLocalBounds();
    bounds.height -= LOOP_TRIANGLE_HEIGHT*.5;

    let endX, endY;
    graphics.lineStyle(2, 0x616161);
    graphics.beginFill(0x616161);

    const left = bounds.left - LOOP_HORIZONTAL_PADDING;
    graphics.moveTo(left + bounds.width*.15, 0);
    graphics.lineTo(left, 0);
    graphics.moveTo(left, 0);
    graphics.lineTo(left, bounds.bottom);
    graphics.moveTo(left, bounds.bottom);
    graphics.lineTo(left + bounds.width*.35, bounds.bottom);

    endX = left + bounds.width*.35;
    endY = bounds.bottom;
    graphics.drawPolygon([
        endX, endY,
        endX-LOOP_TRIANGLE_WIDTH, endY-LOOP_TRIANGLE_HEIGHT*.5,
        endX-LOOP_TRIANGLE_WIDTH, endY+LOOP_TRIANGLE_HEIGHT*.5,
        endX, endY,
    ]);

    const right = bounds.right + LOOP_HORIZONTAL_PADDING;
    graphics.moveTo(right - bounds.width*.15, bounds.bottom);
    graphics.lineTo(right, bounds.bottom);
    graphics.moveTo(right, bounds.bottom);
    graphics.lineTo(right, 0);
    graphics.moveTo(right, 0);
    graphics.lineTo(right - bounds.width*.35, 0);

    endX = right - bounds.width*.35;
    endY = 0;
    graphics.drawPolygon([
        endX, endY,
        endX+LOOP_TRIANGLE_WIDTH, endY-LOOP_TRIANGLE_HEIGHT*.5,
        endX+LOOP_TRIANGLE_WIDTH, endY+LOOP_TRIANGLE_HEIGHT*.5,
        endX, endY,
    ]);

    return {
        offsetX: offset.offsetX,
        offsetY: offset.offsetY,
    };
};