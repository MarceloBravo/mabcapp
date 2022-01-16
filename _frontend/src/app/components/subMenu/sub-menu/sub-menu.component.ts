import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Menu } from '../../../class/menus/menu';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css'],
  encapsulation: ViewEncapsulation.None //Permite que la etiqueta del componente de angular no sea considerada en el dom
})
export class SubMenuComponent implements OnInit {
  @Input() menu?: Menu
  @Input() className: string = 'sidebar-item'

  constructor(
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
  }


  dblClick(){
    return false
  }

  clearToast(){
    this._toastService.clearToast()
  }


  getInitialStyle(menu: any): string{
    return !menu?.sub_menu ? 'display: none' : "display: block"
  }


  expandMenu(id: any){
    let ul = <HTMLUListElement> document.getElementById(id);
    (<HTMLLinkElement>ul.children[0]).style.height = (<HTMLLinkElement>ul.children[0]).style.height === '0px' ? '' : '0px';
    for(let i = 0;i < ul.children.length; i++ ){
      let isExpanded = (<HTMLLinkElement> ul.children[i].children[0]).style.display !== 'none';
      (<HTMLLinkElement> ul.children[i].children[0]).style.display = isExpanded ? 'none' : 'block';
    }
  }

}
