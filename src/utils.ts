export function hitTestRectangle(obj1: PIXI.DisplayObject, obj2: PIXI.DisplayObject) {
    let bound1 = obj1.getBounds();
    let bound2 = obj2.getBounds();

    let center1 = {
        x: (bound1.left + bound1.right) * .5,
        y: (bound1.top + bound1.bottom) * .5,
    };

    let center2 = {
        x: (bound2.left + bound2.right) * .5,
        y: (bound2.top + bound2.bottom) * .5,
    };

    let vx = center2.x - center1.x;
    let vy = center2.y - center1.y;

    return Math.abs(vx) < (bound1.width+bound2.width)*.5
        && Math.abs(vy) < (bound1.height+bound2.height)*.5;
}