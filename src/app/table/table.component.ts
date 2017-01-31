import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NgZone } from '@angular/core';
import { TableService } from './table.services';
import {Router} from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';
import {ApplicationRef} from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],

})
export class TableComponent implements OnInit {
	data:any;
	private selected_user:any;
	count:number;
	columns:Array<any>;
	show_columns:Array<any>; 
	errorMessage:any;
	config:any;
	buttons:Array<any>;
	empty_data :boolean;
	size:number;
	size_options:Array<Number>;
	selected_page:number = 1;
  	selected_button:any;
  	paging_index:number = 0;
  	filters:Array<any>;

  	constructor(
		private tableService: TableService ,
		private router:Router,
		public zone: NgZone, 
		public ref : ChangeDetectorRef,
		public cdr : ApplicationRef
	){

	}

	ngOnInit():void {
		this.getData();
		this.size = this.tableService.size;
		this.buttons = this.tableService.buttons;
		this.size_options = this.tableService.size_options;
		this.filters = this.tableService.filters;
		window['component'] = {component: this, zone: this.zone};
	}
	// function fires up after conet
	ngAfterViewChecked(){
	    // Component views have been checked
	    if(document.getElementsByTagName('table').length != 0){
	    	//  code after table is on dom
	    }
	}

	getData(){
    	return this.tableService.getData()
                     	.subscribe(
	                       data =>{
	                       	this.data = data.data;
	                       	this.columns = data.keys;
	                       	this.config = data.config;
	                		this.count = data.count.qty;
	                       	if(typeof(data) == "string"){
	                       		this.empty_data = true;
	                       	}else{
	                       		this.empty_data = false;
	                       		this.setColumns();
	                       	}
	                     },
                       error =>{
                       	this.errorMessage = <any>error;
                       }); 
  	}

  	setColumns():void{
  		var new_cols : Array<any> = [];
  		var start = 0;
  		for(var i=0;i<this.config.columns.length;i++){	
  			if(this.config.columns[i].visible == true){
  				new_cols.push(this.config.columns[i])
  			}
  		}	
  		this.show_columns = new_cols;
  	}

  	btnCallBack( element:any , data:any){	
  		this.selected_user = this.data[data-1];
  		var callback_params = element.function_params;
  		var params_array = [];
		for(var i=0; i < callback_params.length ; i++){
			params_array.push(this.selected_user[callback_params[i]]); 
		}
  		element.function.apply(this,params_array);
	}

  	onSelect(data:any):void {
  		this.selected_user = this.data[data - 1];
	}

	getSearch(str){
		return this.tableService.getSearch(str)
										.subscribe(
					                       data =>{
					                       	this.data = data.data;
					                       	this.columns = data.keys;
					                       	this.config = data.config;
					                		this.count = data.count.qty;
					                       	if(typeof(data) == "string"){
					                       		this.empty_data = true;
					                       	}else{
					                       		this.empty_data = false;
					                       		this.setColumns();
					                       	}
					                     },
				                       error =>{
				                       	this.errorMessage = <any>error;
				                       }); 
	}

	sorting(column,event){
		if(this.tableService.ajax == true){
			return this.tableService.sorting(column)
										.subscribe(
		                       				data =>{
					                       		this.data = data.data;
					                       		this.selected_page = 1;
					                       		this.getsortingArrow(event);
					                       	},
					                       error =>{
					                       		this.errorMessage = <any>error;
					                       }); 
		}else{
			this.data = this.data.reverse();
		}
	}	

	getsortingArrow(event){
		let all_elements = document.getElementsByClassName('sorting');
		let element = event.target.firstElementChild;
		for(var i=0; i< all_elements.length ; i++){
			if(i != event.target.cellIndex) all_elements[i].innerHTML = "";
		}
		if(element.innerHTML == "" || element.innerHTML == "▲" ){
			element.innerHTML = '▼';
		}else{
			element.innerHTML = '▲';
		}
	}

	createRange(number){
	  var items = [];
	  for(var i = 1; i <= number; i++){
	     items.push(i);
	  }
	  if(!Number.isInteger(number)){
	  	 items.push(i);
	  }
	  return items;
	}

	nextPage(page,event,direction){
		if(this.tableService.ajax == true){
			if(page){
				let from = (page -1) * this.size;
				let to = this.size;
				this.tableService.limit = from + "," +to; 
				this.data = [];
				this.selected_page = page;
				this.getData();
			}else{
				var page;
				direction == 'up' ? page = this.selected_page +1 :  page = this.selected_page - 1;
				if(page  > this.count/this.size || page  <= 0){
					// dont get pages that dont exist like page 0 or page thats bigger then our paging range
				}else{
					let from = (page -1) * this.size;
					let to = this.size;
					this.tableService.limit = from + "," +to; 
					this.data = [];
					this.selected_page = page;
					this.getData();
				}
			}
		}else{
			this.paging_index = (page -1 ) * this.size; 
		}
	}

	setSize(option){
		this.size = eval(option) ;
		this.tableService.size = this.size; 
		this.tableService.limit = '0 , '+ this.size;
		if(this.tableService.ajax == true ){
			return this.getData();           	
		}
	}

	trigerTableReDraw(){
		this.tableService.limit = "0 , "+this.size;
		this.selected_page = 1 ;
		this.zone.run(()=>{
			this.getData();
		});								
	}

}