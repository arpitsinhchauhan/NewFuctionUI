
declare const $: any;
export class AppSettings {

    public static dataColor = 'azure';
    public static dataBackgroundColor = 'reetrak-bg-info';
    public static cardHeaderClass = 'card-header-info'
    public static btnClass = "btn-info";    
    public static btnSm = "btn-sm";
    public static color ="reetrak-info";    
    public static pagination = "reetrak-pagination pagination-info";
    public static select = "reetrak-select reetrak-select-info";    
    public static navitem = "nav-pills-warning";
    public static isVirtualKeyBoardEnable = false;
    public static maxWidth = '100%';
    constructor(){
    }
    
    public static setColor(color: string) {

        switch (color) {
            case "danger":
                AppSettings.dataColor = 'danger';
                AppSettings.cardHeaderClass = 'card-header-danger';
                AppSettings.btnClass = "btn-danger";
                AppSettings.btnSm = "btn-sm";
                AppSettings.color = "reetrak-danger";                
                AppSettings.pagination = "reetrak-pagination pagination-danger";
                AppSettings.select = "reetrak-select reetrak-select-danger";
                AppSettings.dataBackgroundColor = "reetrak-bg-danger"; 
                AppSettings.navitem = "nav-pills-warning";               
                break;

            case "rose":
                AppSettings.dataColor = 'rose';
                AppSettings.cardHeaderClass = 'card-header-rose'
                AppSettings.btnClass = "btn-rose";
                AppSettings.btnSm = "btn-sm";
                AppSettings.color = "reetrak-rose";
                AppSettings.pagination = "reetrak-pagination pagination-rose";
                AppSettings.select = "reetrak-select reetrak-select-rose";
                AppSettings.dataBackgroundColor = "reetrak-bg-rose";  
                AppSettings.navitem = "nav-pills-warning";                  
                break;

            case "purple":
                AppSettings.dataColor = 'purple';
                AppSettings.cardHeaderClass = 'card-header-primary';
                AppSettings.btnClass = "btn-primary";
                AppSettings.btnSm = "btn-sm";
                AppSettings.color = "reetrak-primary";
                AppSettings.pagination = "reetrak-pagination pagination-primary";
                AppSettings.select = "reetrak-select reetrak-select-primary";
                AppSettings.dataBackgroundColor = "reetrak-bg-primary";
                AppSettings.navitem = "nav-pills-warning";                            
                break;

            case "azure":
                AppSettings.dataColor = 'azure';
                AppSettings.cardHeaderClass = 'card-header-info';
                AppSettings.btnClass = "btn-info";
                AppSettings.btnSm = "btn-sm";
                AppSettings.color = "reetrak-info";
                AppSettings.pagination = "reetrak-pagination pagination-info";
                AppSettings.select = "reetrak-select reetrak-select-info";
                AppSettings.dataBackgroundColor = "reetrak-bg-info"; 
                AppSettings.navitem = "nav-pills-warning";                                 
                break;

            case "green":
                AppSettings.dataColor = 'green';
                AppSettings.cardHeaderClass = 'card-header-success';
                AppSettings.btnClass = "btn-success";
                AppSettings.btnSm = "btn-sm";
                AppSettings.color = "reetrak-success";
                AppSettings.pagination = "reetrak-pagination pagination-success";
                AppSettings.select = "reetrak-select reetrak-select-success";
                AppSettings.dataBackgroundColor = "reetrak-bg-success";  
                AppSettings.navitem = "nav-pills-warning";                  
                break;

            case "orange":
                AppSettings.dataColor = 'orange';
                AppSettings.cardHeaderClass = 'card-header-warning';
                AppSettings.btnClass = "btn-warning";
                AppSettings.btnSm = "btn-sm";
                AppSettings.color = "reetrak-warning";
                AppSettings.pagination = "reetrak-pagination pagination-warning";
                AppSettings.select = "reetrak-select reetrak-select-warning";
                AppSettings.dataBackgroundColor = "reetrak-bg-warning";  
                AppSettings.navitem = "nav-pills-warning";                    
                break;

            default:
                break;
        }

    }

}
