import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-c-select',
  templateUrl: './c-select.component.html',
  styleUrls: ['./c-select.component.scss'],
})
export class CSelectComponent implements OnInit {
  // @example-start|basic
  value = null;
  // @example-end

  // @example-start|withOptions
  selectedItem = '';
  // @example-end

  // @example-start|withOptionsRich
  selectedOption = '';
  // @example-end

  // @example-start|optionsAndSelection
  selected = '';
  // @example-end

  // @example-start|scrollable|shadow
  selection = null;
  // @example-end

  // @example-start|scrollable|basic|shadow
  items = [
    { name: 'Finland', value: 'finland' },
    { name: 'Sweden', value: 'sweden' },
    { name: 'Norway', value: 'norway' },
    { name: 'Denmark', value: 'denmark' },
    { name: 'Germany', value: 'germany' },
    { name: 'Belgium', value: 'belgium' },
    { name: 'France', value: 'france' },
  ];
  // @example-end

  constructor() {}

  ngOnInit(): void {}
}
