import { Component, OnInit } from '@angular/core';
import { Message, TreeNode, SelectItem, DropdownModule, CalendarModule } from 'primeng/primeng';
// сервисы
import { RestService } from './services/Rest.service';
// общее
import { piece } from './common/piece';
// модели
import { Dolgn } from './models/Dolgn.model';
import { formatDate } from './common/stringFunctions';


@Component({
  selector: 'my-app',
  templateUrl: './app/app.component.html',
  styles: [``],
  entryComponents: [],
  providers: [RestService],
})

export class AppComponent implements OnInit {
  appName = 'Справочники v.1.0.0';
  msgs: Message[];
  blockedDocument: Boolean;
  serverURL: string;
  daysOfWeek: SelectItem[];
  ru: any;

  sprDolgn: Dolgn[];

  constructor(private rest: RestService) {
    this.ru = {
      firstDayOfWeek: 1,
      dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      dayNamesShort: ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      dayNamesMin: ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
    };
  }

  ngOnInit() {
    this.msgs = [];
    this.serverURL="http://127.0.0.1:8888/"
  }

  loadSpr() {
    this.rest.loadSprDol(this.serverURL).then(res=>{
      this.sprDolgn = res;
      console.log('sprDolgn:');
      console.dir(res);
    })
  }

  ngAfterViewInit() { }

  blockUI() { this.blockedDocument = true; }

  unblockUI() { this.blockedDocument = false; }
}

