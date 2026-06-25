
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import * as _moment from 'moment';

declare const $: any;

@Injectable()
export class CommonService {

  private appConfig: Map<string, string> = new Map();
  private specialCharacter: Map<string, string> = new Map();
  private errorMessage: Map<String, String> = new Map();
  private routes: any[];
  private commonData: Map<string, any> = new Map();
  remarkFlag = false;
  hierarchyFlag = false;
  private licenseDetails: string = "NA";

  constructor() {
    this.errorMessage.set("min", "Please enter minimum $1 chacchter");
    this.errorMessage.set("max", "Please enter maximum $1 chacchter");
    this.errorMessage.set("regex", "Please enter valid $1 chacchter");
    this.routes = [];
  }
  getCommonData(key: string): any {
    return this.commonData[key];
  }

  getAppConfig(key: string): string {
    return this.appConfig[key];
  }

  getSpecialCharacter(key: string): String {
    return this.specialCharacter[key];
  }



  userRemarks(): boolean {
    return this.remarkFlag;
  }

  isHierarchy(): boolean {
    return this.hierarchyFlag;
  }

  setRoutes(routes: any[]) {
    this.routes = routes;
  }

  getRoutes(): any[] {
    return this.routes;
  }

  // dataTableIntialize(id: string): DataTables.Api {
  //   let lang = this.translate.currentLang;
  //   $('#' + id).DataTable({
  //     "pagingType": "full_numbers",
  //     "lengthMenu": [
  //       [10, 25, 50, -1],
  //       [10, 25, 50, "All"]
  //     ],
  //     responsive: false,
  //     language: {
  //       search: "_INPUT_",
  //       // searchPlaceholder: "Search records",
  //       url: "/assets/i18n/datatable/" + lang + ".json"
  //     },
  //     destroy: true
  //   });

  //   return $('#' + id).DataTable();
  // }

  // dataTableDestroy(table: DataTables.Api) {
  //   table.clear();
  //   table.destroy();
  // }



  validateGTIN(gtin: number): boolean {

    let str = gtin + ""/**  Number(gtin).toString() */;
    if (str.length == 0 || str == "0" || gtin == undefined || str.length != 14)
      return false;
    let sum = 0;
    let checkDigit = 0;
    let higherMultiPleOf10;
    let multipler1 = str.length % 2 == 0 ? 3 : 1;
    let multipler2 = str.length % 2 == 0 ? 1 : 3;
    for (let index = 0; index < str.length - 1; index++) {
      if (index % 2 == 0)
        sum += Number(str.charAt(index)) * multipler1;
      else
        sum += Number(str.charAt(index)) * multipler2;
    }

    higherMultiPleOf10 = sum;

    checkDigit += Number(str.charAt(str.length - 1));

    for (let index = 0; index < 11; index++) {
      if (higherMultiPleOf10 % 10 == 0)
        break;

      higherMultiPleOf10++;
    }


    if (checkDigit == higherMultiPleOf10 - sum)
      return true;

    return false;
  }

  dialogZIndexAdjustment() {
    $(".cdk-overlay-backdrop").removeAttr('style').css("z-index", "900");
    $(".cdk-overlay-container").removeAttr('style').css("z-index", "1030");
    // $(".cdk-global-overlay-wrapper").removeAttr('style').css("z-index", "1035");
    // $(".cdk-overlay-pane").removeAttr('style').css("z-index", "1050");

  }

  customScroller(options, selector?: string) {
    const elemMainPanel = <HTMLElement>document.querySelector(selector ? selector : '.custom-scroll');
  }

  formDirty(formGroup: FormGroup) {
    formGroup.updateValueAndValidity({ onlySelf: true });
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.formDirty(control);
      } else if (control instanceof FormArray) {
        this.formArrayDirty((control as FormArray));
      } else {
        // console.log("check here");
      }
    });
  }

  formArrayDirty(formArray: FormArray) {
    Object.keys(formArray.controls).forEach(field => {
      const control = formArray.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.formDirty(control);
      } else if (control instanceof FormArray) {
        this.formArrayDirty((control as FormArray));
      } else {
        // console.log("check here");
      }
    });
  }

  formReValidate(formGroup: FormGroup) {
    formGroup.updateValueAndValidity({ onlySelf: true });
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.setValue(formGroup.getRawValue()[field]);
      } else if (control instanceof FormGroup) {
        this.formReValidate(control);
      } else if (control instanceof FormArray) {
        this.formArrayReValidate((control as FormArray));
      } else {
        // console.log("check here");
      }
    });
  }

  formArrayReValidate(formArray: FormArray) {
    Object.keys(formArray.controls).forEach(field => {
      const control = formArray.get(field);
      if (control instanceof FormControl) {
        control.setValue(formArray.getRawValue()[field]);
      } else if (control instanceof FormGroup) {
        this.formReValidate(control);
      } else if (control instanceof FormArray) {
        this.formArrayReValidate((control as FormArray));
      } else {
        // console.log("check here");
      }
    });
  }

  formInValidFocus(formGroup: FormGroup) {
    let keys = Object.keys(formGroup.controls);
    for (let index = 0; index < keys.length; index++) {
      let field = keys[index];
      const control = formGroup.get(field);
      if (control instanceof FormControl && control.invalid) {
        this.focusToField('#' + field);
        return;
      } else if (control instanceof FormGroup) {
        this.formInValidFocus(control);
      } else if (control instanceof FormArray) {
        this.formArrayInValidFocus((control as FormArray));
      } else {
        // console.log("check here");
      }
    }

  }

  formArrayInValidFocus(formArray: FormArray) {
    let keys = Object.keys(formArray.controls);
    for (let index = 0; index < keys.length; index++) {
      let field = keys[index];
      const control = formArray.get(field);
      if (control instanceof FormControl && control.invalid) {
        this.focusToField('#' + field);
        return;
      } else if (control instanceof FormGroup) {
        this.formInValidFocus(control);
      } else if (control instanceof FormArray) {
        this.formArrayInValidFocus((control as FormArray));
      } else {
        // console.log("check here");
      }
    }
  }

  focusToField(selector: string) {
    let target, offset = 0;
    target = $(selector);
    offset = $(target).parent().parent().parent().parent().offset().top - $(".custom-scroll").offset().top;

    // console.log("selector-: " + selector + "   offset " + offset);
    if (target) {
      $('.custom-scroll').animate({ scrollTop: offset }, 'slow', () => { target.focus() });
    }
  }




  getBrowserVersion() {

    var userAgent = navigator.userAgent, tem,

      matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(matchTest[1])) {

      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

      return 'IE ' + (tem[1] || '');

    }

    if (matchTest[1] === 'Chrome') {

      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);

      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');

    }

    matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);

    return matchTest.join(' ');

  }

  setLicenseDetails(licenseDetails: string): void {
    this.licenseDetails = licenseDetails;
  }

  getLicenseDetails(): string {
    return this.licenseDetails;
  }



}

