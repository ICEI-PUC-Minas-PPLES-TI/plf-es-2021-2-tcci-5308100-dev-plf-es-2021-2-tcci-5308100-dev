import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './Model.abstract';
import { SavedFile as ISavedFile, FileType } from '@sec/common';
import { ChallengeAcceptedResponse } from './ChallengeAcceptedResponse.entity';

console.log(Model);
@Entity()
export class SavedFile extends Model implements ISavedFile {
  @ManyToOne(
    () => ChallengeAcceptedResponse,
    (challengeAcceptedResponse) => challengeAcceptedResponse.savedFiles,
  )
  @JoinColumn()
  challengeAcceptedResponse: ChallengeAcceptedResponse;

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
    const urlPath = `${process.env.AWS_S3_BUCKET_URL}/${this.filename}`;
    this.urlPath = urlPath;
    return urlPath;
  }
}
