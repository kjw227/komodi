import * as _ from "lodash";

abstract class TypeBase {
    abstract get primitive(): boolean;

    equals(typeInfo: TypeInfo): boolean {
        if (this.primitive) {
            return typeInfo instanceof this.constructor;
        }
        return false;
    };
}

export class TNumber extends TypeBase {
    readonly name: "float" = "float";
    readonly primitive = true;
}

export class TString extends TypeBase {
    readonly name: "string" = "string";
    readonly primitive = true;
}

export class TBoolean extends TypeBase {
    readonly name: "boolean" = "boolean";
    readonly primitive = true;
}

export class TVoid extends TypeBase {
    readonly name: "void" = "void";
    readonly primitive = true;
}

export class TDummy extends TypeBase {
    readonly name: "test" = "test";
    readonly primitive = true;
}

export class TFunction extends TypeBase {
    readonly name: "Function" = "Function";
    readonly primitive = false;

    constructor(public args: TypeInfo[], public returns: TypeInfo) {
        super();
    }

    equals(typeInfo: TypeInfo): boolean {
        if (typeInfo instanceof TFunction) {
            if (typeInfo.args.length == this.args.length) {
                return _.every(typeInfo.args, (argType, i) => this.args[i].equals(argType))
                    && this.returns.equals(typeInfo.returns);
            }
        }
        return false;
    }
}

export type TypeInfo = TNumber | TString | TBoolean | TVoid | TFunction | TDummy;

export function typeInfoToColor(typeInfo: TypeInfo): number {
    switch (typeInfo.name) {
        case "float":
            return 0xC5EFF7;
        case "string":
            return 0xF1A9A0;
        case "boolean":
            return 0xDCC6E0;
        case "void":
            return 0xFFFFFF;
        case "test":
            return 0xFFD700;

        case "Function":
            return 0;
    }
}