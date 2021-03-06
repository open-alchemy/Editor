import { Injector } from '@angular/core';
import { TestScheduler } from 'rxjs/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppState, initialState } from '../app.state';
import {
  initialState as initialPackageState,
  PackageSpecState,
  PackageSaveState,
  PackageCredentialsState,
} from './package.reducer';
import { PackageService } from './package.service';
import * as PackageActions from './package.actions';
import { Error } from '../editor/types';

describe('PackageService', () => {
  let service: PackageService;
  let store: MockStore<AppState>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    const injector = Injector.create({
      providers: provideMockStore({ initialState }),
    });
    store = injector.get(MockStore);
    service = new PackageService(store);

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('spec$', () => {
    it('should pick the correct state', () => {
      testScheduler.run((helpers) => {
        // GIVEN store with initial state and then a different state
        const specState: PackageSpecState = {
          ...initialPackageState.spec,
          info: {
            ...initialPackageState.spec.info,
            title: 'title 1',
          },
        };
        helpers
          .cold('-b', {
            b: {
              ...initialState,
              package: { ...initialState.package, spec: specState },
            },
          })
          .subscribe((newState) => store.setState(newState));

        // WHEN

        // THEN the spec state is returned
        helpers
          .expectObservable(service.spec$)
          .toBe('ab', { a: initialPackageState.spec, b: specState });
      });
    });
  });

  describe('specInfo$', () => {
    it('should pick the correct state', () => {
      testScheduler.run((helpers) => {
        // GIVEN store with initial state and then a different state
        const specState: PackageSpecState = {
          ...initialPackageState.spec,
          info: {
            ...initialPackageState.spec.info,
            title: 'title 1',
          },
        };
        helpers
          .cold('-b', {
            b: {
              ...initialState,
              package: { ...initialState.package, spec: specState },
            },
          })
          .subscribe((newState) => store.setState(newState));

        // WHEN

        // THEN the specInfo state is returned
        helpers
          .expectObservable(service.specInfo$)
          .toBe('ab', { a: initialPackageState.spec.info, b: specState.info });
      });
    });
  });

  describe('save$', () => {
    it('should pick the correct state', () => {
      testScheduler.run((helpers) => {
        // GIVEN store with initial state and then a different state
        const saveState: PackageSaveState = {
          loading: false,
          success: true,
        };
        helpers
          .cold('-b', {
            b: {
              ...initialState,
              package: { ...initialState.package, save: saveState },
            },
          })
          .subscribe((newState) => store.setState(newState));

        // WHEN

        // THEN the save state is returned
        helpers.expectObservable(service.save$).toBe('ab', {
          a: initialState.package.save,
          b: saveState,
        });
      });
    });
  });

  describe('credentials$', () => {
    it('should pick the correct state', () => {
      testScheduler.run((helpers) => {
        // GIVEN store with initial state and then a different state
        const credentialsState: PackageCredentialsState = {
          value: { public_key: 'public key 1', secret_key: 'secret key 1' },
          loading: false,
          success: true,
        };
        helpers
          .cold('-b', {
            b: {
              ...initialState,
              package: {
                ...initialState.package,
                credentials: credentialsState,
              },
            },
          })
          .subscribe((newState) => store.setState(newState));

        // WHEN

        // THEN the credentials state is returned
        helpers.expectObservable(service.credentials$).toBe('ab', {
          a: initialState.package.credentials,
          b: credentialsState,
        });
      });
    });
  });

  describe('error$', () => {
    it('should pick the correct state', () => {
      testScheduler.run((helpers) => {
        // GIVEN store with initial state and then a different state
        const errorState: Error = {
          message: 'message 1',
        };
        helpers
          .cold('-b', {
            b: {
              ...initialState,
              package: { ...initialState.package, error: errorState },
            },
          })
          .subscribe((newState) => store.setState(newState));

        // WHEN

        // THEN the error state is returned
        helpers.expectObservable(service.error$).toBe('ab', {
          a: initialState.package.error,
          b: errorState,
        });
      });
    });
  });

  describe('saveComponentSaveClick', () => {
    it('should dispatch specs component on init action', () => {
      testScheduler.run((helpers) => {
        // GIVEN a trigger for saveComponentSaveClick
        const value = 'value 1';
        const name = 'name 1';
        helpers
          .cold('-b')
          .subscribe(() => service.saveComponentSaveClick(value, name));

        // WHEN

        // THEN store emits the expected actions
        helpers.expectObservable(store.scannedActions$).toBe('ab', {
          a: { type: '@ngrx/store/init' },
          b: PackageActions.saveComponentSaveClick({ value, name }),
        });
      });
    });
  });
});
