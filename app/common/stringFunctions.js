"use strict";
var piece_1 = require("./piece");
function formatDate(date, format) {
    // if (!(date.hasOwnProperty("getDate"))) return date.toString()
    var strDate = "";
    if (!(date.hasOwnProperty("getDate"))) {
        strDate = date.toString();
        if (strDate == "")
            return strDate;
        if ((piece_1.piece(strDate, ".", 1) != '') && (piece_1.piece(strDate, ".", 2) != '') && (piece_1.piece(strDate, ".", 3) != '')) {
            date = new Date("" + piece_1.piece(strDate, ".", 2) + "-" + piece_1.piece(strDate, ".", 1) + "-" + piece_1.piece(strDate, ".", 3));
        }
        else {
            date = new Date(date);
        }
    }
    format = format || "dd.mm.yy";
    var dd;
    var strdd;
    var mm;
    var strmm;
    var yy;
    var stryy;
    try {
        dd = date.getDate();
        strdd = '' + dd;
        if (dd < 10)
            strdd = '0' + dd;
        mm = date.getMonth() + 1;
        strmm = '' + mm;
        if (mm < 10)
            strmm = '0' + mm;
        yy = date.getFullYear();
        stryy = '' + yy;
    }
    catch (err) {
        console.dir(err);
        return date.toString();
    }
    if (format == "dd.mm.yy") {
        yy = yy % 100;
        if (yy < 10)
            stryy = '0' + yy;
        return strdd + '.' + strmm + '.' + stryy;
    }
    else if (format == "yyyy-mm-dd") {
        return stryy + '-' + strmm + '-' + strdd;
    }
    else if (format == "dd.mm.yyyy") {
        return strdd + '.' + strmm + '.' + stryy;
    }
    return "";
}
exports.formatDate = formatDate;
//# sourceMappingURL=stringFunctions.js.map