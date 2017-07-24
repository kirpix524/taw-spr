"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
// сервисы
var Rest_service_1 = require("./services/Rest.service");
var stringFunctions_1 = require("./common/stringFunctions");
var AppComponent = (function () {
    function AppComponent(rest) {
        this.rest = rest;
        this.appName = 'Справочники v.1.0.0';
        this.formatDateLoc = stringFunctions_1.formatDate;
        this.ru = {
            firstDayOfWeek: 1,
            dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            dayNamesShort: ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            dayNamesMin: ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
        };
        this.optionsYesNo = [
            { label: 'Да', value: 'Y' },
            { label: 'Нет', value: 'N' }
        ];
        this.optionsWorkFire = [
            { label: 'Работающий', value: 'W' },
            { label: 'Уволенный', value: 'F' }
        ];
    }
    AppComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit");
        this.msgs = [];
        this.serverURL = "http://127.0.0.1:8888";
        this.init();
        this.loadSpr();
    };
    AppComponent.prototype.loadSpr = function () {
        var _this = this;
        this.rest.loadSprDolgn(this.serverURL).then(function (res) {
            _this.sprDolgn = res.sprDolgn;
            _this.reloadSprDolgnTab();
            _this.reloadOptionsDolgn();
            _this.optionsRoles = [];
            for (var i = 0; i < res.sprRoles.length; i++) {
                _this.optionsRoles.push({ label: res.sprRoles[i].name_role, value: res.sprRoles[i].id_role });
            }
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка при загрузке спр. должностей',
                detail: "" + err
            });
        });
        this.rest.loadSprSotr(this.serverURL).then(function (res) {
            _this.sprSotr = res.sprSotr;
            _this.reloadSprSotrTab();
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка при загрузке спр. сотрудников',
                detail: "" + err
            });
        });
        this.rest.loadSprSkl(this.serverURL).then(function (res) {
            _this.sprSkl = res.sprSkl;
            _this.reloadSprSklTab();
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка при загрузке спр. складов',
                detail: "" + err
            });
        });
        this.rest.loadSprOper(this.serverURL).then(function (res) {
            _this.sprOper = res.sprOper;
            _this.reloadSprOperTab();
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка при загрузке спр. операций',
                detail: "" + err
            });
        });
    };
    //Справочник должностей
    AppComponent.prototype.reloadSprDolgnTab = function () {
        this.sprDolgnTab = [];
        for (var i = 0; i < this.sprDolgn.length; i++) {
            if (!this.showNotActualDolgn) {
                if (this.sprDolgn[i].actual == 'Y') {
                    this.sprDolgnTab.push(this.sprDolgn[i]);
                }
            }
            else {
                this.sprDolgnTab.push(this.sprDolgn[i]);
            }
        }
        return;
    };
    AppComponent.prototype.onDolgnRowSelect = function (event) {
        this.curDolgn = this.cloneObj(event.data);
        this.dialogDolgnMode = "edit";
        this.headerDolgn = "Изменить должность";
        this.displayDialogDolgn = true;
    };
    AppComponent.prototype.addDolgn = function () {
        this.curDolgn = {
            'name_dolgn': '',
            'id_role': this.optionsRoles[0].value,
            'actual': this.optionsYesNo[0].value
        };
        this.dialogDolgnMode = "new";
        this.headerDolgn = "Добавить новую должность";
        this.displayDialogDolgn = true;
    };
    AppComponent.prototype.canSaveDolgn = function (dolgn) {
        if (dolgn.actual != 'Y') {
            for (var i = 0; i < this.sprSotr.length; i++) {
                if (this.sprSotr[i].status == 'W') {
                    if (stringFunctions_1.CNum(this.sprSotr[i].id_dolgn) == stringFunctions_1.CNum(dolgn.id_dolgn)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    AppComponent.prototype.saveDolgn = function () {
        var _this = this;
        if (this.dialogDolgnMode == 'edit') {
            if (!this.canSaveDolgn(this.curDolgn)) {
                this.msgs.push({
                    severity: 'warn',
                    summary: 'Предупреждение!',
                    detail: 'Нельзя сделать должность неактуальной, есть работающие сотрудники!'
                });
                return;
            }
        }
        var config = { 'dolgn': this.curDolgn, 'mode': this.dialogDolgnMode };
        this.rest.saveDolgn(this.serverURL, config).then(function (res) {
            if (res.id_dolgn) {
                _this.curDolgn.id_dolgn = res.id_dolgn;
            }
            _this.sprDolgn = _this.updateDolgn(_this.sprDolgn, _this.curDolgn);
            _this.reloadSprDolgnTab();
            _this.reloadOptionsDolgn();
            _this.displayDialogDolgn = false;
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка!',
                detail: "" + err
            });
        });
    };
    AppComponent.prototype.updateDolgn = function (sprDolgn, updatedDolgn) {
        for (var i = 0; i < sprDolgn.length; i++) {
            if (sprDolgn[i].id_dolgn == updatedDolgn.id_dolgn) {
                for (var key in updatedDolgn) {
                    sprDolgn[i][key] = updatedDolgn[key];
                }
                return sprDolgn;
            }
        }
        //Если не нашли - значит добавим новую
        sprDolgn.push(updatedDolgn);
        return sprDolgn;
    };
    AppComponent.prototype.getRoleName = function (id_role) {
        for (var i = 0; i < this.optionsRoles.length; i++) {
            if (stringFunctions_1.CNum(this.optionsRoles[i].value) == stringFunctions_1.CNum(id_role)) {
                return this.optionsRoles[i].label;
            }
        }
        return '';
    };
    AppComponent.prototype.reloadOptionsDolgn = function () {
        this.optionsDolgn = [];
        for (var i = 0; i < this.sprDolgn.length; i++) {
            if (this.sprDolgn[i].actual == 'Y') {
                this.optionsDolgn.push({ 'label': this.sprDolgn[i].name_dolgn, 'value': this.sprDolgn[i].id_dolgn });
            }
        }
    };
    AppComponent.prototype.getDolgnName = function (id_dolgn) {
        for (var i = 0; i < this.optionsDolgn.length; i++) {
            if (stringFunctions_1.CNum(this.optionsDolgn[i].value) == stringFunctions_1.CNum(id_dolgn)) {
                return this.optionsDolgn[i].label;
            }
        }
        return '';
    };
    //Справочник сотрудников
    AppComponent.prototype.reloadSprSotrTab = function () {
        this.sprSotrTab = [];
        for (var i = 0; i < this.sprSotr.length; i++) {
            if (!this.showNotActualSotr) {
                if (this.sprSotr[i].status == 'W') {
                    this.sprSotrTab.push(this.sprSotr[i]);
                }
            }
            else {
                this.sprSotrTab.push(this.sprSotr[i]);
            }
        }
    };
    AppComponent.prototype.onSotrRowSelect = function (event) {
        this.curSotr = this.cloneObj(event.data);
        this.dialogSotrMode = "edit";
        this.headerSotr = "Изменить данные сотрудника";
        this.displayDialogSotr = true;
    };
    AppComponent.prototype.addSotr = function () {
        this.curSotr = {
            'name_sotr': '',
            'birth': '',
            'phone': '',
            'id_dolgn': this.optionsDolgn[0].value,
            'name_dolgn': this.optionsDolgn[0].label,
            'status': this.optionsWorkFire[0].value
        };
        this.dialogSotrMode = "new";
        this.headerSotr = "Добавить нового сотрудника";
        this.displayDialogSotr = true;
    };
    AppComponent.prototype.saveSotr = function () {
        var _this = this;
        var config = { 'sotr': this.curSotr, 'mode': this.dialogSotrMode };
        config.sotr.birth = stringFunctions_1.formatDate(config.sotr.birth, "yyyy-mm-dd");
        this.curSotr.birth = stringFunctions_1.formatDate(this.curSotr.birth, "dd.mm.yyyy");
        this.rest.saveSotr(this.serverURL, config).then(function (res) {
            if (res.id_sotr) {
                _this.curSotr.id_sotr = res.id_sotr;
            }
            _this.updateSotr(_this.curSotr);
            _this.reloadSprSotrTab();
            _this.displayDialogSotr = false;
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка!',
                detail: "" + err
            });
        });
    };
    AppComponent.prototype.updateSotr = function (updatedSotr) {
        for (var i = 0; i < this.sprSotr.length; i++) {
            if (this.sprSotr[i].id_sotr == updatedSotr.id_sotr) {
                for (var key in updatedSotr) {
                    this.sprSotr[i][key] = updatedSotr[key];
                }
                return;
            }
        }
        //Если не нашли - значит добавим новую
        this.sprSotr.push(updatedSotr);
        return;
    };
    //Справочник складов
    AppComponent.prototype.reloadSprSklTab = function () {
        this.sprSklTab = [];
        for (var i = 0; i < this.sprSkl.length; i++) {
            if (!this.showNotActualSkl) {
                if (this.sprSkl[i].actual == 'Y') {
                    this.sprSklTab.push(this.sprSkl[i]);
                }
            }
            else {
                this.sprSklTab.push(this.sprSkl[i]);
            }
        }
        return;
    };
    AppComponent.prototype.onSklRowSelect = function (event) {
        this.curSkl = this.cloneObj(event.data);
        this.dialogSklMode = "edit";
        this.headerSkl = "Изменить склад";
        this.displayDialogSkl = true;
    };
    AppComponent.prototype.addSkl = function () {
        this.curSkl = {
            'name_skl': '',
            'actual': this.optionsYesNo[0].value
        };
        this.dialogSklMode = "new";
        this.headerSkl = "Добавить новый склад";
        this.displayDialogSkl = true;
    };
    AppComponent.prototype.saveSkl = function () {
        var _this = this;
        var config = { 'skl': this.curSkl, 'mode': this.dialogSklMode };
        this.rest.saveSkl(this.serverURL, config).then(function (res) {
            if (res.id_skl) {
                _this.curSkl.id_skl = res.id_skl;
            }
            _this.updateSkl(_this.curSkl);
            _this.reloadSprSklTab();
            _this.displayDialogSkl = false;
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка!',
                detail: "" + err
            });
        });
    };
    AppComponent.prototype.updateSkl = function (updatedSkl) {
        for (var i = 0; i < this.sprSkl.length; i++) {
            if (this.sprSkl[i].id_skl == updatedSkl.id_skl) {
                for (var key in updatedSkl) {
                    this.sprSkl[i][key] = updatedSkl[key];
                }
                return;
            }
        }
        //Если не нашли - значит добавим новый
        this.sprSkl.push(updatedSkl);
        return;
    };
    //Справочник операций
    AppComponent.prototype.reloadSprOperTab = function () {
        this.sprOperTab = [];
        for (var i = 0; i < this.sprOper.length; i++) {
            if (!this.showNotActualOper) {
                if (this.sprOper[i].actual == 'Y') {
                    this.sprOperTab.push(this.sprOper[i]);
                }
            }
            else {
                this.sprOperTab.push(this.sprOper[i]);
            }
        }
        return;
    };
    AppComponent.prototype.onOperRowSelect = function (event) {
        this.curOper = this.cloneObj(event.data);
        this.dialogOperMode = "edit";
        this.headerOper = "Изменить склад";
        this.displayDialogOper = true;
    };
    AppComponent.prototype.addOper = function () {
        this.curOper = {
            'name_oper': '',
            'need_kk': this.optionsYesNo[1].value,
            'actual': this.optionsYesNo[0].value
        };
        this.dialogOperMode = "new";
        this.headerOper = "Добавить новый склад";
        this.displayDialogOper = true;
    };
    AppComponent.prototype.saveOper = function () {
        var _this = this;
        var config = { 'oper': this.curOper, 'mode': this.dialogOperMode };
        this.rest.saveOper(this.serverURL, config).then(function (res) {
            if (res.id_oper) {
                _this.curOper.id_oper = res.id_oper;
            }
            _this.updateOper(_this.curOper);
            _this.reloadSprOperTab();
            _this.displayDialogOper = false;
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка!',
                detail: "" + err
            });
        });
    };
    AppComponent.prototype.updateOper = function (updatedOper) {
        for (var i = 0; i < this.sprOper.length; i++) {
            if (this.sprOper[i].id_oper == updatedOper.id_oper) {
                for (var key in updatedOper) {
                    this.sprOper[i][key] = updatedOper[key];
                }
                return;
            }
        }
        //Если не нашли - значит добавим новый
        this.sprOper.push(updatedOper);
        return;
    };
    //Прочие функции
    AppComponent.prototype.init = function () {
        //Справочник должностей
        this.sprDolgn = [];
        this.sprDolgnTab = [];
        this.curDolgn = {};
        this.optionsRoles = [];
        this.displayDialogDolgn = false;
        this.dialogDolgnMode = "new";
        this.headerDolgn = "";
        this.showNotActualDolgn = false;
        //Справочник сотрудников
        this.sprSotr = [];
        this.sprSotrTab = [];
        this.curSotr = {};
        this.optionsDolgn = [];
        this.displayDialogSotr = false;
        this.dialogSotrMode = "new";
        this.headerSotr = "";
        this.showNotActualSotr = false;
        //Справочник складов
        this.sprSkl = [];
        this.sprSklTab = [];
        this.curSkl = {};
        this.displayDialogSkl = false;
        this.dialogSklMode = "new";
        this.headerSkl = "";
        this.showNotActualSkl = false;
        //Справочник операций
        this.sprOper = [];
        this.sprOperTab = [];
        this.curOper = {};
        this.displayDialogOper = false;
        this.dialogOperMode = "new";
        this.headerOper = "";
        this.showNotActualOper = false;
    };
    AppComponent.prototype.getParName = function (par) {
        switch (par) {
            case 'Y':
                return 'Да';
            case 'N':
                return 'Нет';
            case 'P':
                return 'Приход';
            case 'R':
                return 'Расход';
            case 'S':
                return 'Начало';
            case 'E':
                return 'Окончание';
            case 'W':
                return 'Работающий';
            case 'F':
                return 'Уволенный';
            default:
                return par;
        }
    };
    AppComponent.prototype.cloneObj = function (obj) {
        var newObj = {};
        for (var key in obj) {
            newObj[key] = obj[key];
        }
        return newObj;
    };
    AppComponent.prototype.ngAfterViewInit = function () { };
    AppComponent.prototype.blockUI = function () { this.blockedDocument = true; };
    AppComponent.prototype.unblockUI = function () { this.blockedDocument = false; };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: './app/app.component.html',
        styles: [""],
        entryComponents: [],
        providers: [Rest_service_1.RestService],
    }),
    __metadata("design:paramtypes", [Rest_service_1.RestService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map