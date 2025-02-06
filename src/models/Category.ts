import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import sequelize from '../config/database';
import type { Event } from './Event';

export class Category extends Model<
  InferAttributes<Category, { omit: 'events' }>,
  InferCreationAttributes<Category, { omit: 'events' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: CreationOptional<string | null>;
  
  // timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Since we're using associations, these must be defined
  declare events?: NonAttribute<Event[]>;
  declare getEvents: HasManyGetAssociationsMixin<Event>;
  declare createEvent: HasManyCreateAssociationMixin<Event>;

  declare static associations: {
    events: Association<Category, Event>;
  };
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'categories',
    modelName: 'Category',
    timestamps: true,
    underscored: true,
  }
);

export default Category; 