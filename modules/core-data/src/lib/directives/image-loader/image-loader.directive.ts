import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[angularQuizImageLoader]',
})
export class ImageLoaderDirective {
  // Image URL
  @Input() angularQuizImageLoader!: string;

  // Add 'loading' class while image is loading
  @HostBinding('class.loading') isLoading = true;

  @HostListener('load')
  onLoad() {
    this.isLoading = false;
  }

  @HostListener('error')
  onError() {
    this.isLoading = false;
    // Handle error if needed
  }
}
