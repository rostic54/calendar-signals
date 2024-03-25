import {ScheduledEvent} from "./scheduledEvent";

export class Day {
  date: Date;
  events: ScheduledEvent[];
  isCurrentMonth: boolean;

  constructor(date: Date, events: ScheduledEvent[], currentMonth = true) {
    this.date = date;
    this.events = events;
    this.isCurrentMonth = currentMonth;
  }

  get currentDate(): number {
    return this.date.getDate();
  }

}
