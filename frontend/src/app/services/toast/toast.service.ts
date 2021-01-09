import { Injectable, TemplateRef } from '@angular/core';
import { ToastComponent } from 'src/app/components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: any[] = [];

  show(message: string | TemplateRef<any>, options: any = {}) {
    let id: Number = this.toasts.length
    this.toasts.push({ message, id, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
