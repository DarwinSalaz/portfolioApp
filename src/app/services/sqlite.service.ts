import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private db: SQLiteObject;

  constructor(private sqlite: SQLite) { }

  // Inicializar la base de datos
  initDatabase() {
    return this.sqlite.create({
      name: 'myDatabase.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.db = db;
    });
  }

  // Ejecutar una consulta SQL
  executeSql(query: string, params: any[] = []): Promise<any> {
    return this.db.executeSql(query, params);
  }
}
