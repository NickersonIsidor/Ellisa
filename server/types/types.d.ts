import { Server } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@fake-stack-overflow/shared/types/types';

// export * from '../../shared/src/types/types';
export * from '@fake-stack-overflow/shared/types/types';

/**
 * Type alias for the Socket.io Server instance.
 * - Handles communication between the client and server using defined events.
 */
export type FakeSOSocket = Server<ClientToServerEvents, ServerToClientEvents>;
