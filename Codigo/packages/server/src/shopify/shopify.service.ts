/**
 * https://github.com/graphql/graphql-js
 * https://github.com/apollographql/graphql-tag
 * https://github.com/apollographql/eslint-plugin-graphql
 * https://github.com/firede/ts-transform-graphql-tag
 * https://github.com/gajus/babel-plugin-graphql-tag
 */
import { Inject, Injectable } from '@nestjs/common';
import { ShopifyDiscountCoupon } from '@sec/common';
import Shopify from '@shopify/shopify-api';
import * as moment from 'moment';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ShopifyService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async explorerLogin(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string; expiresAt: moment.Moment } | null> {
    if (process.env.NODE_ENV === 'development') {
      return {
        token: moment().format('YYYY-MM-DD HH:mm:ss'),
        expiresAt: moment(),
      };
    } else {
      const client = new Shopify.Clients.Storefront(
        process.env.SHOPIFY_URL,
        process.env.SHOPIFY_STOREFRONT_TOKEN,
      );

      try {
        const { body } = await client.query({
          data: {
            query: /* GraphQL */ `
              mutation customerAccessTokenCreate(
                $input: CustomerAccessTokenCreateInput!
              ) {
                customerAccessTokenCreate(input: $input) {
                  customerAccessToken {
                    accessToken
                    expiresAt
                  }
                  customerUserErrors {
                    code
                    field
                    message
                  }
                }
              }
            `,
            variables: {
              input: {
                email: credentials.email,
                password: credentials.password,
              },
            },
          },
        });

        const { customerAccessToken, customerUserErrors } = (body as any).data
          .customerAccessTokenCreate;

        if (!!customerUserErrors) {
          this.logger.error(JSON.stringify(customerUserErrors));
        }

        if (!!customerAccessToken) {
          return {
            token: customerAccessToken.accessToken,
            expiresAt: moment(customerAccessToken.expiresAt),
          };
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    }
  }

  async getDiscountCoupons(): Promise<ShopifyDiscountCoupon[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.destructuringDiscountCouponGraphQL(mockCodeDiscounts);
      } else {
        const client = new Shopify.Clients.Graphql(
          process.env.SHOPIFY_URL,
          process.env.SHOPIFY_ADMIN_TOKEN,
        );

        const { body } = await client.query({
          data: {
            query: /* GraphQL */ `
              {
                codeDiscountNodes(
                  first: 50
                  query: "status:active OR status:scheduled"
                ) {
                  edges {
                    node {
                      codeDiscount {
                        ... on DiscountCodeBasic {
                          title
                          shortSummary
                          status
                          asyncUsageCount
                          usageLimit
                          createdAt
                          startsAt
                          endsAt
                          codes(first: 10) {
                            edges {
                              node {
                                id
                                code
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              // input: {},
            },
          },
        });

        return this.destructuringDiscountCouponGraphQL(body);
      }
    } catch (error) {
      return null;
    }
  }

  private destructuringDiscountCouponGraphQL(body: Record<string, any>) {
    return (body as any).data.codeDiscountNodes.edges
      .map((discountCouponGraphQL) => this.parseDiscount(discountCouponGraphQL))
      .reduce((acc, current) => [...acc, ...current], []);
  }

  private parseDiscount(
    discountCouponGraphQL: Record<string, any>,
  ): ShopifyDiscountCoupon[] {
    const {
      title,
      shortSummary,
      status,
      asyncUsageCount,
      usageLimit,
      createdAt,
      startsAt,
      endsAt,
      codes: { edges: codesGraphQL },
    } = discountCouponGraphQL.node.codeDiscount;

    const discountCoupons: ShopifyDiscountCoupon[] = codesGraphQL.map(
      ({ node: { id, code } }) => ({
        id,
        code,
        title,
        shortSummary,
        status,
        asyncUsageCount,
        usageLimit,
        createdAt,
        startsAt,
        endsAt,
      }),
    );

    return discountCoupons;
  }
}

const mockCodeDiscounts = {
  data: {
    codeDiscountNodes: {
      edges: [
        {
          node: {
            codeDiscount: {
              title: 'MOCK_TESTE01',
              shortSummary: '10% off one-time purchase products',
              status: 'ACTIVE',
              asyncUsageCount: 0,
              usageLimit: null,
              createdAt: '2022-03-11T18:18:01Z',
              startsAt: '2022-03-11T18:17:17Z',
              endsAt: null,
              codes: {
                edges: [
                  {
                    node: {
                      id: '000001',
                      code: 'MOCK_TESTE01',
                    },
                  },
                ],
              },
            },
          },
        },
        {
          node: {
            codeDiscount: {
              title: 'MOCK_TESTE02',
              shortSummary: '10% off one-time purchase products',
              status: 'SCHEDULED',
              asyncUsageCount: 0,
              usageLimit: null,
              createdAt: '2022-04-02T04:13:54Z',
              startsAt: '2022-04-02T04:13:39Z',
              endsAt: null,
              codes: {
                edges: [
                  {
                    node: {
                      id: '000002',
                      code: 'MOCK_TESTE02',
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
  extensions: {
    cost: {
      requestedQueryCost: 702,
      actualQueryCost: 12,
      throttleStatus: {
        maximumAvailable: 1000,
        currentlyAvailable: 988,
        restoreRate: 50,
      },
    },
  },
};
