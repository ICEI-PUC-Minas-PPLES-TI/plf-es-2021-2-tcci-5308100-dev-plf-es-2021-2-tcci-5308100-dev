import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from '~/database/database.module';

export async function seeder(providerClass) {
  if (process.env.NODE_ENV !== 'SEEDING') return;
  console.log('Start seeding');

  const appStandalone = await NestFactory.createApplicationContext(
    DatabaseModule,
  );

  try {
    const provider = appStandalone.get(providerClass);

    await provider
      .seed()
      .then(() => {
        console.log('Seeding complete!');
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.log(error);
    console.log('Seeding failed!');
  } finally {
    appStandalone.close();
  }
}
