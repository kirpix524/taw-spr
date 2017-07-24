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
import { Skl } from './models/Skl.model';
import { Oper } from './models/Oper.model';
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

  //Справочник складов
  sprSkl: Skl[];
  sprSklTab: Skl[];
  curSkl: Skl;

  displayDialogSkl: boolean;
  dialogSklMode: string;
  headerSkl: string;
  showNotActualSkl: boolean;

  //Справочник операций
  sprOper: Oper[];
  sprOperTab: Oper[];
  curOper: Oper;

  displayDialogOper: boolean;
  dialogOperMode: string;
  headerOper: string;
  showNotActualOper: boolean;


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
      this.sprDolgn = res.sprDolgn;
      this.reloadSprDolgnTab();
      this.reloadOptionsDolgn();
      this.optionsRoles = [];
      for (let i = 0; i < res.sprRoles.length; i++) {
        this.optionsRoles.push({ label: res.sprRoles[i].name_role, value: res.sprRoles[i].id_role });
      }
    }).catch(err => {
      this.msgs.push({
        severity: 'error',
        summary: 'Ошибка при загрузке спр. должностей',
        detail: `${err}`
      });
    })

    this.rest.loadSprSotr(this.serverURL).then(res => {
      this.sprSotr = res.sprSotr;
      this.reloadSprSotrTab();
    }).catch(err => {
      this.msgs.push({
        severity: 'error',
        summary: 'Ошибка при загрузке спр. сотрудников',
        detail: `${err}`
      });
    })

    this.rest.loadSprSkl(this.serverURL).then(res => {
      this.sprSkl = res.sprSkl;
      this.reloadSprSklTab();
    }).catch(err => {
      this.msgs.push({
        severity: 'error',
        summary: 'Ошибка при загрузке спр. складов',
        detail: `${err}`
      });
    })

    this.rest.loadSprOper(this.serverURL).then(res => {
      this.sprOper = res.sprOper;
      this.reloadSprOperTab();
    }).catch(err => {
      this.msgs.push({
        severity: 'error',
        summary: 'Ошибка при загрузке спр. операций',
        detail: `${err}`
      });
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
      'id_role': this.optionsRoles[0].value,
      'actual': this.optionsYesNo[0].value
    }
    this.dialogDolgnMode = "new";
    this.headerDolgn = "Добавить новую должность";
    this.displayDialogDolgn = true;
  }

  canSaveDolgn(dolgn: Dolgn) { //Проверка, можно ли сохранить должность
    if (dolgn.actual != 'Y') {
      for (let i = 0; i < this.sprSotr.length; i++) {
        if (this.sprSotr[i].status == 'W') {
          if (CNum(this.sprSotr[i].id_dolgn) == CNum(dolgn.id_dolgn)) {
            return false
          }
        }
      }
    }
    return true
  }

  saveDolgn() {
    if (this.dialogDolgnMode == 'edit') {
      if (!this.canSaveDolgn(this.curDolgn)) {
        this.msgs.push({
          severity: 'warn',
          summary: 'Предупреждение!',
          detail: 'Нельзя сделать должность неактуальной, есть работающие сотрудники!'
        });
        return
      }
    }
    let config = { 'dolgn': this.curDolgn, 'mode': this.dialogDolgnMode };
    this.rest.saveDolgn(this.serverURL, config).then(res => {
      if (res.id_dolgn) {
        this.curDolgn.id_dolgn = res.id_dolgn;
      }
      this.sprDolgn = this.updateDolgn(this.sprDolgn, this.curDolgn);
      this.reloadSprDolgnTab();
      this.reloadOptionsDolgn();
      this.displayDialogDolgn = false;
    }).catch(err => { 
      this.msgs.push({
        severity: 'error',
        summary: 'Ошибка!',
        detail: `${err}`
      });
    });
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
    this.optionsDolgn = [];
    for (let i = 0; i < this.sprDolgn.length; i++) {
      if (this.sprDolgn[i].actual == 'Y') {
        this.optionsDolgn.push({ 'label': this.sprDolgn[i].name_dolgn, 'value': this.sprDolgn[i].id_dolgn });
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
      'phone': '',
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
    config.sotr.birth = formatDate(config.sotr.birth, "yyyy-mm-dd");
    this.curSotr.birth = formatDate(this.curSotr.birth, "dd.mm.yyyy");
    this.rest.saveSotr(this.serverURL, config).then(res => {
      if (res.id_sotr) {
        this.curSotr.id_sotr = res.id_sotr;
      }
      this.updateSotr(this.curSotr);
      this.reloadSprSotrTab();
      this.displayDialogSotr = false;
    }).catch(err => { 
      this.msgs.push({
        severity: 'error',
        summary: 'Ошибка!',
        detail: `${err}`
      });
    });
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


  //Справочник складов
  reloadSprSklTab() { //Перезагружаем табличку должностей для отображения
    this.sprSklTab = [];
    for (let i = 0; i < this.sprSkl.length; i++) {
      if (!this.showNotActualSkl) { //Выводим только актуальные
        if (this.sprSkl[i].actual == 'Y') {
          this.sprSklTab.push(this.sprSkl[i]);
        }
      } else { //Выводим все
        this.sprSklTab.push(this.sprSkl[i]);
      }
    }
    return
  }

  onSklRowSelect(event) { //При выборе строки
    this.curSkl = this.cloneObj(event.data);
    this.dialogSklMode = "edit";
    this.headerSkl = "Изменить склад";
    this.displayDialogSkl = true;
  }

  addSkl() { //Нажали Добавить
    this.curSkl = {
      'name_skl': '',
      'actual': this.optionsYesNo[0].value
    }
    this.dialogSklMode = "new";
    this.headerSkl = "Добавить новый склад";
    this.displayDialogSkl = true;
  }

  saveSkl() {
    let config = { 'skl': this.curSkl, 'mode': this.dialogSklMode };
    this.rest.saveSkl(this.serverURL, config).then(res => {
      if (res.id_skl) {
        this.curSkl.id_skl = res.id_skl;
      }
      this.updateSkl(this.curSkl);
      this.reloadSprSklTab();
      this.displayDialogSkl = false;
    }).catch(err => { 
      this.msgs.push({
        severity: 'error',
        summary: 'Ошибка!',
        detail: `${err}`
      });
    });
  }

  updateSkl(updatedSkl) { //Изменяем склад в справочнике или добавляем новый
    for (let i = 0; i < this.sprSkl.length; i++) {
      if (this.sprSkl[i].id_skl == updatedSkl.id_skl) { //Ищем склад по id
        for (let key in updatedSkl) {
          this.sprSkl[i][key] = updatedSkl[key];
        }
        return
      }
    }
    //Если не нашли - значит добавим новый
    this.sprSkl.push(updatedSkl);
    return
  }

  //Справочник операций
  reloadSprOperTab() { //Перезагружаем табличку должностей для отображения
    this.sprOperTab = [];
    for (let i = 0; i < this.sprOper.length; i++) {
      if (!this.showNotActualOper) { //Выводим только актуальные
        if (this.sprOper[i].actual == 'Y') {
          this.sprOperTab.push(this.sprOper[i]);
        }
      } else { //Выводим все
        this.sprOperTab.push(this.sprOper[i]);
      }
    }
    return
  }

  onOperRowSelect(event) { //При выборе строки
    this.curOper = this.cloneObj(event.data);
    this.dialogOperMode = "edit";
    this.headerOper = "Изменить склад";
    this.displayDialogOper = true;
  }

  addOper() { //Нажали Добавить
    this.curOper = {
      'name_oper': '',
      'need_kk': this.optionsYesNo[1].value,
      'actual': this.optionsYesNo[0].value
    }
    this.dialogOperMode = "new";
    this.headerOper = "Добавить новый склад";
    this.displayDialogOper = true;
  }

  saveOper() {
    let config = { 'oper': this.curOper, 'mode': this.dialogOperMode };
    this.rest.saveOper(this.serverURL, config).then(res => {
      if (res.id_oper) {
        this.curOper.id_oper = res.id_oper;
      }
      this.updateOper(this.curOper);
      this.reloadSprOperTab();
      this.displayDialogOper = false;
    }).catch(err => { 
      this.msgs.push({
        severity: 'error',
        summary: 'Ошибка!',
        detail: `${err}`
      });
    });
  }

  updateOper(updatedOper) { //Изменяем склад в справочнике или добавляем новый
    for (let i = 0; i < this.sprOper.length; i++) {
      if (this.sprOper[i].id_oper == updatedOper.id_oper) { //Ищем склад по id
        for (let key in updatedOper) {
          this.sprOper[i][key] = updatedOper[key];
        }
        return
      }
    }
    //Если не нашли - значит добавим новый
    this.sprOper.push(updatedOper);
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

    //Справочник складов
    this.sprSkl = [];
    this.sprSklTab = [];
    this.curSkl = {};
    this.displayDialogSkl = false;
    this.dialogSklMode = "new";
    this.headerSkl = "";
    this.showNotActualSkl = false;

    //Справочник операций
    this.sprOper = [];
    this.sprOperTab = [];
    this.curOper = {};
    this.displayDialogOper = false;
    this.dialogOperMode = "new";
    this.headerOper = "";
    this.showNotActualOper = false;
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

