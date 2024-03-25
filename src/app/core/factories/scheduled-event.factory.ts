import {ScheduledEvent} from "../models/scheduledEvent";


export function scheduledEventFactory(date: Date, content?: string, isEditable?: boolean, id?: number): ScheduledEvent {
  return new ScheduledEvent(date, content || '', isEditable, id);
}
