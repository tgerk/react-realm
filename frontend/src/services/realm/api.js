import axios from "axios";
import * as Realm from "realm-web";

import actions from "./actions";

function getWithCancel(http, uri) {
  const source = axios.CancelToken.source(),
    req = http.get(uri, { cancelToken: source.token });

  return [req, () => source.cancel()];
}

// resolves the promise to undefined
function ignoreCancellationError(error) {
  if (error.name !== "AbortError") {
    throw error;
  }
}
class RealmAPI {
  constructor(dispatch) {
    console.trace("constructing new RealmAPI");

    this.dispatch = dispatch;
    this.realmApp = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID });

    // setup three clients, two cannot be used without authorization
    this.http = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        "Content-type": "application/json",
      },
    });
    this.httpRealm = new Promise((resolve, reject) => {
      this.setHttpRealm = resolve;
    });
    this.realmUser = new Promise((resolve, reject) => {
      this.setRealmUser = resolve;
    });
  }

  auth(user) {
    // There are two patterns:  call functions via Web-SDK, or via webhooks
    // each has its own auth scheme, spawned concurrently

    if (!this.setHttpRealm) {
      this.httpRealm = new Promise((resolve, reject) => {
        this.setHttpRealm = resolve;
      });
    }
    this._authREST(user).then((v) => {
      this.setHttpRealm(v);
      delete this.setHttpRealm;
    });

    if (!this.setRealmUser) {
      this.realmUser = new Promise((resolve, reject) => {
        this.setRealmUser = resolve;
      });
    }

    this._authSDK(user).then((v) => {
      this.setRealmUser(v);
      delete this.setRealmUser;
    });
  }

  _authREST(user) {
    // Get a bearer token for web-hooks requiring "Application Authentication"
    // Bad news, Application Authentication does includ Anon-user.  The webhooks have been changed
    //  to run with "System" authentication
    console.info("getting realm anonymous user credential");
    return axios
      .post(process.env.REACT_APP_BASE_URL_REALM_AUTH_ANON, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then(({ data: { access_token, refresh_token } }) => {
        return axios.create({
          baseURL: process.env.REACT_APP_BASE_URL_REALM,
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });
      });
  }

  _authSDK(user) {
    console.info("logging into realm app anonymously");
    return this.realmApp.logIn(Realm.Credentials.anonymous());

    // or, for example, if Google authentication provider is enabled:
    // this.realmUser = realmApp.logIn(Realm.Credentials.google(user.google.credential));
  }

  async getCuisines() {
    const httpRealm = await this.httpRealm; // pause until auth is complete

    const [p, cancel] = getWithCancel(httpRealm, "cuisines"),
      q = p
        .then(({ data }) =>
          this.dispatch({ type: actions.GET_CUISINES, payload: data })
        )
        .catch(ignoreCancellationError);

    q.cancel = cancel;
    return q;
  }

  async getRestaurants(page = 0) {
    const httpRealm = await this.httpRealm; // pause until auth is complete

    const [p, cancel] = getWithCancel(httpRealm, "restaurants", {
        params: new URLSearchParams({ page }),
      }),
      q = p
        .then(({ data: { restaurants } }) =>
          this.dispatch({ type: actions.GET_RESTAURANTS, payload: restaurants })
        )
        .catch(ignoreCancellationError);

    q.cancel = cancel;
    return q;
  }

  async searchRestaurants(query, page = 0) {
    const httpRealm = await this.httpRealm; // pause until auth is complete

    const [p, cancel] = getWithCancel(httpRealm, "restaurants", {
        params: new URLSearchParams({ ...query, page }),
      }),
      q = p
        .then(({ data: { restaurants } }) =>
          this.dispatch({ type: actions.GET_RESTAURANTS, payload: restaurants })
        )
        .catch(ignoreCancellationError);

    q.cancel = cancel;
    return q;
  }

  async getRestaurant(id) {
    const httpRealm = await this.httpRealm; // pause until auth is complete

    return httpRealm
      .get("restaurants", { params: new URLSearchParams({ id }) }) // alternative: (await this.realmUser).function.getRestaurant(id)
      .then(({ data }) =>
        this.dispatch({ type: actions.GET_RESTAURANT, payload: data })
      );
  }

  async createReview(data) {
    const httpRealm = await this.httpRealm; // pause until auth is complete

    return httpRealm.post("reviews", data);
  }

  async updateReview({ id, ...data }) {
    const httpRealm = await this.httpRealm; // pause until auth is complete

    return httpRealm.put("reviews", {
      params: new URLSearchParams({ id }),
      data,
    });
  }

  async deleteReview(id, user_id) {
    const httpRealm = await this.httpRealm; // pause until auth is complete

    return httpRealm
      .delete("reviews", { params: new URLSearchParams({ id, user_id }) })
      .then(() => {
        this.dispatch({ action: actions.DELETE_REVIEW, payload: id });
      });
  }

  // TODO: add more actions!
}

export default RealmAPI;
