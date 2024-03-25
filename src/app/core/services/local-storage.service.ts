import {Injectable} from '@angular/core';
import {Day} from "../models/day.model";
import {BehaviorSubject} from "rxjs";

export interface ICalendar {
  [key: string]: Day
}
const calendar: ICalendar = {};

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private calendarStoredData$: BehaviorSubject<ICalendar> = new BehaviorSubject(calendar);
  constructor() {
    const calendarDataInStorage = this.getItem('calendarEvents');
    this.calendarStoredData$
      .subscribe( calendarData => this.setItem('calendarEvents', JSON.stringify(calendarData)))
    if(calendarDataInStorage?.length) {
      this.calendarStoredData$.next(JSON.parse(calendarDataInStorage));
    }
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string {
    return localStorage.getItem(key) || '';
  }

  getCalendarEvents() {
    return this.calendarStoredData$.value;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  updateStore(days: Day[]): void {
    days.forEach((day: Day) => {
      day.date.setHours(0,0,0,0);
      const calendarStore = this.calendarStoredData$.value;
      const searchableEvent = calendarStore[day.date.getTime()];
      if (searchableEvent) {
        searchableEvent.events = day.events;
      } else {
        calendarStore[day.date.getTime()] = day;
      }
      this.calendarStoredData$.next(calendarStore);
    })
  }
}
