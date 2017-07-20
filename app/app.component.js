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
var AppComponent = (function () {
    function AppComponent(rest) {
        this.rest = rest;
        this.appName = 'Справочники v.1.0.0';
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
    }
    AppComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit");
        this.msgs = [];
        this.serverURL = "http://127.0.0.1:8888";
        this.sprDolgn = [];
        this.sprDolgnTab = [];
        this.curDolgn = {};
        this.roles = [];
        this.displayDialogDolgn = false;
        this.dialogDolgnMode = "new";
        this.headerDolgn = "";
        this.flActualDolgn = true;
        this.loadSpr();
    };
    AppComponent.prototype.loadSpr = function () {
        var _this = this;
        this.rest.loadSprDolgn(this.serverURL).then(function (res) {
            _this.sprDolgn = res.sprDolgn;
            _this.sprDolgnTab = _this.getSprDolgnTab(_this.sprDolgn, _this.flActualDolgn);
            _this.roles = [];
            for (var i = 0; i < res.sprRoles.length; i++) {
                _this.roles.push({ label: res.sprRoles[i].name_role, value: res.sprRoles[i].id_role });
            }
        }).catch(function (err) {
            _this.msgs.push("Ошибка при загрузке спр должностей: " + err.message);
        });
    };
    //Справочник должностей
    AppComponent.prototype.getSprDolgnTab = function (sprDolgn, flActual) {
        var sprDolgnTab;
        sprDolgnTab = [];
        for (var i = 0; i < sprDolgn.length; i++) {
            if (flActual) {
                if (sprDolgn[i].actual == 'Y') {
                    sprDolgnTab.push(sprDolgn[i]);
                }
            }
            else {
                sprDolgnTab.push(sprDolgn[i]);
            }
        }
        return sprDolgnTab;
    };
    AppComponent.prototype.onDolgnRowSelect = function (event) {
        this.curDolgn = this.cloneObj(event.data);
        this.dialogDolgnMode = "edit";
        this.headerDolgn = "Изменить должность";
        this.displayDialogDolgn = true;
    };
    AppComponent.prototype.SaveDolgn = function () {
        var _this = this;
        var config = { 'dolgn': this.curDolgn, 'mode': this.dialogDolgnMode };
        this.rest.saveDolgn(this.serverURL, config).then(function (res) {
            if (res.id_dolgn) {
                _this.curDolgn.id_dolgn = res.id_dolgn;
            }
            _this.sprDolgn = _this.updateDolgn(_this.sprDolgn, _this.curDolgn);
            _this.sprDolgnTab = _this.getSprDolgnTab(_this.sprDolgn, _this.flActualDolgn);
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
    //Прочие функции
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