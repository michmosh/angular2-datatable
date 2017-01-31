import { Injectable } from '@angular/core';
import { Http ,RequestOptions } from '@angular/http';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class TableService {

 private dataUrl = 'http://dev.sendajob.local/ajax.php?page=angular_test';
	private headers = new Headers({ 'Content-Type': 'application/json' ,'Access-Control-Allow-Origin':"*"});
	private options = new RequestOptions({headers : this.headers});
	private response:Response ; 
	private data:any;

	constructor(
		private http: Http
	){ 
		
	}

    getData(): Observable<any>{
    	return this.http.get(this.dataUrl)
            			.map(this.extractData)
                		.catch(this.handleError);
  	}

	private extractData(res: Response) {
	    let body = res.json();
	     body.keys = Object.keys(body[0]);
	    return body ;
	}

	private handleError(error:any): Promise<any>{
		console.error('An error occurred', error); // for demo purposes only
    	return Promise.reject(error.message || error);
	}

	// getHeroesSlowly(): Promise<any[]> {
	// 	return new Promise(resolve => {
	// 		setTimeout(() => resolve(this.getData()),2000);
	// 	});
	// }

	// // getOneHero(id: number): Promise<any>{

	// // 	let url = `${this.dataUrl}/${id}`;
	// // 	return this.http.get(url).
	// // 		toPromise()
	// // 			.then(response => response.json().data as hero)
	// // 				.catch(this.handleError);
	// // }

	// update(hero:any):Promise<any>{
	// 	let url = `${this.dataUrl}/${hero.id}`;
	// 	return this.http.put(url , JSON.stringify(hero) , {headers:this.headers}).toPromise().then(()=> hero ).catch(this.handleError);
	// }

	// addNew(name:string):Promise<any>{
	// 	return this.http.post(this.dataUrl ,  JSON.stringify({name:name}) , {headers:this.headers}) 
	// 		.toPromise()
 //    			.then(res => res.json().data)
 //    				.catch(this.handleError);
	// }

	// heroDelete(id:number):Promise<void>{
	// 	let url = `${this.dataUrl}&id=${id}&action=delete`;
	// 	return this.http.delete(url,{headers:this.headers})
	// 			.toPromise()
	// 				.then(()=>{
	// 					this.getData();
	// 				}).catch(this.handleError); 
	// }

}
