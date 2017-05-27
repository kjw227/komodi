import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {StateSprite} from "./StateSprite";
import {SideMenuInfo} from "../blockDefinition";
import {centerChild, createLabel} from "../utils";
import {AbsControlFactory, AbsGenerator} from "../factories/ControlFactory";
import {InteractiveRect} from "./InteractiveRect";
import {GeneratorEventType} from "./customEvents";

const ACTIVE_COLOR = 0xBBDEFB;
const INACTIVE_COLOR = 0xE3F2FD;

const MENU_ITEM_WIDTH = 70;
const MENU_ITEM_HEIGHT = 70;

const GENERATOR_PADDING = 12;

const MENU_ITEM_PATH = [
    0, 0,
    MENU_ITEM_WIDTH, 0,
    MENU_ITEM_WIDTH, MENU_ITEM_HEIGHT,
    0, MENU_ITEM_HEIGHT,
    0, 0,
];

class MenuItem extends StateSprite {
    constructor(msg: string) {
        super();

        let inactive = new PIXI.Graphics();
        inactive.lineStyle(1);
        inactive.beginFill(INACTIVE_COLOR);
        inactive.drawPolygon(MENU_ITEM_PATH);

        let active = new PIXI.Graphics();
        active.beginFill(ACTIVE_COLOR);
        active.drawPolygon(MENU_ITEM_PATH);

        this.addState("inactive", inactive);
        this.addState("active", active);

        this.setState("inactive");

        let label = createLabel(msg);
        this.addChild(label);
        centerChild(label, MENU_ITEM_WIDTH*.5, MENU_ITEM_HEIGHT*.5);

        this.interactive = true;
    }
}

class GeneratorList extends PIXI.Container {
    private generators: AbsGenerator[];
    private background: InteractiveRect;

    constructor(factories: AbsControlFactory[], private minHeight: number) {
        super();

        this.background = new InteractiveRect(ACTIVE_COLOR);
        this.addChild(this.background);

        this.generators = _.map(factories, (factory) => {
            let generator = new factory.generator(factory);
            this.addChild(generator);
            generator.on(GeneratorEventType.UPDATE_SHAPE, () => {
                this.update();
            });
            return generator;
        });

        this.update();
    }

    private update() {
        let backgroundWidth = 0, backgroundHeight = 0;

        _.forEach(this.generators, (generator) => {
            backgroundWidth = Math.max(backgroundWidth, generator.width);
            backgroundHeight += generator.height;
        });
        backgroundWidth += 2*GENERATOR_PADDING;
        backgroundHeight += GENERATOR_PADDING * (this.generators.length + 1);
        backgroundHeight = Math.max(backgroundHeight, this.minHeight);

        let currentY = GENERATOR_PADDING;
        _.forEach(this.generators, (generator) => {
            generator.x = backgroundWidth * .5;

            let bound = generator.getLocalBounds();
            generator.y = currentY + (-bound.top);
            currentY += generator.height + GENERATOR_PADDING;
        });

        this.background.updateRegion(new PIXI.Rectangle(
            0, 0, backgroundWidth, backgroundHeight
        ));
    }
}

export class SideMenu extends PIXI.Container {
    private menuItems: MenuItem[];
    private activeIndex: number;
    private generatorViewer: StateSprite;

    constructor(infoArr: SideMenuInfo[]) {
        super();

        this.generatorViewer = new StateSprite();
        this.addChild(this.generatorViewer);
        this.generatorViewer.x = MENU_ITEM_WIDTH;

        let minHeight = MENU_ITEM_HEIGHT * infoArr.length;

        this.menuItems = _.map(infoArr, (info, i) => {
            let item = new MenuItem(info.name);
            this.addChild(item);
            item.y = MENU_ITEM_HEIGHT * i;
            item.on("click", () => {
                this.setActiveIndex(i);
            });

            this.generatorViewer.addState(`frame${i}`, new GeneratorList(info.factories, minHeight));

            return item;
        });

        this.activeIndex = 0;
        this.setActiveIndex(0);
    }

    setActiveIndex(index: number) {
        this.menuItems[this.activeIndex].setState("inactive");
        this.activeIndex = index;
        this.menuItems[index].setState("active");
        this.generatorViewer.setState(`frame${index}`);
    }
}