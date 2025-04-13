import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, ChangeStream, ChangeStreamDocument } from 'mongodb';
import { Server } from 'socket.io';

@Injectable()
export class MongoService implements OnModuleInit {
  private readonly uri = 'mongodb://localhost:27021';
  private client: MongoClient;
  private io: Server | null = null;

  constructor() {
    this.client = new MongoClient(this.uri);
  }

  setSocketServer(io: Server) {
    this.io = io;
    console.log('Socket.IO server instance set in MongoService.');
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      const db = this.client.db('charan');
      const collection = db.collection('visits');

      const changeStream: ChangeStream = collection.watch();
      console.log('Listening for changes on "visits"...');

      changeStream.on('change', (change: ChangeStreamDocument) => {
        console.log('MongoDB Change Detected:', change);
        if (this.io) {
          const updateData = this.processChange(change);
          this.io.emit('visits_update', updateData);
          console.log('Emitted to Socket.IO: visits_update', updateData);
        } else {
          console.warn('Socket.IO not set - skipping emit');
        }
      });
    } catch (error) {
      console.error('MongoDB connection failed:', error);
    }
  }

  private processChange(change: any) {
    const result: any = {
      operationType: change.operationType,
      document: change.fullDocument,
      documentKey: change.documentKey,
      timestamp: change.clusterTime,
      fieldChanges: {}
    };

    if (change.operationType === 'update') {
      result.fieldChanges = {
        updatedFields: change.updateDescription?.updatedFields || {},
        removedFields: change.updateDescription?.removedFields || [],
        truncatedArrays: change.updateDescription?.truncatedArrays || []
      };
    } else if (change.operationType === 'insert') {
      result.fieldChanges = {
        newDocument: change.fullDocument
      };
    } else if (change.operationType === 'delete') {
      result.fieldChanges = {
        deletedDocument: change.documentKey
      };
    }

    return result;
  }
}
