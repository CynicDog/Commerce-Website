import { Component, OnInit } from '@angular/core';
import {SalesPerson} from "./sales-person";

@Component({
  selector: 'app-sales-person-list',
  templateUrl: './sales-person-list.component.html',
  styleUrls: ['./sales-person-list.component.css']
})
export class SalesPersonListComponent implements OnInit {

  salesPersonList: SalesPerson[] = [
    new SalesPerson("Susan", "Sontag", "susan_sontag@gmail.com", 1500),
    new SalesPerson("Edward", "Carr", "edward_carr@gmail.com", 2500),
    new SalesPerson("Madan", "Sharup", "madan_sharup@gmail.com", 3000),
    new SalesPerson("Vladimir", "Nabokov","vladimir_nabokov@gmail.com", 3000)
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
