import { TestBed } from '@angular/core/testing';

import { MyHeaderInterceptor } from './my-header.interceptor';

describe('MyHeaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MyHeaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MyHeaderInterceptor = TestBed.inject(MyHeaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
