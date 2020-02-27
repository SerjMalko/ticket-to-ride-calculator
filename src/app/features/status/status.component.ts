import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatusComponent),
      multi: true
    }
  ]
})
export class StatusComponent implements OnInit, ControlValueAccessor {

  value: boolean;

  // Function to call when changes.
  onChange = (status: boolean) => {};
  // Function to call when the input is touched;
  onTouched = () => {};

  constructor() {
  }

  ngOnInit(): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(status: boolean): void {
    this.value = status;
    this.onChange(status);
  }

  changeStatus() {
    this.value = !this.value;
    this.onChange(this.value);
  }
}
