import { Global, Module } from "@nestjs/common";

import { ContextModule } from "./context/context.module";
import { UserModule } from "./user/user.module";

@Global()
@Module({
  imports: [  ContextModule, UserModule ],
  exports: [ ContextModule, UserModule ],
})
export class SharedModule {}
