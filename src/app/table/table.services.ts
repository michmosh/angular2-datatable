import { Injectable } from '@angular/core';
import { Http ,RequestOptions } from '@angular/http';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';


declare var DT:any;
@Injectable()
export class TableService {

 	public dataUrl = 'http://dev.sendajob.local/ajax.php?page=angular_test';
	public headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded '});
	public options = new RequestOptions({headers : this.headers , method:"POST"});
	public response:Response ; 
	public data:any;
	public size:number;
	public buttons:Array<any>;
	public size_options:Array<Number>;
	public filters:Array<any>;
	public ajax:boolean;
	public limit:any;
	public sortOrder:any;
	public order_by:any;


	constructor(
		private http: Http
	){ 
		this.sortOrder = "ASC";
        this.order_by = "id";
        this.dataUrl = DT.url;
        this.ajax = DT.ajax;
        this.size = DT.size;
        this.limit = " 0 ," + this.size;
        this.buttons = DT.buttons;
        this.size_options = DT.size_options;
        this.filters = DT.filters;
	}

    getData(): Observable<any>{
    	 if (this.ajax == true) {
            let params = {
                'size': this.size,
                'ASC': this.sortOrder,
                'paging': true,
                'limit': this.limit,
                'order_by': this.order_by
            };
            params = this.getFiltersParams(params);
            return this.http.post(this.dataUrl, this.getParamString(params), { headers: this.headers })
                .map(this.extractData)
                .catch(this.handleError);
        }
        else {
            let params = {
                'size': this.size,
                'ASC': this.sortOrder,
                'paging': true,
                'limit': ''
            };
            params = this.getFiltersParams(params);
            return this.http.post(this.dataUrl, this.getParamString(params), { headers: this.headers })
                .map(this.extractData)
                .catch(this.handleError);
        }
  	}

	private extractData(res: Response) {
	    let body = res.json();
	     body.keys = Object.keys(body.data[0]);
	    return body ;
	}

	private handleError(error:any): Promise<any>{
		console.error('An error occurred', error); // for demo purposes only
    	return Promise.reject(error.message || error);
	}

	getFiltersParams(params) {
        DT.getFiltersValues();
        for (var i = 0; i < DT.filters.length; i++) {
            params[DT.filters[i].name] = DT.filters[i].value;
        }
        return params;
    }

    sorting(column) {
        var asc = this.sortOrder == "ASC" ? "DESC" : "ASC";
        this.order_by = column.name;
        this.limit = " 0 ," + this.size;
        this.sortOrder = asc;
        var params = {
            'size': this.size,
            'ASC': this.sortOrder,
            'paging': true,
            'limit': this.limit,
            'order_by': this.order_by
        };
        params = this.getFiltersParams(params);
        return this.http.post(this.dataUrl, this.getParamString(params), { headers: this.headers })
            .map(this.extractData)
            .catch(this.handleError);
    }


	getSearch(value:string): Observable<any>{
        var params = { 'str': value };
        return this.http.post(this.dataUrl, this.getParamString(params), { headers: this.headers })
            .map(this.extractData)
            .catch(this.handleError);
	}

	getParamString(object) {
        var encodedString = '';
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + object[prop]);
            }
        }
        return encodedString;
    }

	
}
