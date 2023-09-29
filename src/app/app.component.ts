import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {MatMenuTrigger} from "@angular/material/menu";
import {ColumnEditableModel} from "./column-editable/column-editable.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {

  allColumn: string[] = ['id', 'title', 'body', 'title1', 'body1', 'title2', 'body2', 'title3', 'body3'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  public getValue: any[] = [];
  selection = new SelectionModel<any>(true, []);

  constructor(private http: HttpClient) {
  }

  columns: ColumnEditableModel[] = [
    {
      name: 'Title',
      value: 'title',
      show: true,
    },
    {
      name: 'Body',
      value: 'body',
      show: true,
    },
    {
      name: 'Title 1',
      value: 'title1',
      show: true,
    },
    {
      name: 'Body 1',
      value: 'body1',
      show: true,
    },
    {
      name: 'Title 2',
      value: 'title2',
      show: true,
    },
    {
      name: 'Body 2',
      value: 'body2',
      show: true,
    },
    {
      name: 'Title 3',
      value: 'title3',
      show: true,
    },
    {
      name: 'Body 3',
      value: 'body3',
      show: true,
    }
  ]

  ngOnInit() {
    const storedColumns = localStorage.getItem('allColumn');
    if (storedColumns) {
      this.columns = JSON.parse(storedColumns);
    }
    this._checkColumn();
    this.getMethod();
  }

  private _checkColumn(): void {
    let newColumn: string[] = [];
    this.allColumn.forEach(e => {
      const index = this.columns.findIndex(s => s.value == e);
      if (index == -1) {
        newColumn.push(e);
      } else if (this.columns[index].show) {
        newColumn.push(e);
      }
    });
    this.displayedColumns = newColumn;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getMethod() {
    this.http.get('https://jsonplaceholder.typicode.com/posts')
      .subscribe((data) => {
        console.log(data);
        this.getValue = data as [];
        this.dataSource.data = data as [];
      })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
    let com
  }

  onSave(columns: any[]): void {
    this.columns = columns;
    this._checkColumn();
    this.trigger.closeMenu();
    localStorage.setItem("allColumn", JSON.stringify(this.columns))
  }

  onDeleteSelected() {

  }

  getWidth(column: string) {
    const index = this.columns.findIndex(f => f.value == column);
    if (index < 0) return 'auto';
    if (this.columns[index].width == null) return 'auto';
    return `${this.columns[index].width}px`;
  }
}
