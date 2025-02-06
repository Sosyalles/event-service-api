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
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import sequelize from '../config/database';
import type { Category } from './Category';
import type { EventParticipant } from './EventParticipant';

export class Event extends Model<
  InferAttributes<Event, { omit: 'category' | 'participants' }>,
  InferCreationAttributes<Event, { omit: 'category' | 'participants' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare creatorId: number;
  declare title: string;
  declare description: string;
  declare categoryId: number;
  declare location: string;
  declare eventDate: Date;
  declare maxParticipants: CreationOptional<number | null>;
  declare currentParticipants: CreationOptional<number>;

  // timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Since we're using associations, these must be defined
  declare category?: NonAttribute<Category>;
  declare participants?: NonAttribute<EventParticipant[]>;

  declare getCategory: BelongsToGetAssociationMixin<Category>;
  declare createCategory: BelongsToCreateAssociationMixin<Category>;
  declare getParticipants: HasManyGetAssociationsMixin<EventParticipant>;
  declare createParticipant: HasManyCreateAssociationMixin<EventParticipant>;

  declare static associations: {
    category: Association<Event, Category>;
    participants: Association<Event, EventParticipant>;
  };
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 1000],
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterNow(value: Date) {
          if (value < new Date()) {
            throw new Error('Event date must be in the future');
          }
        },
      },
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    currentParticipants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
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
    tableName: 'events',
    modelName: 'Event',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['creator_id'],
      },
      {
        fields: ['category_id'],
      },
      {
        fields: ['event_date'],
      },
    ],
  }
);

export default Event; 