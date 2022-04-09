import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Recompense } from '@Models/Recompense.entity';
import { ShopifyService } from '~/shopify/shopify.service';

@Injectable()
export class RecompenseService extends BaseService<Recompense> {
  constructor(
    @InjectRepository(Recompense)
    private readonly recompenseRepository: Repository<Recompense>,
    private readonly shopifyService: ShopifyService,
  ) {
    super(recompenseRepository, []);
    this.recompenseRepository = recompenseRepository;
  }

  public async getShopifyDiscountCoupons() {
    return await this.shopifyService.getDiscountCoupons();
  }
}
