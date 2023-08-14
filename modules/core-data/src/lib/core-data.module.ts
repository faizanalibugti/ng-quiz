import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShufflePipe } from "./pipes/shuffle/shuffle.pipe";
import { MaterialModule } from "@angular-quiz/material";
import { TimerPipe } from "./pipes/timer/timer.pipe";
import { ImageLoaderDirective } from './directives/image-loader.directive';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [ShufflePipe, TimerPipe, ImageLoaderDirective],
  exports: [ShufflePipe, TimerPipe, ImageLoaderDirective],
})
export class CoreDataModule {}
