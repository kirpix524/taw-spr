import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  ButtonModule,
  DropdownModule,
  CalendarModule,
  TreeTableModule,
  SharedModule,
  TreeNode,
  PanelModule,
  BlockUIModule,
  GrowlModule,
  TooltipModule,
  DialogModule,
  DataTableModule,
  SelectButtonModule,
  InputTextareaModule,
  TabViewModule,
  CheckboxModule,
  InputMaskModule
} from 'primeng/primeng';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    TreeTableModule,
    HttpModule,
    PanelModule,
    BlockUIModule,
    GrowlModule,
    TooltipModule,
    DialogModule,
    DataTableModule,
    SelectButtonModule,
    InputTextareaModule,
    TabViewModule,
    CheckboxModule,
    InputMaskModule
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }