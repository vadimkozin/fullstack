import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MaterialService, MaterialInstance } from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { OrderPosition, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef
  modal: MaterialInstance
  oSub: Subscription
  isRoot: boolean // флаг для обозначения корневой страницы
  panding: boolean = false
  
  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersService) { }

  ngOnInit() {
    this.setRootPage()
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setRootPage()
      }
    })
  }

  ngOnDestroy() {
    this.modal.destroy()
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition)
  }

  setRootPage() {
    this.isRoot = this.router.url === '/order'
  }

  open() {
    this.modal.open()
  }

  cancel() {
    this.modal.close()
  }

  submit() {
    
    this.panding = true // что-то загружается

    // из интерфейса Order следует что нужно задать только list, остальные параметры 'сделает'  сервер
    const newOrder: Order = {
      list: this.order.list.map(item => {
        delete item._id // на бэкэнде _id не нужен
        return item
      })
    }
    this.oSub = this.ordersService.create(newOrder).subscribe(
      order => {
        MaterialService.toast(`Заказ #${order.order} был добавлен.`)
        this.order.clear()
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.modal.close()
        this.panding = false // загрузка закончилась
      }  
    )
  }


}
