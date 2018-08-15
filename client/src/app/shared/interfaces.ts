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