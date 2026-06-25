export class MatCustomColumnDef {

    title: string;
    key?: string;
    type?: number;
    width?: string; //In %
    height?: string; //In %
    color?: string;
    emit: boolean = false;
    valueGetter?: any;
    buttonEvent?: any;
    cssClass? : string;
    cellRenderer?: any;
}