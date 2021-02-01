import config from '@config/database';
import { createConnection } from 'typeorm';

createConnection(config);
