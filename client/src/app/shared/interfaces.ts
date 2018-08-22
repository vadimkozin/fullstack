import { Data } from "@angular/router";

export interface User {
    email: string,
    password: string
}

export interface Message {
    message: string
}

export interface Category {
    name: string,
    imageSrc?: string,  // картинку можно и не вводить
    user?: string,      // юзер будет известен на бэкэнде
    _id?: string        // _id будет известен только после создания записи на бэкэнде
}

export interface Position {
    name: string,
    cost: number,
    user?: string,
    category: string,
    _id?: string,
    quantity?: number
}

export interface OrderPosition {
    name: string
    cost: number
    quantity: number
    _id?: string
}

export interface Order {
    date?: Date
    order?: number
    user?: string
    list: OrderPosition[]
    _id?: string
}

export interface Filter {
    order?: number
    start?: Date
    end?: Date
}

export interface OwerviewPageItem {
    percent: number
    compare: number
    yesterday: number
    isHigher: boolean
}

export interface OwerviewPage {
    gain : OwerviewPageItem
    orders : OwerviewPageItem
}

export interface AnalyticsPage {
    average: number
    chart: AnalyticsChartItem[]
}

export interface AnalyticsChartItem {
    gain: number
    order: number
    label: string
}

