import { Component, OnInit } from '@angular/core';
import { Message, TreeNode, SelectItem, DropdownModule, CalendarModule } from 'primeng/primeng';
// сервисы
import { RestService } from './services/Rest.service';
// общее
import { piece } from './common/piece';
// модели
import { Dolgn } from './models/Dolgn.model';
import { Role } from './models/Role.model';
import { Sotr } from './models/Sotr.model';
import { formatDate, CNum } from './common/stringFunctions';


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
  formatDateLoc = formatDate;

  //Для выпадающих списков
  optionsYesNo: any; //Да/нет
  optionsWorkFire: any;//Работающий/уволенный
  optionsRoles: any;
  optionsDolgn: any;
  //Справочник должностей
  sprDolgn: Dolgn[];
  sprDolgnTab: Dolgn[];
  curDolgn: Dolgn;

  displayDialogDolgn: boolean;
  dialogDolgnMode: string;
  headerDolgn: string;
  showNotActualDolgn: boolean;

  //Справочник сотрудников
  sprSotr: Sotr[];
  sprSotrTab: Sotr[];
  curSotr: Sotr;

  displayDialogSotr: boolean;
  dialogSotrMode: string;
  headerSotr: string;
  showNotActualSotr: boolean;



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
      { label: 'Да', value: 'Y' },
      { label: 'Нет', value: 'N' }
    ]
    this.optionsWorkFire = [
      { label: 'Работающий', value: 'W' },
      { label: 'Уволенный', value: 'F' }
    ]

  }

  ngOnInit() {
    console.log("ngOnInit");
    this.msgs = [];
    this.serverURL = "http://127.0.0.1:8888";
    this.init();
    this.loadSpr();
  }

  loadSpr() { //Загрузка справочников с сервера
    this.rest.loadSprDolgn(this.serverURL).then(res => {
      console.dir(res);
      this.sprDolgn = res.sprDolgn;
      this.reloadSprDolgnTab();
      this.reloadOptionsDolgn();
      this.optionsRoles = [];
      for (let i = 0; i < res.sprRoles.length; i++) {
        this.optionsRoles.push({ label: res.sprRoles[i].name_role, value: res.sprRoles[i].id_role });
      }
    }).catch(err => {
      this.msgs.push("Ошибка при загрузке спр должностей: " + err.message);
    })

    this.rest.loadSprSotr(this.serverURL).then(res => {
      console.dir(res);
      this.sprSotr = res.sprSotr;
      this.reloadSprSotrTab();
    }).catch(err => {
      this.msgs.push("Ошибка при загрузке спр должностей: " + err.message);
    })
  }

  //Справочник должностей
  reloadSprDolgnTab() { //Перезагружаем табличку должностей для отображения
    this.sprDolgnTab = [];
    for (let i = 0; i < this.sprDolgn.length; i++) {
      if (!this.showNotActualDolgn) { //Выводим только актуальные
        if (this.sprDolgn[i].actual == 'Y') {
          this.sprDolgnTab.push(this.sprDolgn[i]);
        }
      } else { //Выводим все
        this.sprDolgnTab.push(this.sprDolgn[i]);
      }
    }
    return
  }

  onDolgnRowSelect(event) { //При выборе строки
    this.curDolgn = this.cloneObj(event.data);
    this.dialogDolgnMode = "edit";
    this.headerDolgn = "Изменить должность";
    this.displayDialogDolgn = true;
  }

  addDolgn() { //Нажали Добавить
    this.curDolgn = {
      'name_dolgn': '',
      'name_role': '',
      'id_role': this.optionsRoles[0].value,
      'actual': this.optionsYesNo[0].value
    }
    this.dialogDolgnMode = "new";
    this.headerDolgn = "Добавить новую должность";
    this.displayDialogDolgn = true;
  }

  saveDolgn() {
    let config = { 'dolgn': this.curDolgn, 'mode': this.dialogDolgnMode };
    this.rest.saveDolgn(this.serverURL, config).then(res => {
      if (res.id_dolgn) {
        this.curDolgn.id_dolgn = res.id_dolgn;
      }
      this.curDolgn.name_role = this.getRoleName(this.curDolgn.id_role);
      this.sprDolgn = this.updateDolgn(this.sprDolgn, this.curDolgn);
      this.reloadSprDolgnTab();
      this.reloadOptionsDolgn();
      this.displayDialogDolgn = false;
    }).catch(err => { this.msgs.push("Ошибка:" + err.message) });
  }

  updateDolgn(sprDolgn, updatedDolgn) { //Изменяем должность в справочнике или добавляем новую
    for (let i = 0; i < sprDolgn.length; i++) {
      if (sprDolgn[i].id_dolgn == updatedDolgn.id_dolgn) { //Ищем должность по id
        for (let key in updatedDolgn) {
          sprDolgn[i][key] = updatedDolgn[key];
        }
        return sprDolgn
      }
    }
    //Если не нашли - значит добавим новую
    sprDolgn.push(updatedDolgn);
    return sprDolgn
  }

  getRoleName(id_role) { //получение названия интерфейса по id
    for (let i = 0; i < this.optionsRoles.length; i++) {
      if (CNum(this.optionsRoles[i].value) == CNum(id_role)) {
        return this.optionsRoles[i].label;
      }
    }
    return '';
  }

  reloadOptionsDolgn() { //Перезагрузка выпадающего списка должностей
    this.optionsDolgn=[];
    for (let i=0;i<this.sprDolgn.length; i++) {
      if (this.sprDolgn[i].actual == 'Y') {
          this.optionsDolgn.push({'label':this.sprDolgn[i].name_dolgn, 'value':this.sprDolgn[i].id_dolgn});
        }
    }
  }

  getDolgnName(id_dolgn) { //получение названия должности по id
    for (let i = 0; i < this.optionsDolgn.length; i++) {
      if (CNum(this.optionsDolgn[i].value) == CNum(id_dolgn)) {
        return this.optionsDolgn[i].label;
      }
    }
    return '';
  }
  //Справочник сотрудников
  reloadSprSotrTab() {
    this.sprSotrTab = [];
    for (let i = 0; i < this.sprSotr.length; i++) {
      if (!this.showNotActualSotr) { //Выводим только Работающих
        if (this.sprSotr[i].status == 'W') {
          this.sprSotrTab.push(this.sprSotr[i]);
        }
      } else { //Выводим все
        this.sprSotrTab.push(this.sprSotr[i]);
      }
    }
  }

  onSotrRowSelect(event) {
    this.curSotr = this.cloneObj(event.data);
    this.dialogSotrMode = "edit";
    this.headerSotr = "Изменить данные сотрудника";
    this.displayDialogSotr = true;
  }

  addSotr() {
    this.curSotr = {
      'name_sotr': '',
      'birth': '',
      'phone':'',
      'id_dolgn': this.optionsDolgn[0].value,
      'name_dolgn': this.optionsDolgn[0].label,
      'status': this.optionsWorkFire[0].value
    }
    this.dialogSotrMode = "new";
    this.headerSotr = "Добавить нового сотрудника";
    this.displayDialogSotr = true;
  }

  saveSotr() {
    let config = { 'sotr': this.curSotr, 'mode': this.dialogSotrMode };
    config.sotr.birth=formatDate(config.sotr.birth,"yyyy-mm-dd");
    this.curSotr.birth=formatDate(this.curSotr.birth,"dd.mm.yyyy");
    this.rest.saveSotr(this.serverURL, config).then(res => {
      if (res.id_sotr) {
        this.curSotr.id_sotr = res.id_sotr;
      }
      this.updateSotr(this.curSotr);
      this.reloadSprSotrTab();
      this.displayDialogSotr = false;
    }).catch(err => { this.msgs.push("Ошибка:" + err.message) });
  }

  updateSotr(updatedSotr) {
    for (let i = 0; i < this.sprSotr.length; i++) {
      if (this.sprSotr[i].id_sotr == updatedSotr.id_sotr) { //Ищем сотрудника по id
        for (let key in updatedSotr) {
          this.sprSotr[i][key] = updatedSotr[key];
        }
        return
      }
    }
    //Если не нашли - значит добавим новую
    this.sprSotr.push(updatedSotr);
    return
  }

  //Прочие функции
  init() {
    //Справочник должностей
    this.sprDolgn = [];
    this.sprDolgnTab = [];
    this.curDolgn = {};
    this.optionsRoles = [];
    this.displayDialogDolgn = false;
    this.dialogDolgnMode = "new";
    this.headerDolgn = "";
    this.showNotActualDolgn = false;
    //Справочник сотрудников
    this.sprSotr = [];
    this.sprSotrTab = [];
    this.curSotr = {};
    this.optionsDolgn = [];
    this.displayDialogSotr = false;
    this.dialogSotrMode = "new";
    this.headerSotr = "";
    this.showNotActualSotr = false;
  }

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
      case 'W':
        return 'Работающий';
      case 'F':
        return 'Уволенный';
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

