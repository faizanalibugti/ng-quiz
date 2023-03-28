import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShufflePipe } from './pipes/shuffle/shuffle.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ShufflePipe
  ],
  exports: [ShufflePipe]
})
export class CoreDataModule {}
