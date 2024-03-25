import {Day} from "../models/day.model";
import {ScheduledEvent} from "../models/scheduledEvent";


export function DayFactory(date: Date, scheduledEvents: ScheduledEvent[], currentMonth: boolean = true): Day {
  return new Day(date, scheduledEvents, currentMonth)
}
