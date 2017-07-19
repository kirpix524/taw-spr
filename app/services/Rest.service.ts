import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Dolgn } from '../models/Dolgn.model';
import { formatDate } from '../common/stringFunctions';

@Injectable()
export class RestService {

    constructor(private http: Http) { }

    loadSprDol(serverURL: string) {
        const body = "";
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });

        return this.http.post(serverURL+"/getSprDol", body, { headers: headers }).toPromise()
            .then(res => { return res.json() })
            .catch(err => { return err });
    }

}