import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@fake-stack-overflow/shared/types/types';

export * from '@fake-stack-overflow/shared/types/types';

export type FakeSOSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
