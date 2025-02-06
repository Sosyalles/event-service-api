import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';
import sequelize from '../config/database';
import type { Event } from './Event';
import { ParticipationStatus } from '../types/models';

export class EventParticipant extends Model<
  InferAttributes<EventParticipant, { omit: 'event' }>,
  InferCreationAttributes<EventParticipant, { omit: 'event' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare eventId: number;
  declare userId: number;
  declare status: ParticipationStatus;

  // timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Since we're using associations, these must be defined
  declare event?: NonAttribute<Event>;
  declare getEvent: BelongsToGetAssociationMixin<Event>;
  declare createEvent: BelongsToCreateAssociationMixin<Event>;

  declare static associations: {
    event: Association<EventParticipant, Event>;
  };
}

EventParticipant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ParticipationStatus)),
      allowNull: false,
      defaultValue: ParticipationStatus.PENDING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'event_participants',
    modelName: 'EventParticipant',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['event_id', 'user_id'],
        name: 'event_participants_event_user_unique',
      },
    ],
  }
);

export default EventParticipant; 