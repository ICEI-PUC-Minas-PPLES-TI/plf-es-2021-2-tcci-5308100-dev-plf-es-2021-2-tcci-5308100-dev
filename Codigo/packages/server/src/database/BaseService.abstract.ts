import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export abstract class BaseService<T> {
  private entity: Repository<T>;

  protected constructor(
    entity: Repository<T>,
    defaultRelations: string[] = [],
  ) {
    this.entity = entity;
    this.defaultRelations = defaultRelations;
  }

  public readonly defaultRelations: string[];

  public async findOneById(id: number): Promise<T | undefined> {
    try {
      return await this.entity.findOneOrFail(id);
    } catch (error) {
      return undefined;
    }
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.find();
  }

  public async softDelete(id: number): Promise<boolean> {
    try {
      await this.entity.softDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    return this.entity.create(data);
  }

  public async createAndSave(data: DeepPartial<T>): Promise<T | undefined> {
    try {
      return await this.entity.save(
        (await this.create(data)) as DeepPartial<T>,
      );
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.dir(error);
      return undefined;
    }
  }

  public async updateById(
    id: number,
    data: DeepPartial<T>,
  ): Promise<T | undefined> {
    try {
      return await this.entity.save({ id, ...data });
    } catch (error) {
      return undefined;
    }
  }

  public async findOneByIdWithRelations(
    id: number,
    relations?: string[],
  ): Promise<T | undefined> {
    try {
      return relations
        ? await this.entity.findOneOrFail({
            where: { id: id },
            relations: relations,
          })
        : await this.entity.findOneOrFail({
            where: { id: id },
            relations: this.defaultRelations,
          });
    } catch (error) {
      return undefined;
    }
  }

  public async findAllWithRelations(relations?: string[]): Promise<T[]> {
    return relations
      ? await this.entity.find({ relations: relations })
      : await this.entity.find({ relations: this.defaultRelations });
  }

  public async findWithRelations({
    where,
    relations,
  }: {
    where?: string | ObjectLiteral | FindConditions<T> | FindConditions<T>[];
    relations?: string[];
  } = {}): Promise<T[]> {
    return relations
      ? await this.entity.find({ where: where, relations: relations })
      : await this.entity.find({
          where: where,
          relations: this.defaultRelations,
        });
  }

  public async findOne(
    params: FindOneOptions<T> | FindConditions<T>,
  ): Promise<T | undefined> {
    try {
      return await this.entity.findOneOrFail(params);
    } catch (error) {
      return undefined;
    }
  }

  public async find(
    options: FindManyOptions<T> | FindConditions<T>,
  ): Promise<T[]> {
    return await this.entity.find(options);
  }

  public getRepository(): Repository<T> {
    return this.entity;
  }
}
