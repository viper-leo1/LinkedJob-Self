import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  searchText:string='';

  @Output() searchTextChanged:EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('searchInp') searchInpRef:ElementRef;

  performSearch(){
    this.searchText = this.searchInpRef.nativeElement.value;
    console.log(this.searchText)
    this.searchTextChanged.emit(this.searchText);
    console.log(this.searchTextChanged);

  }

}
