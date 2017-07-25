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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var RestService = (function () {
    function RestService(http) {
        this.http = http;
    }
    //Справочник должностей
    RestService.prototype.loadSprDolgn = function (serverURL) {
        var body = "";
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/getSprDolgn", body, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    RestService.prototype.saveDolgn = function (serverURL, config) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/saveDolgn", config, { headers: headers }).toPromise()
            .then(function (res) { console.log(res); return res.json(); })
            .catch(function (err) { return err; });
    };
    //Справочник сотрудников
    RestService.prototype.loadSprSotr = function (serverURL) {
        var body = "";
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/getSprSotr", body, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    RestService.prototype.saveSotr = function (serverURL, config) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/saveSotr", config, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    //Справочник складов
    RestService.prototype.loadSprSkl = function (serverURL) {
        var body = "";
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/getSprSkl", body, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    RestService.prototype.saveSkl = function (serverURL, config) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/saveSkl", config, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    //Справочник операций
    RestService.prototype.loadSprOper = function (serverURL) {
        var body = "";
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/getSprOper", body, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    RestService.prototype.saveOper = function (serverURL, config) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/saveOper", config, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    //Справочник едениц измерения
    RestService.prototype.loadSprEdizm = function (serverURL) {
        var body = "";
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/getSprEdizm", body, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    RestService.prototype.saveEdizm = function (serverURL, config) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/saveEdizm", config, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    //Справочник должностей
    RestService.prototype.loadSprNomen = function (serverURL) {
        var body = "";
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/getSprNomen", body, { headers: headers }).toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (err) { return err; });
    };
    RestService.prototype.saveNomen = function (serverURL, config) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL + "/saveNomen", config, { headers: headers }).toPromise()
            .then(function (res) { console.log(res); return res.json(); })
            .catch(function (err) { return err; });
    };
    return RestService;
}());
RestService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], RestService);
exports.RestService = RestService;
//# sourceMappingURL=Rest.service.js.map