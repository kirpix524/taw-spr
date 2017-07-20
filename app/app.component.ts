import { Component, OnInit } from '@angular/core';
import { Message, TreeNode, SelectItem, DropdownModule, CalendarModule } from 'primeng/primeng';
// сервисы
import { RestService } from './services/Rest.service';
// общее
import { piece } from './common/piece';
// модели
import { Dolgn } from './models/Dolgn.model';
import { Role } from './models/Role.model';
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
  optionsYesNo:any;
  //Справочник должностей
  sprDolgn: Dolgn[];
  sprDolgnTab: Dolgn[];
  curDolgn: Dolgn;
  roles: any;

  displayDialogDolgn: boolean;
  dialogDolgnMode: string;
  headerDolgn: String;
  flActualDolgn: boolean;



  constructor(private rest: RestService) {
    this.ru = {
      firstDayOfWeek: 1,
      dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      dayNamesShort: ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      dayNamesMin: ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
    };
    this.optionsYesNo = [
      {label: 'Да', value: 'Y'},
      {label: 'Нет', value: 'N'}
    ]
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.msgs = [];
    this.serverURL = "http://127.0.0.1:8888";
    this.sprDolgn = [];
    this.sprDolgnTab = [];
    this.curDolgn = {};
    this.roles = [];
    this.displayDialogDolgn=false;
    this.dialogDolgnMode="new";
    this.headerDolgn="";
    this.flActualDolgn=true;
    this.loadSpr();
  }

  loadSpr() { //Загрузка справочников с сервера
    this.rest.loadSprDolgn(this.serverURL).then(res => {
      this.sprDolgn = res.sprDolgn;
      this.sprDolgnTab = this.getSprDolgnTab(this.sprDolgn, this.flActualDolgn);
      this.roles = [];
      for (let i=0;i<res.sprRoles.length; i++) {
        this.roles.push({ label: res.sprRoles[i].name_role, value: res.sprRoles[i].id_role });
      }
    }).catch(err=>{
      this.msgs.push("Ошибка при загрузке спр должностей: "+err.message);
    })
  }

  //Справочник должностей
  getSprDolgnTab(sprDolgn, flActual) {
    let sprDolgnTab: Dolgn[];
    sprDolgnTab = [];
    for (let i = 0; i < sprDolgn.length; i++) {
      if (flActual) { //Выводим только актуальные
        if (sprDolgn[i].actual == 'Y') {
          sprDolgnTab.push(sprDolgn[i]);
        }
      } else { //Выводим все
        sprDolgnTab.push(sprDolgn[i]);
      }
    }
    return sprDolgnTab
  }

  onDolgnRowSelect(event) {
    this.curDolgn = this.cloneObj(event.data);
    this.dialogDolgnMode="edit";
    this.headerDolgn="Изменить должность";
    this.displayDialogDolgn=true;
  }

  SaveDolgn() {
    let config={'dolgn':this.curDolgn, 'mode':this.dialogDolgnMode};
    this.rest.saveDolgn(this.serverURL,config).then(res=>{
      if (res.id_dolgn) {
        this.curDolgn.id_dolgn=res.id_dolgn;
      }
      this.sprDolgn=this.updateDolgn(this.sprDolgn,this.curDolgn);
      this.sprDolgnTab=this.getSprDolgnTab(this.sprDolgn, this.flActualDolgn);
    })
  }

  updateDolgn(sprDolgn, updatedDolgn) {
    for (let i = 0; i < sprDolgn.length; i++) {
        if (sprDolgn[i].id_dolgn == updatedDolgn.id_dolgn) { //Ищем должность по id
          for (let key in updatedDolgn) {
            sprDolgn[i][key]=updatedDolgn[key];
          }
          return sprDolgn
        }
    }
    //Если не нашли - значит добавим новую
    sprDolgn.push(updatedDolgn);
    return sprDolgn
  }

  //Прочие функции
  getParName(par) {
    switch (par) {
      case 'Y':
        return 'Да'
      case 'N':
        return 'Нет'
      case 'P':
        return 'Приход';
      case 'R':
        return 'Расход';
      case 'S':
        return 'Начало';
      case 'E':
        return 'Окончание';
      default:
        return par
    }
  }

  cloneObj(obj) {
    let newObj = {};
    for (let key in obj) {
      newObj[key] = obj[key];
    }
    return newObj;
  }

  ngAfterViewInit() { }

  blockUI() { this.blockedDocument = true; }

  unblockUI() { this.blockedDocument = false; }
}

