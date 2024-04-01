import {ScheduledEvent} from "../models/scheduledEvent";
import {IDeletePermissions} from "../../modules/day/pages/general-day-info/general-day-info.component";

export interface Information {
  info: string;
}

export interface IEventDialogData {
  appointment: ScheduledEvent,
  permissionDelete: IDeletePermissions
}
