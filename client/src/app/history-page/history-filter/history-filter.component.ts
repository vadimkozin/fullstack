import { Component, EventEmitter, Output, ViewChild, ElementRef, OnDestroy, AfterViewInit, OnInit, Input, AfterViewChecked } from '@angular/core';
import { Filter } from '../../shared/interfaces';
import { MaterialService, MaterialDatepicker } from '../../shared/classes/material.service';
import { UtilService } from '../../shared/classes/util.service';


@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  @Output() onFilter = new EventEmitter<Filter> ()
  @ViewChild('start') startRef: ElementRef
  @ViewChild('end') endRef: ElementRef

  start: MaterialDatepicker
  end: MaterialDatepicker
  order: number
  isValidate = true

  // если фильтр действует(выделен красным) 
  // и форма фильтра закрывается и снова открывается - нужно показать текущие значения
  @Input() currentFilter: Filter
  startDate: string
  endDate: string


  constructor() { }

  ngOnInit() {
    this.setFilterCurrentValues(this.currentFilter) 
  }

  ngOnDestroy() {
    this.start.destroy()
    this.end.destroy()
  }

  ngAfterViewInit() {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this))

    if (this.currentFilter.start) {
      this.start.setDate(new Date(this.currentFilter.start))
    }
    if (this.currentFilter.end) {
      this.end.setDate(new Date(this.currentFilter.end))
    }

  }

  ngAfterViewChecked() {
    MaterialService.updateTextInputs()
  }

  validate() {
    
    if (!this.start.date || !this.end.date) {
      this.isValidate = true
      return
    }
    this.isValidate = this.start.date <= this.end.date
  }

  submitFilter() {
    const filter: Filter = {}
    
    if (this.order) {
      filter.order = this.order
    }

    if (this.start.date) {
      filter.start = this.start.date
    }

    if (this.end.date) {
      filter.end = this.end.date
    }

    this.onFilter.emit(filter)
  }

  setFilterCurrentValues(filter: Filter) {
    
    if (filter.order) {
      this.order = filter.order
    }
    if (filter.start) {
      this.startDate = UtilService.formatDate(filter.start)
    }
    if (filter.end) {
      this.endDate = UtilService.formatDate(filter.end)
    }
  }

}
