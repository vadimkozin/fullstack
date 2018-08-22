import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements OnDestroy, AfterViewInit {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  aSub: Subscription
  average: number
  panding:boolean = true  // ожидаемый

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132'
    }

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label) // ось Х
      gainConfig.data = data.chart.map(item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label) // ось Х
      orderConfig.data = data.chart.map(item => item.order)

      // **** temp Gain ****
      // gainConfig.labels.push('22.08.2018')
      // gainConfig.labels.push('23.08.2018')
      // gainConfig.data.push(4500)
      // gainConfig.data.push(1500)
      // **** /temp Gain ****
      
     // **** temp Order ****
      // orderConfig.labels.push('22.08.2018')
      // orderConfig.labels.push('23.08.2018')
      // orderConfig.data.push(8)
      // orderConfig.data.push(2)
      // **** /temp Order ****


      // контекст графики canvas
      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.panding = false

    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig({labels, data, label, color}) {

  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]

    }
  }
}
