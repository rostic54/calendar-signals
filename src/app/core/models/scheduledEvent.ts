import {createDateInstance} from "../utils/util";

export class ScheduledEvent {
  id: number;
  currentDate: Date;
  content: string;
  editable: boolean;

  constructor(date: Date, content: string, editable = false, id?: number) {
    this.id = id || date.getTime();
    this.currentDate = date;
    this.content = content;
    this.editable = editable;
  }

  get year(): number {
    return this.currentDate.getFullYear();
  }

  get month(): number {
    if(!(this.currentDate instanceof Date)) {
      this.convertStringToDate(this.currentDate)
    }
    return this.currentDate.getMonth();
  }

  get dateHour(): number {
    if(!(this.currentDate instanceof Date)) {
      this.convertStringToDate(this.currentDate)
    }
    return this.currentDate.getHours();
  }

  get dateMinutes(): number {
    if(!(this.currentDate instanceof Date)) {
      this.convertStringToDate(this.currentDate)
    }
    return this.currentDate.getMinutes();
  }

  get preciseTime(): string {
    if(!(this.currentDate instanceof Date)) {
      this.convertStringToDate(this.currentDate)
    }
    const hours = String(this.dateHour).padStart(2, '0');
    const minutes = String(this.dateMinutes).padStart(2, '0');
    return `${hours}:${minutes}`
  }

  private convertStringToDate(date: string) {
    this.currentDate = createDateInstance(date);
  }

}
