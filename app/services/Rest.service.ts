import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { formatDate } from '../common/stringFunctions';

@Injectable()
export class RestService {

    constructor(private http: Http) { }
    //Справочник должностей
    loadSprDolgn(serverURL: string) {
        const body = "";
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/getSprDolgn", body, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    saveDolgn(serverURL: string, config) {
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/saveDolgn", config, { headers: headers }).toPromise()
            .then(res => { console.log(res); return res.json() })
            .catch(err => { return err });
    }
    
    //Справочник сотрудников
    loadSprSotr(serverURL: string) {
        const body = "";
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/getSprSotr", body, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    saveSotr(serverURL: string, config) {
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/saveSotr", config, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    //Справочник складов
    loadSprSkl(serverURL: string) {
        const body = "";
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/getSprSkl", body, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    saveSkl(serverURL: string, config) {
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/saveSkl", config, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    //Справочник операций
    loadSprOper(serverURL: string) {
        const body = "";
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/getSprOper", body, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    saveOper(serverURL: string, config) {
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/saveOper", config, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    //Справочник едениц измерения
    loadSprEdizm(serverURL: string) {
        const body = "";
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/getSprEdizm", body, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    saveEdizm(serverURL: string, config) {
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/saveEdizm", config, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    //Справочник должностей
    loadSprNomen(serverURL: string) {
        const body = "";
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/getSprNomen", body, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

    saveNomen(serverURL: string, config) {
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(serverURL+"/saveNomen", config, { headers: headers }).toPromise()
            .then(res => { console.log(res); return res.json() })
            .catch(err => { return err });
    }
}