import { Directive, HostBinding, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[angularQuizImageLoader]",
})
export class ImageLoaderDirective {
  @Input() angularQuizImageLoader!: string; // URL of the image to load

  @HostBinding("class.loading") isLoading = true; // Add 'loading' class while image is loading

  @HostListener("load")
  onLoad() {
    this.isLoading = false;
  }

  @HostListener("error")
  onError() {
    this.isLoading = false;
    // Handle error if needed
  }
}
