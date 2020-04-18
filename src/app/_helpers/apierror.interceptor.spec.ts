import { TestBed } from "@angular/core/testing";

import { APIerrorInterceptor } from "./apierror.interceptor";

describe("APIerrorInterceptor", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [APIerrorInterceptor],
    })
  );

  it("should be created", () => {
    const interceptor: APIerrorInterceptor = TestBed.inject(
      APIerrorInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});
