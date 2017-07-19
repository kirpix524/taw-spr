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
    }
    AppComponent.prototype.ngOnInit = function () {
        this.msgs = [];
        this.serverURL = "http://127.0.0.1:8888/";
    };
    AppComponent.prototype.loadSpr = function () {
        var _this = this;
        this.rest.loadSprDol(this.serverURL).then(function (res) {
            _this.sprDolgn = res;
            console.log('sprDolgn:');
            console.dir(res);
        });
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