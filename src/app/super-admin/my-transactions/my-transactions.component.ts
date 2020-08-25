import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.scss']
})
export class MyTransactionsComponent implements OnInit {
  isLoaderAdmin:boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
