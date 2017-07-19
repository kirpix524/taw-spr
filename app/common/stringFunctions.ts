import { piece } from "./piece"

  export function formatDate(date: Date, format: String): string {
    // if (!(date.hasOwnProperty("getDate"))) return date.toString()
    let strDate: string = "";
    if (!(date.hasOwnProperty("getDate"))) {
      strDate=date.toString();
      if (strDate=="") return strDate
      if ((piece(strDate,".",1)!='') && (piece(strDate,".",2)!='') && (piece(strDate,".",3)!='')) {
        date = new Date(""+piece(strDate,".",2)+"-"+piece(strDate,".",1)+"-"+piece(strDate,".",3));
      } else {
        date = new Date(date);
      }
    }
    format = format || "dd.mm.yy";
    let dd: number
    let strdd: string
    let mm: number
    let strmm: string
    let yy: number
    let stryy: string
    try {
      dd = date.getDate();
      strdd = '' + dd;
      if (dd < 10) strdd = '0' + dd;

      mm = date.getMonth() + 1;
      strmm = '' + mm;
      if (mm < 10) strmm = '0' + mm;

      yy = date.getFullYear();
      stryy = '' + yy;
    } catch(err) {
      console.dir(err);
      return date.toString();
    }

    if (format == "dd.mm.yy") {
      yy = yy % 100;
      if (yy < 10) stryy = '0' + yy;
      return strdd + '.' + strmm + '.' + stryy;
    } else if (format == "yyyy-mm-dd") {
      return stryy + '-' + strmm + '-' + strdd;
    } else if (format == "dd.mm.yyyy") {
      return strdd + '.' + strmm + '.' + stryy;
    }
    return "";

  }