import { Component } from '@angular/core';
import { SelectorWrapperComponent } from "./features/selector-wrapper/selector-wrapper.component";

@Component({
  selector: 'app-root',
  imports: [SelectorWrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
