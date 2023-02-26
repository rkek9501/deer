declare namespace Express {
  interface Request {
    auth?: {
      verified?: boolean;
      id?: string | boolean | null;
    } | null;
    session: {
      accessToken: string | null;
      refreshToken: string | null;
      save: (error?: any | null) => void;
      destroy: () => void;
      testNum?: number;
    };
  }
}
