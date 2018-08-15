import { Component, OnInit } from '@angular/core';
import { BaseService } from '../shared/services/base.service';
import { Observable } from 'rxjs';
import { User } from '../shared/interfaces';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  users$: Observable<User[]>

  constructor(private base: BaseService) { }

  ngOnInit() {
  }

  getUsers() {
    this.users$ =  this.base.getUsers();
  }
  
}
 
