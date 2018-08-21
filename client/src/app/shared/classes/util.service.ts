export class UtilService {

    static formatDate(date: Date): string {
        // возвращает дату в формате:  dd.mm.yyyy
        const to2Dig = (n) => { return ( n < 10 ? '0' : '') + n }
        return to2Dig(date.getDate()) + "." + to2Dig(date.getMonth() + 1) + "." + date.getFullYear();
      }

}