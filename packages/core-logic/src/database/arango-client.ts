import { Database } from 'arangojs';
import { config } from '@aletheia/config';

export class ArangoClient {
  private static instance: Database;

  public static getInstance(): Database {
    if (!this.instance) {
      const { url, dbName, user, password, jwtToken, useJwt } = config.arango;

      this.instance = new Database({
        url: url,
        databaseName: dbName,
      });

      if (useJwt && jwtToken) {
        this.instance.useToken(jwtToken);
      } else if (password) {
        // If we have a password but want to use JWT, we might need to login first
        // But for simplicity, we'll use basic auth for now if no token is provided
        // or the specific JWT login flow if required.
        this.instance.useBasicAuth(user, password);
      }
    }

    return this.instance;
  }

  /**
   * Helper to perform JWT login if needed
   */
  public static async login(password: string): Promise<string> {
    const { url, user, dbName } = config.arango;
    const db = new Database({ url, databaseName: dbName });
    const token = await db.login(user, password);
    if (this.instance) {
      this.instance.useToken(token);
    }
    return token;
  }
}
