import { Inject, Injectable } from '@nestjs/common';
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
    if (!process.env.SHOPIFY_URL) {
      return {
        token: '.',
        expiresAt: moment(),
      };
    }

    const client = new Shopify.Clients.Storefront(
      process.env.SHOPIFY_URL,
      process.env.SHOPIFY_STOREFRONT_TOKEN,
    );

    try {
      const { body } = await client.query({
        data: {
          query: `
          mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
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
      console.log(error);

      return null;
    }
  }
}
