import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class GeneralutilsService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, duration?: number) {
    this.snackBar.open(message, 'close', {
      duration: duration ? duration : 3000,
    });
  }
}
