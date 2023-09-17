import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShufflePipe } from './pipes/shuffle/shuffle.pipe';
import { MaterialModule } from '@angular-quiz/material';
import { TimerPipe } from './pipes/timer/timer.pipe';
import { ImageLoaderDirective } from './directives/image-loader/image-loader.directive';
import { ConfettiDirective } from './directives/confetti/confetti.directive';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    ShufflePipe,
    TimerPipe,
    ImageLoaderDirective,
    ConfettiDirective,
  ],
  exports: [ShufflePipe, TimerPipe, ImageLoaderDirective, ConfettiDirective],
})
export class CoreDataModule {}
