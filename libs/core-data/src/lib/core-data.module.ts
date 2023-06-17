import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShufflePipe } from './pipes/shuffle/shuffle.pipe';
import { MaterialModule } from '@angular-quiz/material';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    ShufflePipe
  ],
  exports: [ShufflePipe]
})
export class CoreDataModule {}
