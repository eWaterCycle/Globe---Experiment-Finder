import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';

@Component({
  selector: 'app-mdl-drawer-right',
  templateUrl: './mdl-drawer-right.component.html',
  styleUrls: ['./mdl-drawer-right.component.css']
})
export class MdlDrawerRightComponent implements OnInit {
  @ViewChild('obfuscator') obfuscator;
  @HostBinding('class.someClass') active = false;

  constructor() {
  }

  ngOnInit() {
  }

  onClickObfuscator() {
    this.active = !this.active;
  }

}
