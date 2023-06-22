import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShufflePipe } from './pipes/shuffle/shuffle.pipe';
import { MaterialModule } from '@angular-quiz/material';
import { TimerPipe } from './pipes/timer/timer.pipe';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    ShufflePipe,
    TimerPipe,
  ],
  exports: [ShufflePipe, TimerPipe]
})
export class CoreDataModule {}
