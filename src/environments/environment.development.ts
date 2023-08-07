import { StoreDevtoolsModule } from "@ngrx/store-devtools";

export const environment = {
  production: false,
  apiUrl: "/api",
  imports: [StoreDevtoolsModule.instrument({ maxAge: 25 })],
};
