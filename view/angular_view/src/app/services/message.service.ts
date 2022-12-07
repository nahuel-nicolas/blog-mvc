import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  log(message: string) {
    console.log(message);
  }
}
