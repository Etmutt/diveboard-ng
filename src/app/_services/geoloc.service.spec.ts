import { TestBed } from '@angular/core/testing';

import { Geoloc.ServiceService } from './geoloc.service.service';

describe('Geoloc.ServiceService', () => {
  let service: Geoloc.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geoloc.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
