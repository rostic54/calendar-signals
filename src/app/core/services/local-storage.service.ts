import {Injectable} from '@angular/core';
import {Day} from "../models/day.model";
import {BehaviorSubject} from "rxjs";
import {scheduledEventFactory} from "../factories/scheduled-event.factory";
import {ScheduledEvent} from "../models/scheduledEvent";
import {DayFactory} from "../factories/day.factory";
import {createDateInstance} from "../utils/util";

export interface ICalendar {
  [key: string]: Day
}

const calendar: ICalendar = {};

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private calendarStoredData$: BehaviorSubject<ICalendar> = new BehaviorSubject(calendar);
  private readonly STORE_NAME_V2 = 'calendarEvents_2'
  private readonly STORE_NAME = 'calendarEvents'

  constructor() {
    this.migration(this.STORE_NAME);
    const calendarDataInStorage = this.getItem(this.STORE_NAME_V2);
    this.calendarStoredData$
      .subscribe(calendarData => this.setItem(this.STORE_NAME_V2, JSON.stringify(calendarData)))
    if (calendarDataInStorage?.length) {
      // It's just an imitation of store, that's why need to make all manipulations above.
      const storedCalendarValue: ICalendar = JSON.parse(calendarDataInStorage);
      const convertedCalendarData: ICalendar = this.convertStringsToModels(storedCalendarValue);

      this.calendarStoredData$.next(convertedCalendarData);
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
    const calendarStore = this.calendarStoredData$.value;
    days.forEach((day: Day) => {
      day.date.setHours(0, 0, 0, 0);
      const searchableEvent = calendarStore[day.date.getTime()];
      if (searchableEvent) {
        if (day.events.length) {
          searchableEvent.events = [...day.events];
        } else {
          delete calendarStore[day.date.getTime()];
        }
      } else {
        calendarStore[day.date.getTime()] = day;
      }
    })
    this.calendarStoredData$.next(calendarStore);
  }

  private convertStringsToModels(storedCalendarValue: ICalendar): ICalendar {
    for (const dayInfo in storedCalendarValue) {
      const regeneratedEvents = storedCalendarValue[dayInfo]
        .events.map(({
                       currentDate,
                       content,
                       editable,
                       id
                     }: ScheduledEvent) => scheduledEventFactory(createDateInstance(currentDate), content, editable, id))
      storedCalendarValue[dayInfo] = DayFactory(createDateInstance(storedCalendarValue[dayInfo].date), regeneratedEvents, storedCalendarValue[dayInfo].isCurrentMonth)
    }

    return storedCalendarValue;
  }

  private migration(keyForDelete: string) {
    if (localStorage.getItem(keyForDelete)) {
      localStorage.removeItem(keyForDelete)
    }
  }
}
