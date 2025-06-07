import Cookies from 'js-cookie';
// import jwtDecode from 'jwt-decode';
import { defineStore } from 'pinia';

interface Tokens {
  token: string;
  refresh_token?: string;
}

interface Customer {
  id: number;
  code: string;
  [key: string]: any;
}

interface Infos {
  id: number;
  username: string;
  roles: string[];
  customers?: Customer[];
  [key: string]: any;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    tokens: null as Tokens | null,
    infos: null as Infos | null,
    defaultCustomer: null as Customer | null,
    currentCustomer: null as Customer | null,
    customers: [] as Customer[],
    refreshing: false,
    error: '',
    isAuthenticated: false,
  }),

  getters: {
    hasDefaultCustomer: (state) => !!state.defaultCustomer,
    associatedCustomers: (state) => state.customers,
  },

  actions: {
    setTokens(tokens: Tokens | null) {
      if (tokens) {
        Cookies.set('tokens', JSON.stringify(tokens), { expires: 7 });
      } else {
        Cookies.remove('tokens');
      }
      this.tokens = tokens;
    },

    setInfos(infos: Infos | null) {
      if (infos) {
        Cookies.set('infos', JSON.stringify(infos), { expires: 7 });
      } else {
        Cookies.remove('infos');
      }
      this.infos = infos;
    },

    setDefaultCustomer(customer: Customer | null) {
      if (customer) {
        Cookies.set('defaultCustomer', JSON.stringify(customer), {
          expires: 7,
        });
      } else {
        Cookies.remove('defaultCustomer');
      }
      this.defaultCustomer = customer;
    },

    setCurrentCustomer(customer: Customer | null) {
      if (customer) {
        Cookies.set('currentCustomer', JSON.stringify(customer), {
          expires: 7,
        });
      } else {
        Cookies.remove('currentCustomer');
      }
      this.currentCustomer = customer;
    },

    setCustomers(customers: Customer[]) {
      Cookies.set('customers', JSON.stringify(customers), { expires: 7 });
      this.customers = customers;
    },

    clearAuth() {
      Cookies.remove('tokens');
      Cookies.remove('infos');
      Cookies.remove('defaultCustomer');
      Cookies.remove('currentCustomer');
      Cookies.remove('customers');

      this.tokens = null;
      this.infos = null;
      this.defaultCustomer = null;
      this.currentCustomer = null;
      this.customers = [];
      this.isAuthenticated = false;
    },

    setRefreshing(refreshing: boolean) {
      this.refreshing = refreshing;
    },

    errorMessage(message: string) {
      this.error = message;
    },

    async fetchFromCookies(cookies: Record<string, any>) {
      if (
        !this.tokens ||
        !this.infos ||
        !this.defaultCustomer ||
        this.customers.length === 0
      ) {
        this.setTokens(cookies['tokens'] || null);
        this.setInfos(cookies['infos'] || null);
        this.setDefaultCustomer(cookies['defaultCustomer'] || null);
        this.setCustomers(cookies['customers'] || []);
        this.setCurrentCustomer(cookies['currentCustomer'] || null);
      }

      if (this.tokens && this.infos && this.defaultCustomer) {
        this.isAuthenticated = true;
      }
    },

    refreshTokens(tokens: Tokens) {
      this.setTokens(tokens);
    },

    loadFromCookies() {
      const tokensCookie = Cookies.get('tokens');
      const infosCookie = Cookies.get('infos');
      const defaultCustomerCookie = Cookies.get('defaultCustomer');
      const customersCookie = Cookies.get('customers');
      const currentCustomerCookie = Cookies.get('currentCustomer');

      if (tokensCookie) {
        this.setTokens(JSON.parse(tokensCookie));
      }

      if (infosCookie) {
        this.setInfos(JSON.parse(infosCookie));
      }

      if (defaultCustomerCookie) {
        this.setDefaultCustomer(JSON.parse(defaultCustomerCookie));
      }

      if (customersCookie) {
        this.setCustomers(JSON.parse(customersCookie));
      }

      if (currentCustomerCookie) {
        this.setCurrentCustomer(JSON.parse(currentCustomerCookie));
      }

      if (this.tokens && this.infos && this.defaultCustomer) {
        this.isAuthenticated = true;
      }
    },

    async setAuth(user: { username: string; password: string }) {
      try {
        const { data } = await useFetch('/login_check', {
          method: 'POST',
          body: user,
        });

        const responseData = data.value as Tokens | null;
        if (!responseData) {
          throw new Error('No tokens received');
        }

        this.setTokens(responseData);
        // const decoded = jwtDecode<Infos>(responseData.token);
        // this.setInfos(decoded);

        // const config = useRuntimeConfig();
        // const { data: userData } = await useFetch(`/users/${decoded.id}.json`, {
        //   headers: {
        //     Authorization: `Bearer ${responseData.token}`,
        //   },
        // });

        // const userInfo = userData.value as any;
        // const userCustomers: Customer[] = userInfo?.customers ?? [];

        // decoded.customers = userCustomers;

        // let selectedCustomer =
        //   userCustomers.find(
        //     (c) => c.code === config.public.DEFAULT_CUSTOMER
        //   ) || userCustomers[0];

        // if (selectedCustomer) {
        //   this.setDefaultCustomer(selectedCustomer);
        //   this.setCurrentCustomer(selectedCustomer);
        //   this.setCustomers(userCustomers);
        // }

        this.isAuthenticated = true;
      } catch (e: any) {
        this.errorMessage(e?.data?.message || 'Login failed');
      }
    },

    deleteAuth() {
      this.clearAuth();
    },

    updateDefaultCustomer(customer: Customer) {
      this.setCurrentCustomer(customer);
    },
  },
});
