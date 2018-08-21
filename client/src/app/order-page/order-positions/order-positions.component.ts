import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { Position } from '../../shared/interfaces';
import { PositionsService } from '../../shared/services/positions.service';
import { OrderService } from '../order.service';
import { MaterialService } from '../../shared/classes/material.service';


@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>

  constructor(private route: ActivatedRoute, 
              private posService: PositionsService,
              private order: OrderService) { }

  ngOnInit() {
    this.positions$ = this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.posService.fetch(params['id'])
          }
        ),
        map((positions: Position[]) => {
            return positions.map(p => {
              p.quantity = 1
              return p})
          }
        )
      )
    
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Добавлено x${position.quantity}`)
    this.order.add(position)
  }

}
