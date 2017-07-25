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
        this.loadSprDolgn();
        this.loadSprSotr();
        this.loadSprSkl();
        this.loadSprOper();
        this.loadSprEdizm();
        this.loadSprNomen();
    };
    //Справочник должностей
    AppComponent.prototype.loadSprDolgn = function () {
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
    };
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
            _this.updateDolgn(_this.curDolgn);
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
    AppComponent.prototype.updateDolgn = function (updatedDolgn) {
        for (var i = 0; i < this.sprDolgn.length; i++) {
            if (this.sprDolgn[i].id_dolgn == updatedDolgn.id_dolgn) {
                for (var key in updatedDolgn) {
                    this.sprDolgn[i][key] = updatedDolgn[key];
                }
                return;
            }
        }
        //Если не нашли - значит добавим новую
        this.sprDolgn.push(updatedDolgn);
        return;
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
    AppComponent.prototype.loadSprSotr = function () {
        var _this = this;
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
    };
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
    AppComponent.prototype.loadSprSkl = function () {
        var _this = this;
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
    };
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
    AppComponent.prototype.loadSprOper = function () {
        var _this = this;
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
    //Справочник едениц измерения
    AppComponent.prototype.loadSprEdizm = function () {
        var _this = this;
        this.rest.loadSprEdizm(this.serverURL).then(function (res) {
            _this.sprEdizm = res.sprEdizm;
            _this.reloadSprEdizmTab();
            _this.reloadOptionsEdizm();
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка при загрузке спр. должностей',
                detail: "" + err
            });
        });
    };
    AppComponent.prototype.reloadSprEdizmTab = function () {
        this.sprEdizmTab = [];
        for (var i = 0; i < this.sprEdizm.length; i++) {
            if (!this.showNotActualEdizm) {
                if (this.sprEdizm[i].actual == 'Y') {
                    this.sprEdizmTab.push(this.sprEdizm[i]);
                }
            }
            else {
                this.sprEdizmTab.push(this.sprEdizm[i]);
            }
        }
        return;
    };
    AppComponent.prototype.onEdizmRowSelect = function (event) {
        this.curEdizm = this.cloneObj(event.data);
        this.dialogEdizmMode = "edit";
        this.headerEdizm = "Изменить еденицу измерения";
        this.displayDialogEdizm = true;
    };
    AppComponent.prototype.addEdizm = function () {
        this.curEdizm = {
            'name_edizm': '',
            'actual': this.optionsYesNo[0].value
        };
        this.dialogEdizmMode = "new";
        this.headerEdizm = "Добавить новую еденицу измерения";
        this.displayDialogEdizm = true;
    };
    AppComponent.prototype.canSaveEdizm = function (edizm) {
        if (edizm.actual != 'Y') {
            for (var i = 0; i < this.sprNomen.length; i++) {
                if (this.sprNomen[i].actual == 'Y') {
                    if (stringFunctions_1.CNum(this.sprNomen[i].id_edizm) == stringFunctions_1.CNum(edizm.id_edizm)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    AppComponent.prototype.saveEdizm = function () {
        var _this = this;
        if (this.dialogEdizmMode == 'edit') {
            if (!this.canSaveEdizm(this.curEdizm)) {
                this.msgs.push({
                    severity: 'warn',
                    summary: 'Предупреждение!',
                    detail: 'Нельзя сделать еденицу измерения неактуальной, есть номенклатура с этой еденицей измерения!'
                });
                return;
            }
        }
        var config = { 'edizm': this.curEdizm, 'mode': this.dialogEdizmMode };
        this.rest.saveEdizm(this.serverURL, config).then(function (res) {
            if (res.id_edizm) {
                _this.curEdizm.id_edizm = res.id_edizm;
            }
            _this.updateEdizm(_this.curEdizm);
            _this.reloadSprEdizmTab();
            _this.reloadOptionsEdizm();
            _this.displayDialogEdizm = false;
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка!',
                detail: "" + err
            });
        });
    };
    AppComponent.prototype.updateEdizm = function (updatedEdizm) {
        for (var i = 0; i < this.sprEdizm.length; i++) {
            if (this.sprEdizm[i].id_edizm == updatedEdizm.id_edizm) {
                for (var key in updatedEdizm) {
                    this.sprEdizm[i][key] = updatedEdizm[key];
                }
                return;
            }
        }
        //Если не нашли - значит добавим новую
        this.sprEdizm.push(updatedEdizm);
        return;
    };
    AppComponent.prototype.reloadOptionsEdizm = function () {
        this.optionsEdizm = [];
        for (var i = 0; i < this.sprEdizm.length; i++) {
            if (this.sprEdizm[i].actual == 'Y') {
                this.optionsEdizm.push({ 'label': this.sprEdizm[i].name_edizm, 'value': this.sprEdizm[i].id_edizm });
            }
        }
    };
    AppComponent.prototype.getEdizmName = function (id_edizm) {
        for (var i = 0; i < this.optionsEdizm.length; i++) {
            if (stringFunctions_1.CNum(this.optionsEdizm[i].value) == stringFunctions_1.CNum(id_edizm)) {
                return this.optionsEdizm[i].label;
            }
        }
        return '';
    };
    //Справочник номенклатуры
    AppComponent.prototype.loadSprNomen = function () {
        var _this = this;
        this.rest.loadSprNomen(this.serverURL).then(function (res) {
            _this.sprNomen = res.sprNomen;
            _this.reloadSprNomenTab();
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка при загрузке спр. номенклатуры',
                detail: "" + err
            });
        });
    };
    AppComponent.prototype.reloadSprNomenTab = function () {
        this.sprNomenTab = [];
        for (var i = 0; i < this.sprNomen.length; i++) {
            if (!this.showNotActualNomen) {
                if (this.sprNomen[i].actual == 'Y') {
                    this.sprNomenTab.push(this.sprNomen[i]);
                }
            }
            else {
                this.sprNomenTab.push(this.sprNomen[i]);
            }
        }
        return;
    };
    AppComponent.prototype.onNomenRowSelect = function (event) {
        this.curNomen = this.cloneObj(event.data);
        this.dialogNomenMode = "edit";
        this.headerNomen = "Изменить номенклатуру";
        this.displayDialogNomen = true;
    };
    AppComponent.prototype.addNomen = function () {
        this.curNomen = {
            'name_nomen': '',
            'id_edizm': this.optionsEdizm[0].value,
            'actual': this.optionsYesNo[0].value
        };
        this.dialogNomenMode = "new";
        this.headerNomen = "Добавить новую номенклатуру";
        this.displayDialogNomen = true;
    };
    AppComponent.prototype.canSaveNomen = function (nomen) {
        if (nomen.actual != 'Y') {
        }
        return true;
    };
    AppComponent.prototype.saveNomen = function () {
        var _this = this;
        if (this.dialogNomenMode == 'edit') {
            if (!this.canSaveNomen(this.curNomen)) {
                this.msgs.push({
                    severity: 'warn',
                    summary: 'Предупреждение!',
                    detail: 'Нельзя сделать номенклатуру неактуальной!'
                });
                return;
            }
        }
        var config = { 'nomen': this.curNomen, 'mode': this.dialogNomenMode };
        this.rest.saveNomen(this.serverURL, config).then(function (res) {
            if (res.id_nomen) {
                _this.curNomen.id_nomen = res.id_nomen;
            }
            _this.updateNomen(_this.curNomen);
            _this.reloadSprNomenTab();
            _this.displayDialogNomen = false;
        }).catch(function (err) {
            _this.msgs.push({
                severity: 'error',
                summary: 'Ошибка!',
                detail: "" + err
            });
        });
    };
    AppComponent.prototype.updateNomen = function (updatedNomen) {
        for (var i = 0; i < this.sprNomen.length; i++) {
            if (this.sprNomen[i].id_nomen == updatedNomen.id_nomen) {
                for (var key in updatedNomen) {
                    this.sprNomen[i][key] = updatedNomen[key];
                }
                return;
            }
        }
        //Если не нашли - значит добавим новую
        this.sprNomen.push(updatedNomen);
        return;
    };
    //Прочие функции
    AppComponent.prototype.init = function () {
        //Справочник должностей
        this.sprDolgn = [];
        this.sprDolgnTab = [];
        this.curDolgn = {};
        this.optionsRoles = [];
        this.optionsDolgn = [];
        this.displayDialogDolgn = false;
        this.dialogDolgnMode = "new";
        this.headerDolgn = "";
        this.showNotActualDolgn = false;
        //Справочник сотрудников
        this.sprSotr = [];
        this.sprSotrTab = [];
        this.curSotr = {};
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
        //Справочник едениц измерения
        this.sprEdizm = [];
        this.sprEdizmTab = [];
        this.curEdizm = {};
        this.optionsEdizm = [];
        this.displayDialogEdizm = false;
        this.dialogEdizmMode = "new";
        this.headerEdizm = "";
        this.showNotActualEdizm = false;
        //Справочник номенклатуры
        this.sprNomen = [];
        this.sprNomenTab = [];
        this.curNomen = {};
        this.displayDialogNomen = false;
        this.dialogNomenMode = "new";
        this.headerNomen = "";
        this.showNotActualNomen = false;
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