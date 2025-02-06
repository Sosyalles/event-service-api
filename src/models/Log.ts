import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../config/database';

export class Log extends Model<
  InferAttributes<Log>,
  InferCreationAttributes<Log>
> {
  declare id: CreationOptional<number>;
  declare level: string;
  declare message: string;
  declare timestamp: CreationOptional<Date>;
  declare meta: CreationOptional<Record<string, any>>;
  declare service: string;
  declare context: CreationOptional<string>;
}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    meta: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    service: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'event-service',
    },
    context: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'logs',
    modelName: 'Log',
    timestamps: false,
  }
);

export default Log; 