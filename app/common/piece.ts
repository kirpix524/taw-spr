export function piece(str, delemiter, field) {
    if (str == undefined) return '';
    var array = str.split(delemiter);
    if (field < 1 || field > array.length) return '';
    return array[field - 1];
}