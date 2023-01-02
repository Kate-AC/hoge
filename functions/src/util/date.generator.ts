export class DateGenerator {
    static getDate1WeekAgo(): Date {
        const timeStamp1WeekAgo = (new Date).getTime() - (1000 * 60 * 60 * 24 * 7)
        return new Date(timeStamp1WeekAgo)
    }

    static getDate1DayLater(): Date {
        const timeStamp1DayLater = (new Date).getTime() + (1000 * 60 * 60 * 24 * 1)
        return new Date(timeStamp1DayLater)
    }
}
