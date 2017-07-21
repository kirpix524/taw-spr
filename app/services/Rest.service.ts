import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Dolgn } from '../models/Dolgn.model';
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
            .then(res => { console.log(res); return res.json() })
            .catch(err => { return err });
    }
}