import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientModule } from 'src/shares/http-clients/http.module';
import { ConsoleModule } from 'nestjs-console';
@Module({
  imports: [HttpClientModule, ConsoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
