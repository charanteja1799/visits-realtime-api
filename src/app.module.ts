import { Module } from '@nestjs/common';
import { MongoService } from './mongo/mongo.service';
import { VisitsGateway } from './visits/visits.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [MongoService, VisitsGateway],
})
export class AppModule {}
