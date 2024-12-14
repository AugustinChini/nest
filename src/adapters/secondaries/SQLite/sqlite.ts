import { DataSource } from "typeorm/browser";
import config from "../../../configuration/secondary/SQLite/config";
var RNFS = require("react-native-fs");

export default class SQLiteManager {
  private static DB_ROOT_DIR = "/data/data/com.nest/databases";
  private static DB_PATH = "/data/data/com.nest/databases/nest";
  private static sqlite: SQLiteManager;
  private dataSource: DataSource;
  static getInstance(): SQLiteManager {
    if (!SQLiteManager.sqlite) {
      SQLiteManager.sqlite = new SQLiteManager();
    }
    return SQLiteManager.sqlite;
  }

  constructor() {
    this.dataSource = new DataSource(config);
  }

  /**
   * Initialize the first data source connexion
   * @returns {Promise<DataSource>}
   */
  public async createConnection() {
    const promise = new Promise(async (resolve, reject) => {
      if (!this.dataSource?.isInitialized) await this.dataSource.initialize();
      resolve(this.dataSource);
      //   const fileExists = await RNFS.exists(SQLiteManager.DB_PATH);

      //   RNFS.exists(SQLiteManager.DB_ROOT_DIR)
      //     .then((exists: boolean) => {
      //       if (!exists) {
      //         return RNFS.mkdir(SQLiteManager.DB_ROOT_DIR);
      //       } else {
      //         return Promise.resolve();
      //       }
      //     })
      //     .then(async () => {
      //       if (!fileExists) {
      //         const options = {
      //           fromUrl: "https://achini.fr/downloads/nest",
      //           toFile: SQLiteManager.DB_PATH,
      //         };
      //         try {
      //           const result = await RNFS.downloadFile(options).promise;
      //           console.log(`Database downloaded : ${result.jobId}`);
      //           const res = await this.dataSource.initialize();
      //           resolve(res);
      //         } catch (e) {
      //           console.log(`Erreur while downloading the database: ${e}`);
      //           reject(e);
      //         }
      //       } else {
      //         if (!this.dataSource?.isInitialized)
      //           await this.dataSource.initialize();
      //         resolve(this.dataSource);
      //       }
      //     })
      //     .catch((error: any) => {
      //       console.log("Erreur while creating the db root dir : ", error);
      //       reject(error);
      //     });
    });

    return promise;
  }

  /**
   * startBackup
   */
  public startBackup(progress: any) {
    const promise = new Promise<void>((resolve, reject) => {
      let uploadBegin: any;
      try {
        var uploadUrl = "https://eo4jazhidrsm0a7.m.pipedream.net";
        var files = [
          {
            name: "bk_nest_db",
            filename: "nest",
            filepath: SQLiteManager.DB_PATH,
            filetype: "application/vnd.sqlite3",
          },
        ];

        // upload files
        RNFS.uploadFiles({
          toUrl: uploadUrl,
          files: files,
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          fields: {},
          begin: uploadBegin,
          progress: progress,
        })
          .promise.then((response: any) => {
            if (response.statusCode == 200) {
              resolve();
            } else {
              reject();
            }
          })
          .catch((err: any) => {
            reject();
          });
      } catch (err) {
        reject();
      }
    });

    return promise;
  }

  /**
   * getDataSource
   * @returns {DataSource}
   */
  public getDataSource() {
    return this.dataSource;
  }
}
