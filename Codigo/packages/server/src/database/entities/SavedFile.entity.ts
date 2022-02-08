import { AfterLoad, Column, Entity } from 'typeorm';
import { Model } from './Model.abstract';
import { SavedFile as ISavedFile, FileType } from '@sec/common';

console.log(Model);
@Entity()
export class SavedFile extends Model implements ISavedFile {
  @Column()
  name: string;

  @Column()
  filename: string;

  @Column({ enum: FileType })
  type: FileType;

  path: string;

  urlPath: string;

  @AfterLoad()
  getPath() {
    const path = '';
    this.path = path;
    return path;
  }

  @AfterLoad()
  getUrlPath() {
    const urlPath = '';
    this.urlPath = urlPath;
    return urlPath;
  }
}
